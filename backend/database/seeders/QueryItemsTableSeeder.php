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
                    'searchType' => ''
                ],
                [
                    'questionId' => 1,
                    'itemId' => 2,
                    'title' => 'いいえ',
                    'searchType' => ''
                ],
                [
                    'questionId' => 2,
                    'itemId' => 1,
                    'title' => '徒歩',
                    'searchType' => ''
                ],
                [
                    'questionId' => 2,
                    'itemId' => 2,
                    'title' => '自転車',
                    'searchType' => ''
                ],
                [
                    'questionId' => 2,
                    'itemId' => 3,
                    'title' => '車',
                    'searchType' => ''
                ],
                [
                    'questionId' => 2,
                    'itemId' => 4,
                    'title' => '公共交通機関',
                    'searchType' => ''
                ],
                [
                    'questionId' => 3,
                    'itemId' => 1,
                    'title' => '屋内',
                    'searchType' => ''
                ],
                [
                    'questionId' => 3,
                    'itemId' => 2,
                    'title' => '屋外',
                    'searchType' => ''
                ],
                [
                    'questionId' => 3,
                    'itemId' => 3,
                    'title' => 'どちらでも',
                    'searchType' => ''
                ],
                [
                    'questionId' => 4,
                    'itemId' => 1,
                    'title' => '食事',
                    'searchType' => ''
                ],
                [
                    'questionId' => 4,
                    'itemId' => 2,
                    'title' => '遊び',
                    'searchType' => ''
                ],
                [
                    'questionId' => 4,
                    'itemId' => 3,
                    'title' => '観光',
                    'searchType' => ''
                ],
                [
                    'questionId' => 4,
                    'itemId' => 4,
                    'title' => '買い物',
                    'searchType' => ''
                ],
                [
                    'questionId' => 4,
                    'itemId' => 5,
                    'title' => 'リラックス',
                    'searchType' => ''
                ],
                [
                    'questionId' => 5,
                    'itemId' => 1,
                    'title' => '無料',
                    'searchType' => ''
                ],
                [
                    'questionId' => 5,
                    'itemId' => 2,
                    'title' => '~ 1000（円）',
                    'searchType' => ''
                ],
                [
                    'questionId' => 5,
                    'itemId' => 3,
                    'title' => '1000 ~ 4000（円）',
                    'searchType' => ''
                ],
                [
                    'questionId' => 5,
                    'itemId' => 4,
                    'title' => '4000~（円）',
                    'searchType' => ''
                ],

            ]);
        });
    }
}
