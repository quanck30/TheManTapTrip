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

#[Fillable(['display_name'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

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
