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
    //お気に入り場所を保存
    public function store(SpotRequest $request)
    {
        try {
            $spot = Spot::create([
                'user_id' => $request->user_id,
                'spot_id' => $request->spot_id,
                'address' => $request->address,
                'is_visited' => false,
            ]);
            return ApiResponse::success(
                [
                    'spot' => $spot,
                ],
                'お気に入り場所を保存しました',
                200
            );
        } catch (Exception $e) {

            return ApiResponse::error('お気に入り場所の保存に失敗しました', 500);
        }
    }
}
