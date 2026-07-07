<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class EmailLoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'              => 'メールアドレスを入力してください。',
            'email.email'                 => 'メールアドレスの形式で入力してください。',

            'password.required' => 'パスワードを入力してください。',
            'password.string'   => 'パスワードは文字列で入力してください。',

            'remember.boolean' => 'ログイン状態保持の指定が正しくありません。',
        ];
    }
}
