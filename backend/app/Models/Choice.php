<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Choice extends Model
{
    protected $fillable = [
        'userId',
        'questionId',
        'queryItemId',
    ];

    /**
     * この選択を行ったユーザーを取得します。
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userId');
    }

    /**
     * この選択に紐づく質問を取得します。
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'questionId');
    }

    /**
     * この選択に紐づく検索項目を取得します。
     */
    public function queryItem(): BelongsTo
    {
        return $this->belongsTo(QueryItem::class, 'queryItemId');
    }
}
