<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    protected $fillable = [
        'title',
    ];

    /**
     * この質問に紐づく選択履歴を取得します。
     */
    public function choices(): HasMany
    {
        return $this->hasMany(Choice::class, 'questionId');
    }

    /**
     * この質問で利用できる検索項目を取得します。
     */
    public function queryItems(): HasMany
    {
        return $this->hasMany(QueryItem::class, 'questionId')->orderBy('itemId');
    }
}
