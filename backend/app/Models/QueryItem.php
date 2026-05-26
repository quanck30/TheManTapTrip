<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QueryItem extends Model
{
    protected $fillable = [
        'question_id',
        'title',
        'search_type',
    ];

    /**
     * この検索項目が属する質問を取得します。
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * この検索項目に紐づく選択履歴を取得します。
     */
    public function choices(): HasMany
    {
        return $this->hasMany(Choice::class);
    }
}
