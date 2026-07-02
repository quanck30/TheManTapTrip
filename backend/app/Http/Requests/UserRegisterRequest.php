<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UserRegisterRequest extends FormRequest
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
            'displayName' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255', 'unique:userauth,email'],
            'password' => ['required', 'string', 'min:8'],
        ];
    }

    public function messages(): array
    {
        return [
            'displayName.required' => 'ユーザー名を入力してください。',
            'displayName.string'   => 'ユーザー名は文字列で入力してください。',
            'displayName.max'      => 'ユーザー名は20文字以内にしてください。',

            'email.required'              => 'メールアドレスを入力してください。',
            'email.email'                 => 'メールアドレスの形式で入力してください。',
            'email.max'                   => 'ユーザー名は255文字以内にしてください。',
            'email.unique:userauth,email' => 'そのメールアドレスは既に使用されています。',

            'password.required' => 'パスワードを入力してください。',
            'password.string'   => 'パスワードは文字列で入力してください。',
            'password.min'      => 'パスワードは8文字以上にしてください。'
        ];
    }
}
