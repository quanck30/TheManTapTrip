<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

Route::get('/', function () {
    return view('welcome');
});

// アカウント作成API（未ログインのみ）
Route::post('auth/register', [AuthenticatedSessionController::class, 'register']);

// ログインAPI（未ログインのみ）
Route::post('v1/auth/email', [AuthenticatedSessionController::class, 'emailLogin'])->middleware('guest');

// ログアウトAPI（ログイン済みのみ）
Route::post('v1/auth/logout', [AuthenticatedSessionController::class, 'emailLogout'])->middleware('auth');
