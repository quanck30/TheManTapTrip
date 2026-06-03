<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PlaceSearchService
{
    /**
     * 回答をもとにGoogle Places Apiから場所を検索して返す
     * @param array $location 連想配列（latitude, longitude, radius）
     * @param array $answers ユーザーの回答（GoogleのType配列）
     * @return array
     */
    public function search(array $location, array $answers)
    {
        // GooglePlacesApi(new)呼び出しの準備
        $apikey = config('services.google.places_api_key');
        $url = 'https://places.googleapis.com/v1/places:searchNearby';

        // APIに送るリクエストBody
        $body = [
            'includedTypes' => $answers,
            'maxResultCount' => 5,
            'locationRestriction' => [
                'circle' => [
                    'center' => [
                        'latitude' => (double)$location['latitude'],
                        'longitude'=> (double)$location['longitude']
                    ],
                    'radius' => (double)$location['radius']
                ]
            ]
        ];

        // APIリクエストの送信
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-Goog-Api-Key' => $apikey,
            'X-Goog-FieldMask' => 'places.id,places.displayName,places.editorialSummary,places.photos,places.formattedAddress,places.addressComponents,places.rating,places.types,places.location,places.priceLevel,places.parkingOptions',       // 取得する内容
            'Language' => 'ja',             // 言語
        ])->post($url, $body);

        // 結果のエラーチェック
        if ($response->failed()) {
            throw new \Exception('Google APIからのデータ取得に失敗しました。詳細: ' . $response->body());
        }

        // $rowPlaces = $response->json()['places'] ?? [];

        // // 結果を成形
        // $formattedPlaces = [];
        // foreach($rowPlaces as $place) {

        //     $formattedPlaces[] = [
        //             'google_place_id' => $place['id'] ?? null,
        //             'name' => $place['displayName']['text'] ?? '名称未設定',
        //             'latitude' => $place['location']['latitude'] ?? null,
        //             'longitude' => $place['location']['longitude'] ?? null,
        //             'rating' => $place['rating'] ?? null,
        //             'price_level' => $place['priceLevel'] ?? null,
        //             'primary_type' => $place['primaryType'] ?? null,
        //     ];
        // }
    }
}

?>
