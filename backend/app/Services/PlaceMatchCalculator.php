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
        foreach ($answers as $questionKey => $choice) {
            // カプセル化したマッパー関数を呼び出す
            $types = $this->categoryMapper->getGoogleTypes($questionKey, $choice, 'match_types');

            // 配列が上書きされないように、結合していく
            $requiredTypes = array_merge($requiredTypes, $types);
        }

        // 重複したカテゴリを一つにする
        $requiredTypes = array_unique($requiredTypes);

        // 全ての場所データにマッチ度を計算して、データを追加
        foreach ($formattedPlaces as $key => $place) {
            $placeTypes = $place['types'] ?? [];

            // 共通した要素を抽出
            $matchedTypes = array_intersect($placeTypes, $requiredTypes);

            // 場所のマッチ度を計算
            $match_score = count($matchedTypes) * 5;

            // 0~100点内に収める
            $formattedPlaces[$key]['match_score'] = max(0, min(100, $match_score));
        }

        // スコアで降順に並び変える
        usort($formattedPlaces, function ($a, $b) {
            return $b['match_score'] <=> $a['match_score'];
        });

        return $formattedPlaces;
    }
}

?>
