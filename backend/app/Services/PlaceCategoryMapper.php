<?php

namespace App\Services;

class PlaceCategoryMapper
{
    /**
     * 各質問の選択肢に対応する Google Places API の types（カテゴリ）の定義マスタ
     */
    private array $mapping = [
        // 質問1:子供と一緒に行きますか？
        'withChildren' => [
            'amusement_park', 'aquarium', 'park', 'zoo', 'childrens_museum',
            'planetarium', 'video_arcade', 'bowling_alley', 'indoor_playground',
            'museum', 'toy_store', 'candy_store', 'ice_cream_shop'
        ],

        // 質問2:移動手段は？(徒歩・自転車・車)
        'travelMode' => [
            'walk'    => [],
            'bicycle' => [],
            'drive'   => [],
        ],

        // 質問3:屋内と屋外はどちらがいいですか？
        'locationType' => [
            'indoor'  => [
                'museum', 'art_gallery', 'movie_theater', 'bowling_alley', 'planetarium',
                'video_arcade', 'shopping_mall', 'department_store', 'library', 'spa',
                'fitness_center', 'indoor_playground', 'arena', 'casino'
            ],
            'outdoor' => [
                'park', 'zoo', 'amusement_park', 'campground', 'tourist_attraction',
                'childrens_camp', 'garden', 'beach', 'hiking_area', 'national_park',
                'marina', 'farm', 'athletic_field'
            ],
            'any' => [
                'museum', 'art_gallery', 'movie_theater', 'bowling_alley', 'planetarium',
                'video_arcade', 'shopping_mall', 'department_store', 'library', 'spa',
                'fitness_center', 'indoor_playground', 'arena', 'casino',
                'park', 'zoo', 'amusement_park', 'campground', 'tourist_attraction',
                'childrens_camp', 'garden', 'beach', 'hiking_area', 'national_park',
                'marina', 'farm', 'athletic_field'
            ]
        ],

        // 質問4:目的地で何をしたいですか？(食事・遊び・観光・買い物・リラックス)
        'purpose' => [
            // 食事：カフェ、パン屋、各種レストランから居酒屋（bar）まで網羅
            'eat' => [
                'apiSearchTypes' => ['restaurant'],
                'matchTypes'    => [
                    'restaurant', 'cafe', 'bakery', 'bar', 'coffee_shop',
                    'fast_food_restaurant', 'ice_cream_shop', 'sandwich_shop',
                    'juice_shop', 'pub', 'wine_bar',
                    'japanese_restaurant', 'sushi_restaurant', 'ramen_restaurant',
                    'izakaya_restaurant', 'chinese_restaurant', 'italian_restaurant',
                    'french_restaurant', 'spanish_restaurant', 'indian_restaurant',
                    'korean_restaurant', 'thai_restaurant', 'mexican_restaurant',
                    'american_restaurant', 'seafood_restaurant', 'steak_house',
                    'pizza_restaurant', 'hamburger_restaurant', 'barbecue_restaurant',
                    'buffet_restaurant', 'cafeteria', 'family_restaurant'
                ]
            ],
            // 遊び：遊園地や水族館に加え、ボウリングやゲームセンター、劇場、イベント会場など
            'play' => [
                'apiSearchTypeIndoor'  => ['amusement_center', 'bowling_alley'], // 屋内なら「アミューズメントセンター（ボウリング、トランポリン等）」
                'apiSearchTypeOutdoor' => ['amusement_park', 'park', 'zoo', 'aquarium'],   // 屋外なら「アミューズメントパーク（遊園地、アスレチック等）」

                'matchTypes'     => [
                    'amusement_park', 'zoo', 'aquarium', 'bowling_alley', 'movie_theater',
                    'video_arcade', 'planetarium', 'indoor_playground', 'childrens_camp',
                    'casino', 'comedy_club', 'night_club', 'theater', 'performing_arts_theater', 'establishment',
                    'amusement_center', 'arena', 'skate_park', 'swimming_pool', 'water_park', 'point_of_interest'
                ]
            ],
            // 観光：観光名所、歴史的建造物、美術館、博物館、寺社仏閣、展望台など
            'sightsee' => [
                'apiSearchTypes' => ['tourist_attraction', 'museum', 'art_gallery', 'historical_landmark', 'castle', 'observation_deck'],
                'matchTypes'    => [
                    'tourist_attraction', 'museum', 'art_gallery', 'historical_landmark',
                    'visitor_center', 'cultural_center', 'viewpoint', 'church', 'hindu_temple',
                    'mosque', 'synagogue', 'scenic_lookout', 'national_park', 'heritage_site',
                    'monument', 'sculpture', 'castle'
                ]
            ],
            // 買い物：大型モール、デパートから、スーパー、アパレル、書店、おもちゃ屋など
            'shop' => [
                'apiSearchTypes' => ['shopping_mall', 'department_store', 'clothing_store', 'gift_shop', 'book_store', 'toy_store'],
                'matchTypes'    => [
                    'shopping_mall', 'department_store', 'supermarket', 'grocery_store',
                    'convenience_store', 'clothing_store', 'shoe_store', 'book_store',
                    'electronics_store', 'home_goods_store', 'gift_shop', 'toy_store',
                    'candy_store', 'jewelry_store', 'sporting_goods_store', 'cosmetics_store',
                    'department_store', 'furniture_store', 'hardware_store', 'florist'
                ]
            ],
            // リラックス：公園、庭園、温泉・スパ、自然豊かな場所（ビーチやハイキングなど）
            'relax' => [
                'apiSearchTypes' => ['park', 'botanical_garden', 'spa', 'hot_spring', 'public_bath', 'beach'],
                'matchTypes'    => [
                    'park', 'campground', 'spa', 'garden', 'beach', 'hiking_area',
                    'national_park', 'lodging', 'public_bath', 'hot_spring', 'solarium',
                    'sauna', 'massage', 'bed_and_breakfast', 'resort'
                ]
            ]
        ]
    ];

    /**
     * 質問名と選択肢を渡すと、配列の深さを自動判定して正しいGoogleカテゴリを返す（カプセル化）
     * @param string $questionKey 質問名（例: 'with_children' や 'purpose'）
     * @param string|null $choice 選択肢（例: 'eat' などの文字列、または未選択の null）
     * @return array Googleのカテゴリ配列
     */
    public function getGoogleTypes(string $questionKey, ?string $choice, ?string $typeKey = null): array|string
    {
        // 指定された質問（1階層目）がマスタになければ空配列を返す
        if (!isset($this->mapping[$questionKey])) {
            return [];
        }

        $firstLayer = $this->mapping[$questionKey];

        // 中身が連想配列（キー名付き）ではなく、ただの文字列リストならそのまま返す
        if (array_is_list($firstLayer)) {
            return $firstLayer;
        }

        // 3階層以上のデータで選択肢が空なら終了
        if (empty($choice) || !isset($firstLayer[$choice])) {
            return [];
        }

        $targetData = $firstLayer[$choice];

        // 行き着いたデータの中に 'matchTypes' というキーがあれば、その中身（配列）を返す
        if (is_array($targetData) && isset($targetData[$typeKey])) {
            return $targetData[$typeKey];
        }

        if (is_array($targetData)) {
            return $targetData;
        }

        // 普通の3階層データであれば、そのまま配列を返す
        return is_array($targetData) ? $targetData : [];
    }
}

?>
