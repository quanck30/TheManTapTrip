<?php

namespace App\Services;

class PlaceMatchCalculator
{
    public function __construct(private PlaceCategoryMapper $categoryMapper) {}

    /**
     * 場所データとユーザーの解答からマッチ度を計算する
     * @param array $formattedPlaces 成形済みの場所データ
     * @param array $answers ユーザー解答データ
     * @return array マッチ度が追加された場所データ
     */
    public function calculateMatches(array $formattedPlaces, array $answers): array
    {
        // 質問の解答に対応するカテゴリーを一つにまとめる
        $requiredTypes = [];
        $mainRequiredTypes = [];
        foreach ($answers as $questionKey => $choice) {

            // カプセル化したマッパー関数を呼び出す、メイン目的purposeのカテゴリーだけ別配列に分ける
            if ($questionKey === "purpose") {
                $mainRequiredTypes = $this->categoryMapper->getGoogleTypes($questionKey, $choice, 'match_types');
            } else {
                $types = $this->categoryMapper->getGoogleTypes($questionKey, $choice, 'match_types');
                // 配列が上書きされないように、結合していく
                $requiredTypes = array_merge($requiredTypes, $types);
            }
        }

        // 重複したカテゴリを一つにする
        $requiredTypes = array_unique($requiredTypes);

        // 全ての場所データにマッチ度を計算して、データを追加
        foreach ($formattedPlaces as $key => $place) {
            $placeTypes = $place['types'] ?? [];

            // 共通した要素を抽出
            $matchedTypes = array_intersect($placeTypes, $requiredTypes);
            $mainMatchedTypes = array_intersect($placeTypes, $mainRequiredTypes);
            $primaryType = $place['primary_type'] ?? ($placeTypes[0] ?? null);          // その場所の「本業ジャンル」を取得（なければ配列の先頭を代用）

            // 場所のマッチ度を計算
            $matchTypesCount = count($matchedTypes);
            $matchScore = $matchTypesCount > 0 ? (count($matchedTypes) / $matchTypesCount) * 10 : 0;

            $mainMatchTypesCount = count($matchedTypes);
            $matchScore = $matchScore + $mainMatchTypesCount > 0 ? (count($mainMatchedTypes) / $mainMatchTypesCount) * 30 : 0;

            // 0~100点内に収める
            $formattedPlaces[$key]['match_score'] = max(0, min(100, $matchScore));

            // メインタイプが目的に含まれていたらマッチ度を上げる
            $bonus_score = 0;
            if ($primaryType && in_array($primaryType, $mainRequiredTypes)) {
                $bonus_score = 40;
            }

            // 基本スコアボーナススコア
            $total_score = $matchScore + $bonus_score;

            // 0~100点内に収める
            $formattedPlaces[$key]['match_score'] = max(0, min(100, $total_score));
        }

        // スコアで降順に並び変える
        usort($formattedPlaces, function ($a, $b) {
            return $b['match_score'] <=> $a['match_score'];
        });

        return $formattedPlaces;
    }
}

?>
