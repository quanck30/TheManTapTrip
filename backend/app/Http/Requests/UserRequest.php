<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
            'displayName' => ['required', 'string', 'max:20']
        ];
    }

    public function messages(): array
    {
        return [
            'displayName.required' => 'ユーザー名を入力してください。',
            'displayName.string'   => 'ユーザー名は文字列で入力してください。',
            'displayName.max'      => 'ユーザー名は20文字以内にしてください。'
        ];
    }
}
