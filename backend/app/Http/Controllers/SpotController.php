<?php

namespace App\Http\Controllers;

use App\Http\Requests\SpotRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Spot;
use Exception;
use Illuminate\Http\Request;

class SpotController extends Controller
{
    //
    //お気に入り場所を登録する

    public function store(SpotRequest $request)
    {
        try {
            //お気に入りスポットを保存
            $spot = Spot::create([
                //登録したユーザーID
                'user_id' => $request->userd,

                //スポットID
                'spot_id' => $request->spot_id,

                //スポットの住所
                'address' => $request->address,

                //初回登録時は未訪問
                'is_visited' => false,
            ]);

            //保存成功
            return ApiResponse::success(
                [
                    'spot' => $spot,
                ],
                'お気に入り場所を保存しました',
                200
            );
        } catch (Exception $e) {

            //保存失敗
            return ApiResponse::error(
                'お気に入り登録失敗しました',
                500
            );
        }
    }



}
