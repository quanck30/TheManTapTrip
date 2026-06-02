<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlaceSearchRequest;

/**
 * GooglePlacesApiを呼び出し場所を探すコントローラー
 */
class PlaceSearchController extends Controller
{
    /**
     * 現在位置(緯度・経度)、半径、質問の回答を受け取り、条件に合致する場所を検索する
     * @param PlaceSearchRequest $request
     * @return 条件に合致した場所の検索結果
     */
    public function placeSearch(PlaceSearchRequest $request)
    {
        // キーワードを設定


    }
}
