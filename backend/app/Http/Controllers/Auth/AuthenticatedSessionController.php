<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthenticatedSessionController extends Controller
{
    /**
     * email・passwordでアカウント登録
     * @param Request $request
     * @return JsonResponse 登録結果
     */
    public function register(Request $request): JsonResponse
    {

    }

    /**
     * email・passwordを使用したログイン処理
     * @param Request $request
     * @return JsonResponse ログイン情報
     */
    public function store(Request $request): JsonResponse
    {
        // 入力値バリデーションチェック

    }
}
