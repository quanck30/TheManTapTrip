<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Socialite\Contracts\User as ContractsUser;

#[Fillable(['displayName'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Google認証ユーザーに対応するローカルユーザーを取得または作成します。
     */
    public static function findOrCreateUserWithGoogle(ContractsUser $googleUser): self
    {
        // Google IDを使って、Redis上でユーザーごとに異なるキーを作成します。
        $cacheKey = 'googleUser:' . $googleUser->getId();

        // DBへ問い合わせる前に、まずRedisからユーザー情報を取得します。
        $cachedUser = Cache::get($cacheKey);
        if ($cachedUser) {
            // キャッシュの配列データからEloquentモデルを復元し、Controller側でcreateToken()を使えるようにします。
            return (new self())->newFromBuilder([
                'id' => $cachedUser['id'],
                'displayName' => $cachedUser['displayName'],
            ]);
        }

        // Redisに存在しない場合だけ、DBから取得または新規作成します。
        $user =  DB::transaction(function () use ($googleUser) {
            $userAuth = UserAuth::where('provider', 'google')
                ->where('providerKey', $googleUser->getId())
                ->first();

            // 既にGoogle認証情報がある場合は、紐づくユーザーを返します。
            if ($userAuth) return $userAuth->user;

            // 初回ログイン時はユーザー本体とGoogle認証情報を同時に作成します。
            $user = self::create([
                'displayName' => $googleUser->getName() ?? $googleUser->getEmail() ?? $googleUser->getNickname() ?? 'Google User',
            ]);
            $user->userAuths()->create([
                'provider' => 'google',
                'providerKey' => $googleUser->getId(),
                'passHash' => null,
            ]);
            return $user;
        });

        // 必要なユーザー情報だけをRedisに1時間保存します。
        Cache::put($cacheKey, [
            'id' => $user->id,
            'displayName' => $user->displayName,
        ], now()->addHour());
        return $user;
    }
    /**
     * キャストする属性を取得します。
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * このユーザーに紐づくカテゴリを取得します。
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class, 'userId');
    }

    /**
     * このユーザーに紐づくログイン認証情報を取得します。
     */
    public function userAuths(): HasMany
    {
        return $this->hasMany(UserAuth::class, 'userId');
    }

    /**
     * このユーザーが保存したスポットを取得します。
     */
    public function spots(): HasMany
    {
        return $this->hasMany(Spot::class, 'userId');
    }

    /**
     * このユーザーが行った選択履歴を取得します。
     */
    public function choices(): HasMany
    {
        return $this->hasMany(Choice::class, 'userId');
    }
}
