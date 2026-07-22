<?php

namespace App\Services;

use App\Models\Spot;
use Illuminate\Support\Facades\Auth;

class PlacesVisitedLastSorter
{
    public function sort(array $places)
    {
        // コレクションに変換
        $places = collect($places);

        // 場所データからspotIdを取得
        $spotIds = $places
            ->pluck('spotId')
            ->filter()
            ->unique()
            ->values();

        // ログイン中ユーザーに紐づく訪問済みspotIdをDBから一括取得
        $visitedSpotIds = Spot::query()
            ->where('userId', Auth::id())
            ->where('isVisited', true)
            ->whereIn('spotId', $spotIds)
            ->pluck('spotId');

        $visitedSpotIdSet = $visitedSpotIds
            ->mapWithKeys(fn($spotId) => [(string) $spotId => true]);

        // 各場所データへisVisitedを追加
        $placesWithVisited = $places->map(
            function (array $place) use ($visitedSpotIdSet): array {
                $spotId = (string) ($place['spotId'] ?? '');

                $place['isVisited'] = isset($visitedSpotIdSet[$spotId]);

                return $place;
            }
        );

        // 訪問済み・未訪問に分割
        [$visitedPlaces, $unvisitedPlaces] = $placesWithVisited->partition(
            fn(array $place): bool => $place['isVisited'] === true
        );

        /// 未訪問を先、訪問済みを最後に並べる
        return $unvisitedPlaces
            ->concat($visitedPlaces)
            ->values();
    }
}

?>
