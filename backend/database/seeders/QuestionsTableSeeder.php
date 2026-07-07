<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::transaction(function () {
            Question::insert([
                [
                    'title'=>'子供と一緒に行きますか？',
                    'questionType'=>'withChildren'
                ],
                [
                    'title'=>'移動手段は何にしますか？',
                    'questionType'=>'travelMode'
                ],
                [
                    'title'=>'屋内と屋外はどちらがいいですか？',
                    'questionType'=>'locationType'
                ],
                [
                    'title'=>'目的地で何をしたいですか？',
                    'questionType'=>'purpose'
                ],
                [
                    'title'=>'予算はいくらですか？',
                    'questionType'=>'priceLevel'
                ],


            ]);
        });
    }
}
