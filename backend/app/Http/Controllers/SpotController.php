<?php

namespace App\Http\Controllers;

use App\Http\Requests\SpotRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Spot;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SpotController extends Controller
{
    /**
     * ログインユーザーのお気に入り一覧取得
     */
    public function index()
    {
        try {
            $spots = Spot::where('userId', Auth::id())
                ->get();

            return ApiResponse::success(
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
                // ログインユーザーのIDを保存
                'userId' => Auth::id(),

                'spotId' => $request->spot_id,
                'address' => $request->address,

                // 初回登録時は未訪問
                'isVisited' => false,
            ]);

            return ApiResponse::success(
                [
                    'spot' => $spot,
                ],
                'お気に入り場所を保存しました',
                200
            );
        } catch (Exception $e) {
            return ApiResponse::error(
                $e->getMessage(),
                500,

            );
        }
    }

    /**
     * お気に入り詳細取得
     */


    /**
     * お気に入り削除
     */
}
