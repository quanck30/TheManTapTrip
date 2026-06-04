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
            'maxResultCount' => 1,
            'locationRestriction' => [
                'circle' => [
                    'center' => [
                        'latitude' => (double)$location['latitude'],
                        'longitude'=> (double)$location['longitude']
                    ],
                    'radius' => (double)$location['radius']
                ]
            ],
            "routingParameters" => [
                "origin" => [
                    "latitude"=> (double)$location['latitude'],
                    "longitude"=> (double)$location['longitude']
                ],
                "travelMode" => "BICYCLE"
            ]
        ];

        // APIリクエストの送信
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-Goog-Api-Key' => $apikey,
            'X-Goog-FieldMask' => 'places.id,places.displayName,places.editorialSummary,places.photos,places.formattedAddress,places.addressComponents,places.rating,places.types,places.location,places.priceLevel,places.parkingOptions,routingSummaries',       // 取得する内容
            'Accept-Language' => 'ja',             // 言語
        ])->post($url, $body);

        // 結果のエラーチェック
        if ($response->failed()) {
            throw new \Exception('Google APIからのデータ取得に失敗しました。詳細: ' . $response->body());
        }

        // データ部を取得
        $rowPlaces = $response->json()['places'] ?? [];

        // Googleから places と同階層で返ってくるルート情報を取得
        $rawRoutings = $response->json()['routingSummaries'] ?? [];

        // 結果を成形して、返す
        return $this->formatPlaces($rowPlaces);
    }

    /**
     * 引数のデータをフロント用に成形する
     * @param array $rowPlaces
     * @return array{google_place_id: mixed, latitude: mixed, longitude: mixed, name: mixed, price_level: mixed, primary_type: mixed, rating: mixed[]}
     */
    private function formatPlaces(array $rowPlaces)
    {
        $formattedPlaces = [];          // 成形後のデータ格納用

        // 取得されたすべての場所の情報を成形
        foreach($rowPlaces as $key => $place) {

            // routingSummaries の中から純正のルート案内URL（directionUri）を安全に抽出
            $directionUrl = $rawRoutings[$key]['legs'][0]['directionUri'] ?? null;

            $formattedPlaces[] = [
                    'google_place_id' => $place['id'] ?? null,                  // 場所の識別番号
                    'name' => $place['displayName']['text'] ?? '名称未設定',     // 表示名
                    'address' => $place['formattedAddress'],                    // 住所
                    'latitude' => $place['location']['latitude'] ?? null,       // 緯度
                    'longitude' => $place['location']['longitude'] ?? null,     // 経度
                    'rating' => $place['rating'] ?? null,                       // 評価
                    'price_level' => $place['priceLevel'] ?? null,              // 価格帯

                    // 駐車場:データがない（null）の時は一律 false になるように
                    'has_parking' => isset($place['parkingOptions']['freeParkingLot']) ? (bool)$place['parkingOptions']['freeParkingLot'] : false,

                    // 説明文:入っていないスポットも多いため、ない場合の初期文字を設定
                    'summary' => $place['editorialSummary']['text'] ?? '説明はありません。',

                    // 写真:大量の配列から「1枚目の写真の名前（ID）」だけを代表でもらう
                    'photo_reference' => $place['photos'][0]['name'] ?? null,

                    // ルート:
                    'direction_url' => $directionUrl,
            ];
        }

        return $formattedPlaces;
    }
}

?>
