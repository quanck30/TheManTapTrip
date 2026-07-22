<?php

namespace App\Http\Controllers;

use App\Http\Requests\SpotRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Spot;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SpotController extends Controller
{
    /**
     * ログインユーザーのお気に入り一覧取得
     */
    public function index()
    {
        try {
            $spots = Auth::user()->spots;

            return ApiResponse::success(
                //テストでspotsを出している
                [
                    'spots' => $spots,
                ],
                'お気に入り一覧取得成功',
                200
            );
        } catch (Exception $e) {
            return ApiResponse::error(
                'お気に入り一覧取得失敗',
                500
            );
        }
    }

    /**
     * お気に入り登録
     */
    public function store(SpotRequest $request)
    {
        try {
            $spot = Spot::create([
                // ログインユーザーID
                'userId' => Auth::id(),

                // スポット情報
                'sName' => $request->sName,
                'spotId' => $request->spotId,
                'address' => $request->address,

                // 緯度経度
                'lat' => $request->lat,
                'long' => $request->long,

                // 評価
                'rating' => $request->rating,

                // 価格帯
                'price' => $request->price,

                // 駐車場有無
                'hasParking' => $request->hasParking ?? false,

                // 説明
                'summary' => $request->summary,

                // 写真リファレンス
                'photoReference' => $request->photoReference,

                // ルート案内URL
                'directionUrl' => $request->directionUrl,


            ]);

            return ApiResponse::success(
                //テストでspotsを出している
                [
                    'spot' => $spot,
                ],
                'お気に入り場所を保存しました',
                200
            );
        } catch (Exception $e) {
            Log::error("登録失敗", [
                'message' => $e->getMessage(), // エラー内容
                'file' => $e->getFile(),    // 発生したファイル
                'line' => $e->getLine(),    // 発生した行
            ]);

            return ApiResponse::error(
                'お気に入り登録失敗しました',
                500,

            );
        }
    }

    /**
     * お気に入り詳細取得
     */
    public function show($id)
    {
        try {
            $spot = Spot::where('id', $id)
                ->where('userId', Auth::id())
                ->firstOrFail();

            return ApiResponse::success(
                [
                    'spot' => $spot,
                ],
                'お気に入り詳細取得成功',
                200
            );
        } catch (Exception $e) {
            return ApiResponse::error(
                'お気に入りが見つかりません',
                404
            );
        }
    }

    /**
     * お気に入り削除
     */
    public function destroy($id)
    {
        try {
            $spot = Spot::where('id', $id)
                ->where('userId', Auth::id())
                ->firstOrFail();

            $spot->delete();

            return ApiResponse::success(
                [],
                'お気に入り削除成功',
                200
            );
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return ApiResponse::error(
                'お気に入り削除失敗',
                500
            );
        }
    }
}
