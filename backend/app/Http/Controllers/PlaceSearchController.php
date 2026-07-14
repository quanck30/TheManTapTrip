<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlaceSearchRequest;
use App\Http\Resources\PlaceResource;
use App\Http\Responses\ApiResponse;
use App\Services\PlaceMatchCalculator;
use App\Services\PlaceSearchService;
use App\Services\PlacesVisitedLastSorter;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Route;

/**
 * GooglePlacesApiを呼び出し場所を探すコントローラー
 */
class PlaceSearchController extends Controller
{

    public function __construct(
        private PlaceSearchService $placeSearchService,
        private ApiResponse $apiResponse,
        private PlaceMatchCalculator $placeMatchCalculator,
        private PlacesVisitedLastSorter $placesSorter
        ) {}

    /**
     * 現在位置(緯度・経度)、半径、質問の回答を受け取り、条件に合致する場所を検索する
     * @param PlaceSearchRequest $request
     * @return 条件に合致した場所の検索結果
     */
    public function placeSearch(PlaceSearchRequest $request)
    {
        try {
            // フロント（Postman）からの入力データを取得
            $location = $request->only(['latitude', 'longitude', 'radius']); // latitude, longitude, radius
            $answers = $request->input('answers');   // with_children, purpose など

            // 検索処理に条件を渡し、場所検索
            $result = $this->placeSearchService->search(
                $location,
                $answers
            );

            // マッチ度検索
            $result = $this->placeMatchCalculator->calculateMatches($result, $answers);

            // 行き済みを最後に並び変える
            if (Auth::check()) {
                $result = $this->placesSorter->sort($result);
            }

            // 結果が空だった場合
            if (empty($result)) {
                return $this->apiResponse->success(
                    [],
                    "指定された条件にマッチする場所が周辺で見つかりませんでした。条件を変えて再度お試しください。"
                );
            }

            // 検索結果を返す
            return $this->apiResponse->success(
                PlaceResource::collection($result),
                "データ取得に成功しました。"
            );

        } catch (Exception $e) {
            Log::error('場所検索中に例外が発生しました: ' . $e);
            return $this->apiResponse->error(
                "サーバー内部でエラーが発生しました。",
                500,
            );
        }
    }
}
