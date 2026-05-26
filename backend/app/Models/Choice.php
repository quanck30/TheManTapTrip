<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Choice extends Model
{
    protected $fillable = [
        'user_id',
        'question_id',
        'query_item_id',
    ];

    /**
     * この選択を行ったユーザーを取得します。
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * この選択に紐づく質問を取得します。
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * この選択に紐づく検索項目を取得します。
     */
    public function queryItem(): BelongsTo
    {
        return $this->belongsTo(QueryItem::class);
    }
}
