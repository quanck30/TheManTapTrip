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
                    'question_id'=> 1,
                    'title'=>'はい',
                    'search_type'=>''
                ],
                [
                    'question_id'=> 1,
                    'title'=>'いいえ',
                    'search_type'=>''
                ],
                [
                    'question_id'=> 2,
                    'title'=>'徒歩',
                    'search_type'=>''
                ],
                 [
                    'question_id'=> 2,
                    'title'=>'自転車',
                    'search_type'=>''
                ],
                 [
                    'question_id'=> 2,
                    'title'=>'車',
                    'search_type'=>''
                ],
                 [
                    'question_id'=> 2,
                    'title'=>'公共交通機関',
                    'search_type'=>''
                ],
                 [
                    'question_id'=> 3,
                    'title'=>'屋内',
                    'search_type'=>''
                ],
                 [
                    'question_id'=> 3,
                    'title'=>'屋外',
                    'search_type'=>''
                ],
                 [
                    'question_id'=> 3,
                    'title'=>'どちらでも',
                    'search_type'=>''
                ],
                 [
                    'question_id'=> 4,
                    'title'=>'食事',
                    'search_type'=>''
                ],
                  [
                    'question_id'=> 4,
                    'title'=>'博物館',
                    'search_type'=>''
                ],
                  [
                    'question_id'=> 4,
                    'title'=>'レジャー',
                    'search_type'=>''
                ],
                  [
                    'question_id'=> 4,
                    'title'=>'観光',
                    'search_type'=>''
                ],
                  [
                    'question_id'=> 5,
                    'title'=>'無料',
                    'search_type'=>''
                ],
                  [
                    'question_id'=> 5,
                    'title'=>'松（円）',
                    'search_type'=>''
                ],
                   [
                    'question_id'=> 5,
                    'title'=>'竹（円）',
                    'search_type'=>''
                ],
                   [
                    'question_id'=> 5,
                    'title'=>'梅（円）',
                    'search_type'=>''
                ],

            ]);
        });
    }
}
