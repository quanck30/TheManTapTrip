<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class PlaceSearchService
{
    public function __construct(private PlaceCategoryMapper $categoryMapper) {}

    /**
     * 回答をもとにGoogle Places Apiから場所を検索して返す
     * @param array $location 連想配列（latitude, longitude, radius）
     * @param array $answers ユーザーの回答（GoogleのType配列）
     * @return array 条件に合った場所
     */
    public function search(array $location, array $answers)
    {
        // GooglePlacesApi(new)呼び出しの準備
        $apikey = config('services.google.places_api_key');
        $url = 'https://places.googleapis.com/v1/places:searchNearby';

        // API検索時に使用するキーワードを設定
        $purposeTypes = $this->categoryMapper->getGoogleTypes('purpose', 'api_search_type', $answers['purpose'] ?? null);
        $searchType = !empty($purposeTypes) ? [$purposeTypes[0]] : [];

        // APIに送るリクエストBody
        $body = [
            'includedTypes' => $searchType,
            'maxResultCount' => 20,
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
                "travelMode" => "DRIVE"
            ]
        ];

        // APIリクエストの送信
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-Goog-Api-Key' => $apikey,
            // 'X-Goog-FieldMask' => 'places.id,places.displayName,places.editorialSummary,places.photos,places.formattedAddress,places.rating,places.types,places.location,places.priceLevel,places.parkingOptions,routingSummaries',       // 取得する内容

            'X-Goog-FieldMask' => 'places.id,places.displayName,places.editorialSummary,places.photos,places.formattedAddress,places.rating,places.types,places.location,places.priceLevel,places.parkingOptions',       // 取得する内容

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
        return $this->formatPlaces($rowPlaces, $rawRoutings);
    }

    /**
     * 引数のデータをフロント用に成形する
     * @param array $rowPlaces Googleから返ってきた生の場所データ
     * @param array $rawRoutings Googleから返ってきた生のルートデータ
     * @return array 成形されたデータ
     */
    private function formatPlaces(array $rowPlaces, array $rawRoutings)
    {
        $formattedPlaces = [];          // 成形後のデータ格納用

        // 取得されたすべての場所の情報を成形
        foreach($rowPlaces as $key => $place) {

            // routingSummariesの中からルート案内URL（directionUri）を取得
            $directionUrl = $rawRoutings[$key]['legs'][0]['directionUri'] ?? null;

            $lat = $place['location']['latitude'] ?? null;       // 緯度
            $lng = $place['location']['longitude'] ?? null;      // 経度

            // apiからルート案内URLを取得できなかった場合、無料URLを作成
            if (!$directionUrl) {
                if ($lat && $lng) {
                    $directionUrl = "https://www.google.com/maps/dir/?api=1&destination={$lat},{$lng}&travelmode=drive";
                }
            }

            $formattedPlaces[] = [
                    'google_place_id' => $place['id'] ?? null,                  // 場所の識別番号
                    'name' => $place['displayName']['text'] ?? '名称未設定',     // 表示名
                    'address' => $place['formattedAddress'] ?? null,            // 住所
                    'latitude' => $lat,                                         // 緯度
                    'longitude' => $lng,                                        // 経度
                    'rating' => $place['rating'] ?? null,                       // 評価
                    'types' => $place['types'] ?? [],                           // カテゴリー
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
