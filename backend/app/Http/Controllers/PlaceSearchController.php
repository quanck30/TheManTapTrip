<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlaceSearchRequest;
use App\Http\Responses\ApiResponse;
use Backend\App\Services\PlaceSearchService;
use Exception;
use Illuminate\Support\Facades\Log;

/**
 * GooglePlacesApiを呼び出し場所を探すコントローラー
 */
class PlaceSearchController extends Controller
{

    public function __construct(private PlaceSearchService $placeSearchService, private ApiResponse $apiResponse) {}

    /**
     * 現在位置(緯度・経度)、半径、質問の回答を受け取り、条件に合致する場所を検索する
     * @param PlaceSearchRequest $request
     * @return 条件に合致した場所の検索結果
     */
    public function placeSearch(PlaceSearchRequest $request)
    {
        try {
            // 検索処理に条件を渡し、場所検索
            $result = $this->placeSearchService->search(
                $request->only(['latitude', 'longitude', 'radius']),
                $request->input('answers')
            );

            // 検索結果を返す
            return $this->apiResponse->success(
                $result,
                "データ取得に成功しました。"
            );

        } catch (Exception $e) {
            Log::error('場所検索中に例外が発生しました: ' . $e->getMessage());
            return $this->apiResponse->error(
                "サーバー内部でエラーが発生しました。",
                500,
            );
        }
    }
}
