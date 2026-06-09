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
                    'questionId'=> 1,
                    'title'=>'はい',
                    'searchType'=>''
                ],
                [
                    'questionId'=> 1,
                    'title'=>'いいえ',
                    'searchType'=>''
                ],
                [
                    'questionId'=> 2,
                    'title'=>'徒歩',
                    'searchType'=>''
                ],
                 [
                    'questionId'=> 2,
                    'title'=>'自転車',
                    'searchType'=>''
                ],
                 [
                    'questionId'=> 2,
                    'title'=>'車',
                    'searchType'=>''
                ],
                 [
                    'questionId'=> 2,
                    'title'=>'公共交通機関',
                    'searchType'=>''
                ],
                 [
                    'questionId'=> 3,
                    'title'=>'屋内',
                    'searchType'=>''
                ],
                 [
                    'questionId'=> 3,
                    'title'=>'屋外',
                    'searchType'=>''
                ],
                 [
                    'questionId'=> 3,
                    'title'=>'どちらでも',
                    'searchType'=>''
                ],
                 [
                    'questionId'=> 4,
                    'title'=>'食事',
                    'searchType'=>''
                ],
                  [
                    'questionId'=> 4,
                    'title'=>'博物館',
                    'searchType'=>''
                ],
                  [
                    'questionId'=> 4,
                    'title'=>'レジャー',
                    'searchType'=>''
                ],
                  [
                    'questionId'=> 4,
                    'title'=>'観光',
                    'searchType'=>''
                ],
                  [
                    'questionId'=> 5,
                    'title'=>'無料',
                    'searchType'=>''
                ],
                  [
                    'questionId'=> 5,
                    'title'=>'松（円）',
                    'searchType'=>''
                ],
                   [
                    'questionId'=> 5,
                    'title'=>'竹（円）',
                    'searchType'=>''
                ],
                   [
                    'questionId'=> 5,
                    'title'=>'梅（円）',
                    'searchType'=>''
                ],

            ]);
        });
    }
}
