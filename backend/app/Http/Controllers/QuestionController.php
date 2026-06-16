<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Responses\ApiResponse;
use App\Models\QueryItem;
use App\Models\Question;

use Illuminate\Support\Facades\Auth;
use App\Models\Choice;

class QuestionController extends Controller
{
    //
    public function loginedIndex()
    {
        //質問内容と選択肢を取得する
        $questions = Question::with('queryItems')->get();

        // // 全て null にする　
        foreach ($questions as $question) {
            $question->choice = null;
        }

            // このユーザーの回答を取得
            $choices = Choice::where('userId', Auth::id())->get();

            foreach ($questions as $question) {

                // この質問に対する回答を探す
                $choice = $choices->where('questionId', $question->id)->first();

                // 回答済みなら queryItemId、未回答なら null　にする
                $question->choice = $choice ? $choice->queryItemId : null;
            }


        return ApiResponse::success([
            'userId' => Auth::id(),
            'questions' => $questions,
        ]);
    }
    public function index(){

            //質問内容と選択肢を取得する
        $questions = Question::with('queryItems')->get();

        // // 全て null にする　
        foreach ($questions as $question) {
            $question->choice = null;
        }

         return ApiResponse::success([
            'questions' => $questions,
        ]);

    }
}
