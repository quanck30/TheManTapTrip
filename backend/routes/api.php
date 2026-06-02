<?php

use App\Models\QueryItem;
use App\Models\Question;
use App\Http\Controllers\GoogleAuthController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
Route::get('/test', function(){
    $question = Question::all();
    return response()->json([
        'data'=>$question
    ]);
});



// Googleアクセストークンを使ったログインAPIです。
Route::post('/v1/auth/google', [GoogleAuthController::class, 'googleLogin']);
