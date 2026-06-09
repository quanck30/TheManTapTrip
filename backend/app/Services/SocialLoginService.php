<?php

/**
 * @author DINH BINH QUAN
 * 2026/06/05
 */

namespace App\Services;

use App\Contracts\SocialProviderInterface;
use App\Models\User;
use App\Models\UserAuth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class SocialLoginService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
    public function login(SocialProviderInterface $provider, string $accessToken): User
    {
        $socialUser = $provider->getUser($accessToken);
        // Google IDを使って、Redis上でユーザーごとに異なるキーを作成します。
        $cacheKey = $provider->name() . '_user:' . $socialUser->providerId;

        // DBへ問い合わせる前に、まずRedisからユーザー情報を取得します。
        $cachedUser = Cache::get($cacheKey);

        if ($cachedUser) {
            // キャッシュの配列データからEloquentモデルを復元し、Controller側でcreateToken()を使えるようにします。
            return (new User())->newFromBuilder([
                'id' => $cachedUser['id'],
                'display_name' => $cachedUser['display_name'],
            ]);
        }

        // return User::findOrCreateUserWithGoogle($socialUser);
        return User::find();
    }
}
