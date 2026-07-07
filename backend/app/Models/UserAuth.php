<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAuth extends Model
{

    protected $fillable = [
        'userId',
        'provider',
        'providerKey',
        'passHash',
        'email'
    ];


    protected $hidden = [
        'passHash',
    ];


    /**
     * この認証情報に紐づくユーザーを取得します。
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
