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
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Socialite\Contracts\User as ContractsUser;

#[Fillable(['display_name'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    public static function findOrCreateUserWithGoogle(ContractsUser $googleUser): self
    {
        return DB::transaction(function () use ($googleUser) {
            $userAuth = UserAuth::where('provider', 'google')
                ->where('provider_key', $googleUser->getId())
                ->first();
            if ($userAuth) return $userAuth->user;
            $user = self::create([
                'display_name' => $googleUser->getName() ?? $googleUser->getEmail() ?? $googleUser->getNickname() ?? 'Google User',
            ]);
            $user->userAuths()->create([
                'provider' => 'google',
                'provider_key' => $googleUser->getId(),
                'pass_hash' => null,
            ]);
            return $user;
        });
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
        return $this->hasMany(Category::class);
    }

    /**
     * このユーザーに紐づくログイン認証情報を取得します。
     */
    public function userAuths(): HasMany
    {
        return $this->hasMany(UserAuth::class);
    }

    /**
     * このユーザーが保存したスポットを取得します。
     */
    public function spots(): HasMany
    {
        return $this->hasMany(Spot::class);
    }

    /**
     * このユーザーが行った選択履歴を取得します。
     */
    public function choices(): HasMany
    {
        return $this->hasMany(Choice::class);
    }
}
