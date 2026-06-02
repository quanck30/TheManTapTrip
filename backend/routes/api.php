<?php

use App\Http\Controllers\PlaceSearchController;
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

Route::post('/v1/placeSearch', [PlaceSearchController::class, 'placeSearch']);
