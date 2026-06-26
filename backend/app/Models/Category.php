<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Category extends Model
{
    protected $fillable = [
        'userId',
        'title',
        'categoryType',
    ];

    /**
     * このカテゴリを所有するユーザーを取得します。
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
