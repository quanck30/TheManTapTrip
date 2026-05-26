<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAuth extends Model
{
    protected $fillable = [
        'user_id',
        'provider',
        'provider_key',
        'pass_hash',
    ];

    /**
     * この認証情報に紐づくユーザーを取得します。
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
