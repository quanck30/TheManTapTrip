<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlaceSearchRequest;

class PlaceSearchController extends Controller
{
    public function placeSearch(PlaceSearchRequest $request)
    {
        // キーワードを設定

        // GooglePlacesApi(new)呼び出しの準備
        $apikey = config('services.google.places_api_key');
        $url = 'https://places.googleapis.com/v1/places:searchNearby';

        // APIに送るリクエストBody
        $body = [
            "includedTypes"=> "カフェ",
            "maxResultCount"=> 5,
            "locationRestriction"=> [
                "circle"=> [
                    "center"=> [
                        "latitude"=> (double)$request->input('latitude'),
                        "longitude"=> (double)$request->input('longitude')
                    ],
                    "radius"=> (double)$request->input('radius')
                ]
            ]
        ];

        try {

        } catch(\Exception $e) {

        }
    }
}
