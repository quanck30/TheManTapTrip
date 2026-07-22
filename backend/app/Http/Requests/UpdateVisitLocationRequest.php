<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateVisitLocationRequest extends FormRequest
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
            'id' => ['required', 'integer','exists:spots,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'id.required' => 'スポットIDを入力してください。',
            'id.integer'   => 'スポットIDは数字で入力してください。',
            'id.exists'   => '指定されたスポットが存在しません。',
        ];
    }
}
