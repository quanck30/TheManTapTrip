<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Spot extends Model
{
    protected $fillable = [
        'userId',
        'spotId',
        'address',
        'isVisited',
    ];

    /**
     * このスポットを保存したユーザーを取得します。
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
