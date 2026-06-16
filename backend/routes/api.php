<?php

use App\Http\Controllers\ChoiceController;
use App\Http\Controllers\PlaceSearchController;
use App\Models\Question;
use App\Http\Controllers\GoogleAuthController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SpotController;


// Sanctumで認証済みのユーザー情報を返します。
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// 開発確認用に登録済みユーザーの一覧を返します。
Route::get('/v1/getUser', function () {
    $user = User::all();
    return response()->json([
        'message' => "ok",
        'data' => $user
    ]);
});
//questionをpostmanでテスト
Route::get('/test', function () {
    $question = Question::all();
    return response()->json([
        'data' => $question
    ]);
});

Route::middleware('auth:sanctum')->group(function () {
    // 質問一覧と選択肢をJSONで返します。
    Route::get('/v1/questions/login', [QuestionController::class, 'loginedIndex']);
});
    Route::get('/v1/questions/guest', [QuestionController::class, 'index']);


//お気に入り場所を保存
// Route::post('/v1/spots', [SpotController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('/v1/spots', SpotController::class);
});

// 回答保存API
Route::apiResource('/v1/choices', ChoiceController::class)->middleware('auth:sanctum');

// Google Places Api を使用した場所検索APi
Route::post('/v1/placeSearch', [PlaceSearchController::class, 'placeSearch']);
// Googleアクセストークンを使ったログインAPIです。
Route::post('/v1/auth/google', [GoogleAuthController::class, 'googleLogin']);
