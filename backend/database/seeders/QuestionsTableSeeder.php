<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
                    'title'=>'子供と一緒に行きますか？'
                ],
                [
                    'title'=>'移動手段は何にしますか？'
                ],
                [
                    'title'=>'屋内と屋外はどちらがいいですか？'
                ],
                [
                    'title'=>'目的地で何をしたいですか？'
                ],
                [
                    'title'=>'予算はいくらですか？'
                ],


            ]);
        });
    }
}
