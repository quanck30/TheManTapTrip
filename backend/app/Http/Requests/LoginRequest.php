<?php

namespace App\Http\Requests;

use App\Http\Responses\ApiResponse;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Override;

class LoginRequest extends FormRequest
{
    /**
     * このログインリクエストは誰でも送信できます。
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * ログインに必要なアクセストークンを検証します。
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // フロントエンドから受け取ったOAuthアクセストークンを必須にします。
            'accessToken' => ['required', 'string'],
        ];
    }

    /**
     * バリデーションエラーも通常のAPIレスポンス形式で返します。
     */
    #[Override]
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            ApiResponse::error('バリデーション失敗', 422, $validator->errors())
        );
    }
}
