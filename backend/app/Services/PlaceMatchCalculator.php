<?php

namespace App\Services;

class PlaceMatchCalculator
{
    public function __construct(private PlaceCategoryMapper $categoryMapper) {}

    /**
     * 場所データとユーザーの解答からマッチ度を計算する
     */
    public function calculateMatches(array $formattedPlaces, array $answers): array
    {
        // 1. ユーザーの各要望に対応するGoogleのタイプ群をあらかじめ取得（独立して保持）
        $mainPurposeTypes = $this->categoryMapper->getGoogleTypes('purpose', $answers['purpose'] ?? null, 'matchTypes');
        $locationTypeTypes = $this->categoryMapper->getGoogleTypes('locationType', $answers['locationType'] ?? null);
        $childrenTypes = $this->categoryMapper->getGoogleTypes('withChildren', null); // 固定で取得

        foreach ($formattedPlaces as $key => $place) {
            $placeTypes = $place['types'] ?? [];
            $primaryType = $place['primaryType'] ?? ($placeTypes[0] ?? null);

            $totalScore = 0;

            // ----------------------------------------------------
            // メイン目的（purpose）の採点 [最大 50点]
            // ----------------------------------------------------
            if (!empty($mainPurposeTypes)) {
                if ($primaryType && in_array($primaryType, $mainPurposeTypes)) {
                    // スポットの本業ジャンルが、ユーザーの目的にドンピシャなら満点
                    $totalScore += 50;
                }
                // 本業ではなくても、関連タグに1つでも含まれていれば部分点
                $countPurposeTag = count(array_intersect($placeTypes, $mainPurposeTypes));
                if ($countPurposeTag > 0) {
                    $totalScore += $countPurposeTag * 5;
                }
            }

            // ----------------------------------------------------
            // 屋内・屋外（locationType）の採点 [最大 20点]
            // ----------------------------------------------------
            if (!empty($locationTypeTypes)) {
                $countLocationTypeTag = count(array_intersect($placeTypes, $locationTypeTypes));
                if ($countLocationTypeTag > 0) {
                    $totalScore += $countLocationTypeTag * 10;
                }
            }

            // ----------------------------------------------------
            // 子連れ（withChildren）の採点 [最大 20点]
            // ----------------------------------------------------
            if (isset($answers['withChildren']) && $answers['withChildren'] === true) {
                $childrenPoints = 0;

                // APIが返す明示的な子供向けフラグを最優先
                if (($place['goodForChildren'] ?? null) === true) {
                    $childrenPoints += 10;
                }

                // 子供向けメニューの有無
                if (($place['menuForChildren'] ?? null) === true) {
                    // 食事目的（eat）の時は子連れにとって価値が高いので多めに加点
                    $childrenPoints += (($answers['purpose'] ?? '') === 'eat') ? 10 : 5;
                }

                // 子連れ向けのカテゴリタグを保持しているか
                $hasChildrenTag = !empty(array_intersect($placeTypes, $childrenTypes));
                if ($hasChildrenTag && $childrenPoints < 10) {
                    $childrenPoints += 5; // フラグがなくてもタグがあれば補填
                }

                $totalScore += min(20, $childrenPoints); // 最大20点
            }

            // ----------------------------------------------------
            // 価格帯（priceLevel）の採点 [最大 15点]
            // ----------------------------------------------------
            if (isset($answers['priceLevel']) && isset($place['priceLevel'])) {
                if ($this->isPriceLevelMatch($answers['priceLevel'], $place['priceLevel'])) {
                    $totalScore += 15;
                }
            }

            // ----------------------------------------------------
            // 移動手段・駐車場（travelMode）の採点 [最大 5点]
            // ----------------------------------------------------
            if (($answers['travelMode'] ?? null) === 'drive') {
                // 車移動なのに駐車場がないスポットはマイナス、またはあるスポットを優遇
                if (($place['hasParking'] ?? false) === true) {
                    $totalScore += 5;
                }
            } else {
                // 徒歩や自転車なら、駐車場がなくても一律で基準点を与える
                $totalScore += 5;
            }

            // 最終スコアを0〜100に収める
            $formattedPlaces[$key]['matchScore'] = max(0, min(100, $totalScore));
        }

        // 計算が終わった後、マッチ度が低すぎるノイズ店舗をここで除外する
        $formattedPlaces = array_filter($formattedPlaces, function ($place) {
            // 目的(purpose)の点数や他の要素が全く噛み合わず、20点未満になったスポットは非表示にする
            return $place['matchScore'] >= 20;
        });

        // スコアで降順に並び変える
        usort($formattedPlaces, function ($a, $b) {
            return $b['matchScore'] <=> $a['matchScore'];
        });

        return $formattedPlaces;
    }

    /**
     * フロントの価格帯の回答と GoogleのPriceLevelが一致するか判定するヘルパー
     */
    private function isPriceLevelMatch(string $userPrice, string $googlePrice): bool
    {
        // Googleの返却値例: 'PRICE_LEVEL_FREE', 'PRICE_LEVEL_INEXPENSIVE', 'PRICE_LEVEL_MODERATE' など
        // あなたのフロントエンドの実装（"1", "2" など）に合わせてマッピングを調整してください
        $map = [
            '1' => 'PRICE_LEVEL_INEXPENSIVE',
            '2' => 'PRICE_LEVEL_MODERATE',
            '3' => 'PRICE_LEVEL_EXPENSIVE',
            '4' => 'PRICE_LEVEL_VERY_EXPENSIVE',
        ];

        return ($map[$userPrice] ?? '') === $googlePrice;
    }
}
