<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ChoiceController;
use App\Http\Controllers\PlaceSearchController;
use App\Http\Controllers\VisitLocationController;
use App\Models\Question;
use App\Http\Controllers\GoogleAuthController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SpotController;
use App\Http\Controllers\UserController;


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





Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('/v1/spots', SpotController::class);

    // アカウント情報の取得API(ログイン必須)
    Route::get('/v1/user/', [UserController::class, 'show']);
    Route::put('/v1/user/', [UserController::class, 'update']);

    // ログアウトAPI
    Route::post('/auth/logout', [AuthenticatedSessionController::class, 'emailLogout']);
    // ログイン情報取得API
    Route::get('/me', [AuthenticatedSessionController::class, 'me']);

    // 行き済み登録API
    Route::put('/v1/visit', [VisitLocationController::class, 'update']);
});

// 回答保存API
Route::apiResource('/v1/choices', ChoiceController::class)->middleware('auth:sanctum');

// Google Places Api を使用した場所検索APi
Route::post('/v1/placeSearch', [PlaceSearchController::class, 'placeSearch']);

// Googleアクセストークンを使ったログインAPIです。
Route::post('/v1/auth/google', [GoogleAuthController::class, 'googleLogin']);

// アカウント作成API（未ログインのみ）
Route::post('auth/register', [AuthenticatedSessionController::class, 'register']);

// ログインAPI（未ログインのみ）
Route::post('auth/email', [AuthenticatedSessionController::class, 'emailLogin']);

