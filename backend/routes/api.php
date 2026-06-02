<?php

use App\Models\QueryItem;
use App\Models\Question;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
});
// })->middleware('auth:sanctum');
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


