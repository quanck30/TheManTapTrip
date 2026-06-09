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

    //バリデーションルール
    public function rules(): array
    {
        return [
            //
            'spotId' => ['required'], //スポットID必須
            'address' => ['required'], //住所必須
        ];
    }
    //バリデーションエラーメッセージ
    public function messages()
    {

        return [
            //post_idが未入力の場合
            'spotId.required' => 'スポットがありません',

            //addressが未入力の場合
            'address.required' => '住所がありません'
        ];
    }

}
