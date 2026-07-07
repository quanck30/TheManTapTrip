<?php

namespace Database\Seeders;

use App\Models\QueryItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QueryItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::transaction(function () {
            QueryItem::insert([
                [
                    'questionId' => 1,
                    'itemId' => 1,
                    'title' => 'はい',
                    'searchValue' => 'true',
                    'radius' => null
                ],
                [
                    'questionId' => 1,
                    'itemId' => 2,
                    'title' => 'いいえ',
                    'searchValue' => 'false',
                    'radius' => null
                ],
                [
                    'questionId' => 2,
                    'itemId' => 1,
                    'title' => '徒歩',
                    'searchValue' => 'walk',
                    'radius' => 1000
                ],
                [
                    'questionId' => 2,
                    'itemId' => 2,
                    'title' => '自転車',
                    'searchValue' => 'bicycle',
                    'radius' => 2000
                ],
                [
                    'questionId' => 2,
                    'itemId' => 3,
                    'title' => '車',
                    'searchValue' => 'drive',
                    'radius' => 5000
                ],
                // [
                //     'questionId' => 2,
                //     'itemId' => 4,
                //     'title' => '公共交通機関',
                //     'searchValue' => 'public_transport',
                //     'radius' => 3000
                // ],
                [
                    'questionId' => 3,
                    'itemId' => 1,
                    'title' => '屋内',
                    'searchValue' => 'indoor',
                    'radius' => null
                ],
                [
                    'questionId' => 3,
                    'itemId' => 2,
                    'title' => '屋外',
                    'searchValue' => 'outdoor',
                    'radius' => null
                ],
                [
                    'questionId' => 3,
                    'itemId' => 3,
                    'title' => 'どちらでも',
                    'searchValue' => 'any',
                    'radius' => null
                ],
                [
                    'questionId' => 4,
                    'itemId' => 1,
                    'title' => '食事',
                    'searchValue' => 'eat',
                    'radius' => null
                ],
                [
                    'questionId' => 4,
                    'itemId' => 2,
                    'title' => '遊び',
                    'searchValue' => 'play',
                    'radius' => null
                ],
                [
                    'questionId' => 4,
                    'itemId' => 3,
                    'title' => '観光',
                    'searchValue' => 'sightsee',
                    'radius' => null
                ],
                [
                    'questionId' => 4,
                    'itemId' => 4,
                    'title' => '買い物',
                    'searchValue' => 'shop',
                    'radius' => null
                ],
                [
                    'questionId' => 4,
                    'itemId' => 5,
                    'title' => 'リラックス',
                    'searchValue' => 'relax',
                    'radius' => null
                ],
                [
                    'questionId' => 5,
                    'itemId' => 1,
                    'title' => '無料',
                    'searchValue' => 'PRICE_LEVEL_FREE',
                    'radius' => null
                ],
                [
                    'questionId' => 5,
                    'itemId' => 2,
                    'title' => '¥1 ~ 1,000',
                    'searchValue' => 'PRICE_LEVEL_INEXPENSIVE',
                    'radius' => null
                ],
                [
                    'questionId' => 5,
                    'itemId' => 3,
                    'title' => '¥1,000 ~ 4,000',
                    'searchValue' => 'PRICE_LEVEL_MODERATE',
                    'radius' => null
                ],
                [
                    'questionId' => 5,
                    'itemId' => 4,
                    'title' => '¥4,000 ~ 10,000',
                    'searchValue' => 'PRICE_LEVEL_EXPENSIVE',
                    'radius' => null
                ],
                [
                    'questionId' => 5,
                    'itemId' => 5,
                    'title' => '¥10,000 ~',
                    'searchValue' => 'PRICE_LEVEL_VERY_EXPENSIVE',
                    'radius' => null
                ],

            ]);
        });
    }
}
