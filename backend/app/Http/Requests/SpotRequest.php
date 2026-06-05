<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SpotRequest extends FormRequest
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
            //
            'spot_id' => ['required'],//入力必須
            'address' => ['required'],//入力必須
        ];
    }
    //エラーメッセージ
    public function messages()
    {

    return[
        'spot_id.required' => 'スポットがありません',
        'address.required' => '住所がありません'
    ];
    }
}
