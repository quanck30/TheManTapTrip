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
            // スコアの内訳を、画面で説明するための理由と注意点として記録する
            $matchReasons = [];
            $matchWarnings = [];

            // ----------------------------------------------------
            // メイン目的（purpose）の採点 [最大 50点]
            // ----------------------------------------------------
            if (!empty($mainPurposeTypes)) {
                if ($primaryType && in_array($primaryType, $mainPurposeTypes)) {
                    // スポットの本業ジャンルが、ユーザーの目的にドンピシャなら満点
                    $totalScore += 50;
                    $matchReasons[] = '希望した目的にぴったりです。';
                }
                // 本業ではなくても、関連タグに1つでも含まれていれば部分点
                $countPurposeTag = count(array_intersect($placeTypes, $mainPurposeTypes));
                if ($countPurposeTag > 0) {
                    $totalScore += $countPurposeTag * 5;
                    $matchReasons[] = '希望した目的に関連するスポットです。';
                }
            }

            // ----------------------------------------------------
            // 屋内・屋外（locationType）の採点 [最大 20点]
            // ----------------------------------------------------
            if (!empty($locationTypeTypes)) {
                $countLocationTypeTag = count(array_intersect($placeTypes, $locationTypeTypes));
                if ($countLocationTypeTag > 0) {
                    $totalScore += $countLocationTypeTag * 10;
                    // ユーザーが選んだ屋内・屋外条件に合わせて、表示用の説明文を作る
                    $locationReasonMap = [
                        'indoor' => '屋内で楽しめるスポットです。',
                        'outdoor' => '屋外で楽しめるスポットです。',
                        'any' => '屋内・屋外どちらでも楽しめる候補です。',
                    ];
                    $matchReasons[] = $locationReasonMap[$answers['locationType'] ?? ''] ?? '希望した場所の条件に合っています。';
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
                    $matchReasons[] = '子供連れに適した設備があります。';
                }

                // 子供向けメニューの有無
                if (($place['menuForChildren'] ?? null) === true) {
                    // 食事目的（eat）の時は子連れにとって価値が高いので多めに加点
                    $childrenPoints += (($answers['purpose'] ?? '') === 'eat') ? 10 : 5;
                    $matchReasons[] = '子供向けメニューがあります。';
                }

                // 子連れ向けのカテゴリタグを保持しているか
                $hasChildrenTag = !empty(array_intersect($placeTypes, $childrenTypes));
                if ($hasChildrenTag && $childrenPoints < 10) {
                    $childrenPoints += 5; // フラグがなくてもタグがあれば補填
                    $matchReasons[] = '子供向けのカテゴリに該当します。';
                }

                $totalScore += min(20, $childrenPoints); // 最大20点

                if ($childrenPoints === 0) {
                    // 情報がない場合は、ユーザーが判断できるよう注意点として伝える
                    $matchWarnings[] = '子供向け情報が登録されていません。';
                }
            }

            // ----------------------------------------------------
            // 価格帯（priceLevel）の採点 [最大 15点]
            // ----------------------------------------------------
            if (isset($answers['priceLevel']) && isset($place['priceLevel'])) {
                if ($this->isPriceLevelMatch($answers['priceLevel'], $place['priceLevel'])) {
                    $totalScore += 15;
                    $matchReasons[] = '希望した予算に合っています。';
                } else {
                    // スコアを下げる代わりに、予算が一致しない可能性を表示する
                    $matchWarnings[] = '希望した予算と異なる可能性があります。';
                }
            } elseif (isset($answers['priceLevel'])) {
                // 価格データがない場合は、未登録であることを明示する
                $matchWarnings[] = '料金情報が登録されていません。';
            }

            // ----------------------------------------------------
            // 移動手段・駐車場（travelMode）の採点 [最大 5点]
            // ----------------------------------------------------
            if (($answers['travelMode'] ?? null) === 'drive') {
                // 車移動なのに駐車場がないスポットはマイナス、またはあるスポットを優遇
                if (($place['hasParking'] ?? false) === true) {
                    $totalScore += 5;
                    $matchReasons[] = '駐車場があるため、車で行きやすいです。';
                } else {
                    $matchWarnings[] = '駐車場情報がありません。';
                }
            } else {
                // 徒歩や自転車なら、駐車場がなくても一律で基準点を与える
                $totalScore += 5;
                $matchReasons[] = '希望した移動手段で探した候補です。';
            }

            // 最終スコアを0〜100に収める
            $formattedPlaces[$key]['matchScore'] = max(0, min(100, $totalScore));
            // 同じ説明が複数表示されないように重複を削除してAPIへ渡す
            $formattedPlaces[$key]['matchReasons'] = array_values(array_unique($matchReasons));
            $formattedPlaces[$key]['matchWarnings'] = array_values(array_unique($matchWarnings));

            if (empty($formattedPlaces[$key]['matchReasons'])) {
                // 理由がない場合でも、候補になったことを最低限説明する
                $formattedPlaces[$key]['matchReasons'][] = '選択した条件に合う候補です。';
            }

            if (empty($place['rating'])) {
                // 評価がないことは、ユーザーが比較するときの注意点として表示する
                $formattedPlaces[$key]['matchWarnings'][] = '評価情報がありません。';
            }
        }

        // 計算が終わった後、マッチ度が30点未満のノイズ店舗をここで除外する
        $formattedPlaces = array_filter($formattedPlaces, function ($place) {
            // 目的(purpose)の点数や他の要素が全く噛み合わず、30点未満になったスポットは非表示にする
            return $place['matchScore'] >= 30;
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
        // 現在の回答値はGoogleのPriceLevel文字列だが、旧形式の数値も許容する
        $map = [
            '1' => 'PRICE_LEVEL_INEXPENSIVE',
            '2' => 'PRICE_LEVEL_MODERATE',
            '3' => 'PRICE_LEVEL_EXPENSIVE',
            '4' => 'PRICE_LEVEL_VERY_EXPENSIVE',
        ];

        return ($map[$userPrice] ?? $userPrice) === $googlePrice;
    }
}
