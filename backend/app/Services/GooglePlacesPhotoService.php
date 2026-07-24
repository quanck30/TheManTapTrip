<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class GooglePlacesPhotoService
{
    private const BASE_URL = 'https://places.googleapis.com/v1';
    private const DEFAULT_MAX_WIDTH_PX = 800;
    private const MIN_IMAGE_SIZE_PX = 1;
    private const MAX_IMAGE_SIZE_PX = 4800;

    /**
     * 場所データの一覧に写真URLを追加する。
     *
     * 各場所データのphotoReferenceを利用して、
     * Google Places Photo APIからphotoUriを取得する。
     *
     * @param array<int, array<string, mixed>> $places
     * @param int $maxWidthPx
     * @param int|null $maxHeightPx
     * @return array<int, array<string, mixed>>
     */
    public function addPhotoUrls(
        array $places,
        int $maxWidthPx = self::DEFAULT_MAX_WIDTH_PX,
        ?int $maxHeightPx = null
    ): array {
        $placesWithPhotoUrl = [];

        foreach ($places as $place) {
            $photoReference = $place['photoReference'] ?? null;

            // photoReferenceが存在しない場合は、photoUrlをnullにして次の場所へ進む。
            if (!is_string($photoReference) || $photoReference === '') {
                $place['photoUrl'] = null;

                $placesWithPhotoUrl[] = $place;

                continue;
            }

            // photoReferenceから写真URLを取得して、場所データに追加する。
            $place['photoUrl'] = $this->getPhotoUrl(
                photoName: $photoReference,
                maxWidthPx: $maxWidthPx,
                maxHeightPx: $maxHeightPx
            );

            $placesWithPhotoUrl[] = $place;
        }

        return $placesWithPhotoUrl;
    }

    /**
     * 1件の写真リソース名から表示用URLを取得する。
     *
     * @param string $photoName
     * @param int $maxWidthPx
     * @param int|null $maxHeightPx
     * @return string|null
     */
    public function getPhotoUrl(
        string $photoName,
        int $maxWidthPx = self::DEFAULT_MAX_WIDTH_PX,
        ?int $maxHeightPx = null
    ): ?string {
        $apiKey = config('services.google.places_api_key');

        if (!is_string($apiKey) || $apiKey === '') {
            throw new RuntimeException(
                'Google Places APIキーが設定されていません。'
            );
        }

        $isValidPhotoName = Str::startsWith($photoName, 'places/') && Str::contains($photoName, '/photos/');

        if (!$isValidPhotoName) {
            Log::warning(
                '写真リソース名の形式が正しくありません。',
                [
                    'photo_name' => $photoName,
                ]
            );

            return null;
        }

        // Google Places Photo APIに渡すクエリパラメータを生成する。
        $query = [
            'key' => $apiKey,
            'maxWidthPx' => $this->normalizeImageSize(
                $maxWidthPx
            ),
            'skipHttpRedirect' => 'true',
        ];

        if ($maxHeightPx !== null) {
            $query['maxHeightPx'] =
                $this->normalizeImageSize($maxHeightPx);
        }

        // 写真取得用URLを生成する。
        $url = sprintf(
            '%s/%s/media',
            self::BASE_URL,
            ltrim($photoName, '/')
        );

        try {
            $response = Http::acceptJson()
                ->timeout(10)
                ->retry(2, 300)
                ->get($url, $query);

            if ($response->failed()) {
                Log::warning(
                    'Google Placesの写真URL取得に失敗しました。',
                    [
                        'photo_name' => $photoName,
                        'status' => $response->status(),
                        'response' => $response->json(),
                    ]
                );

                return null;
            }

            $photoUri = $response->json('photoUri');

            if (!is_string($photoUri) || $photoUri === '') {
                Log::warning(
                    'Google PlacesのレスポンスにphotoUriがありません。',
                    [
                        'photo_name' => $photoName,
                        'response' => $response->json(),
                    ]
                );

                return null;
            }

            return $photoUri;

        } catch (Throwable $e) {
            Log::warning(
                'Google Placesの写真URL取得中に例外が発生しました。',
                [
                    'photo_name' => $photoName,
                    'message' => $e->getMessage(),
                ]
            );

            return null;
        }
    }

    /**
     * 画像サイズをGoogle APIの許容範囲内に収める。
     *
     * @param int $size
     * @return int
     */
    private function normalizeImageSize(int $size): int
    {
        return max(
            self::MIN_IMAGE_SIZE_PX,
            min($size, self::MAX_IMAGE_SIZE_PX)
        );
    }
}
