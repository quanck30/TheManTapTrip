<?php

/**
 * DINH BINH QUAN
 * 2026/06/12
 * 回答選択保存のリクエストクラス
 */

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ChoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // 認証されたユーザーのみがこのリクエストを行えるようにします。
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'questionId' => ['required', 'integer', 'exists:questions,id'],
            'queryItemId' => [
                'required',
                'integer',
                Rule::exists('query_items', 'id')
                    ->where('questionId', $this->integer('queId')),
            ],
        ];
    }

    /**
     * エラーメッセージの日本語表示
     * @return array{questionId.exists: string, questionId.integer: string, questionId.required: string, queryItemId.exists: string, queryItemId.integer: string, queryItemId.required: string}
     */
    public function messages(): array
    {
        return [
            'questionId.required' => '質問IDは必須です。',
            'questionId.integer' => '質問IDは整数でなければなりません。',
            'questionId.exists' => '指定された質問IDは存在しません。',

            'queryItemId.required' => '選択肢IDは必須です。',
            'queryItemId.integer' => '選択肢IDは整数でなければなりません。',
            'queryItemId.exists' => '指定された選択肢IDは存在しないか、質問に関連付けられていません。',
        ];
    }
}
