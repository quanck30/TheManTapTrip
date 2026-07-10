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
            'spotId' => ['required', 'numeric','exists:spots,spotId'],
        ];
    }

    public function messages(): array
    {
        return [
            'spotId.required' => 'スポットIDを入力してください。',
            'spotId.numeric'  => 'スポットIDは数値で入力してください。',
            'spotId.exists'   => '指定されたスポットが存在しません。',
        ];
    }
}
