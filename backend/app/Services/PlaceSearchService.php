<?php

namespace Backend\App\Services;

use Illuminate\Support\Facades\Http;

class PlaceSearchService
{
    /**
     *
     */
    public function search(array $location, array $keyword): array
    {
        // GooglePlacesApi(new)呼び出しの準備
        $apikey = config('services.google.places_api_key');
        $url = 'https://places.googleapis.com/v1/places:searchNearby';

        // APIに送るリクエストBody
        $body = [
            'includedTypes' => $keyword,
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

        try {
            // APIリクエストの送信
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'X-Goog-Api-Key' => $apikey,
                'X-Goog-FieldMask' => '',       // 取得する内容
                'Language' => 'ja',             // 言語
            ])->post($url, $body);

        } catch(\Exception $e) {

        }
    }
}

?>
