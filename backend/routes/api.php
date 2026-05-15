<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
});
// })->middleware('auth:sanctum');
Route::get('/getUser', function () {
    $user = User::all();
    return response()->json([
        'message' => "ok",
        'data' => $user
    ]);
});
