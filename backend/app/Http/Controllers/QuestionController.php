<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Responses\ApiResponse;
use App\Models\QueryItem;
use App\Models\Question;

class QuestionController extends Controller
{
    //
     public function index()
    {
        //質問内容と選択肢を取得する
        $questions = Question::with('queryItems')->get();

        // 質問一覧と各質問に紐づく選択肢を取得して返します
        return ApiResponse::success([
            'questions' => $questions,
        ],);
    }

}
