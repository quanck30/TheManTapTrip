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

        $purpose = $answers['purpose'] ?? null;             // 目的
        $locationType = $answers['locationType'] ?? null;   // 屋内・屋外

        // API検索時に使用するキーワードを設定
        $apiSearchKey = 'apiSearchTypes';
        if ($purpose === 'play') {
            // ユーザーの「屋内・屋外」の選択によって、Googleにリクエストするタイプを動的に切り替える
            if ($locationType === 'outdoor') {
                $apiSearchKey = 'apiSearchTypeOutdoor';
            } else {
                $apiSearchKey = 'apiSearchTypeIndoor';
            }
        }

        // マスタから取得（必ず配列または空配列が返る）
        $searchTypes = $this->categoryMapper->getGoogleTypes('purpose', $purpose, $apiSearchKey);

        // 万が一マスタとキーがズレて連想配列が丸ごと返ってきた場合の対策
        if (is_array($searchTypes) && !array_is_list($searchTypes)) {
            // 連想配列の中から、目的のキーの中身だけを抽出を試みる
            $searchTypes = $searchTypes[$apiSearchKey] ?? ['tourist_attraction'];
        }

        // 文字列で一文字だけ返ってきた場合も配列で包む
        if (is_string($searchTypes)) {
            $searchTypes = [$searchTypes];
        }

        // 万が一空っぽだった場合の処理
        if (empty($searchTypes)) {
            $searchTypes = ['tourist_attraction'];
        }

        // APIに送るリクエストBody
        $body = [
            'includedTypes' => $searchTypes,
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
            'X-Goog-FieldMask' => 'places.id,places.displayName,places.editorialSummary,places.photos,places.formattedAddress,places.rating,places.primaryType,places.types,places.location,places.priceLevel,places.parkingOptions,routingSummaries,places.goodForChildren,places.menuForChildren',
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
                'spotId' => $place['id'] ?? null,                           // 場所の識別番号
                'sName' => $place['displayName']['text'] ?? '名称未設定',    // 表示名
                'address' => $place['formattedAddress'] ?? null,            // 住所
                'lat' => $lat,                                              // 緯度
                'long' => $lng,                                             // 経度
                'rating' => $place['rating'] ?? null,                       // 評価
                'primaryType' => $place['primaryType'] ?? null,             // メインタイプ
                'types' => $place['types'] ?? [],                           // カテゴリー
                'priceLevel' => $place['priceLevel'] ?? null,               // 価格帯
                'goodForChildren' => $place['goodForChildren'] ?? null,     // 子供向けか
                'menuForChildren' => $place['menuForChildren'] ?? null,     // 子供メニューがあるか

                // 駐車場:データがない（null）の時は一律 false になるように
                'hasParking' => isset($place['parkingOptions']['freeParkingLot']) ? (bool)$place['parkingOptions']['freeParkingLot'] : false,

                // 説明文:入っていないスポットも多いため、ない場合の初期文字を設定
                'summary' => $place['editorialSummary']['text'] ?? '説明はありません。',

                // 写真:大量の配列から「1枚目の写真の名前（ID）」だけを代表でもらう
                'photoReference' => $place['photos'][0]['name'] ?? null,

                'directionUrl' => $directionUrl,                            // ルート
            ];
        }

        return $formattedPlaces;
    }
}

?>
