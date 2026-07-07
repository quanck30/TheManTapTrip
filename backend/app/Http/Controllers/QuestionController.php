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

        // 全て null にする　
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
        $questionResult = [];
        foreach ($questions as $question) {
            $questionResult[] = [
                'id' => $question->id,
                'title' => $question->title,
                'questionType' => $question->questionType,
                'queryItems' => $question->queryItems->map(function ($queryItem) {
                    return [
                        'itemId' => $queryItem->itemId,
                        'title' => $queryItem->title,
                        'searchValue' => $queryItem->searchValue,
                        'radius' => $queryItem->radius,
                    ];
                }),
                'choice' => $question->choice, // 回答済みなら queryItemId、未回答なら null
            ];
        }

        return ApiResponse::success([
            'userId' => Auth::id(),
            'questions' => $questionResult,
        ]);
    }
    public function index()
    {

        //質問内容と選択肢を取得する
        $questions = Question::with('queryItems')->get();

        // boolean型に編集
        foreach ($questions as $question) {
            if($question->questionType === 'withChildren') {
                foreach ($question->queryItems as $queryItem) {
                    if ($queryItem->searchValue === 'true') {
                        $queryItem->searchValue = true;
                    } elseif ($queryItem->searchValue === 'false') {
                        $queryItem->searchValue = false;
                    }
                }
            }
        }
        $questionResult = [];
        foreach ($questions as $question) {
            $questionResult[] = [
                'id' => $question->id,
                'title' => $question->title,
                'questionType' => $question->questionType,
                'queryItems' => $question->queryItems->map(function ($queryItem) {
                    return [
                        'itemId' => $queryItem->itemId,
                        'title' => $queryItem->title,
                        'searchValue' => $queryItem->searchValue,
                        'radius' => $queryItem->radius,
                    ];
                }),
                'choice' => null, // ゲストユーザーは全て null
            ];
        }
        return ApiResponse::success([
            'questions' => $questionResult,
        ]);
    }
}
