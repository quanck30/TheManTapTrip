<?php

namespace App\Http\Resources;

use App\Services\PlaceTypeTranslator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlaceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // APIのPriceLevel文字列を金額帯に変換用
        $priceTextMap = [
            'PRICE_LEVEL_FREE'           => '無料',
            'PRICE_LEVEL_INEXPENSIVE'    => '¥1 ~ 1,000',
            'PRICE_LEVEL_MODERATE'       => '¥1,000 ~ 4,000',
            'PRICE_LEVEL_EXPENSIVE'      => '¥4,000 ~ 10,000',
            'PRICE_LEVEL_VERY_EXPENSIVE' => '¥10,000 ~'
        ];

        // サービスコンテナから翻訳クラスのインスタンスを取り出す
        $translator = app(PlaceTypeTranslator::class);

        // メインタイプを和訳
        $primaryType = $translator->translate($this->resource['primaryType'] ?? null);

        // サブタイプをすべて和訳
        $types = [];
        foreach ($this->resource['types'] as $type) {
            $types[] = $translator->translate($type ?? null);
        }

        // 成形して返す
        return [
            'spotId'          => $this->resource['spotId'] ?? null,
            'sName'           => $this->resource['sName'] ?? '名称未設定',
            'address'         => $this->resource['address'] ?? null,
            'lat'             => $this->resource['lat'] ?? null,
            'long'            => $this->resource['long'] ?? null,
            'rating'          => $this->resource['rating'] ?? null,
            'priceLevel'      => $priceTextMap[$this->resource['priceLevel'] ?? null] ?? null,
            'primaryType'     => $primaryType ?? null,
            'types'           => $types ?? null,
            'goodForChildren' => $this->resource['goodForChildren'] ?? false,
            'menuForChildren' => $this->resource['menuForChildren'] ?? false,
            'hasParking'      => $this->resource['hasParking'] ?? false,
            'summary'         => $this->resource['summary'] ?? '説明はありません。',
            'photoReference'  => $this->resource['photoReference'] ?? null,
            'directionUrl'    => $this->resource['directionUrl'] ?? null,
            'matchScore'      => $this->resource['matchScore'] ?? 0,
            'isVisited'       => $this->resource['isVisited'] ?? false,
        ];
    }
}
