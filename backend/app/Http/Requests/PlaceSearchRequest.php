<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PlaceSearchRequest extends FormRequest
{
    /**
     * このリクエストを実行する権限があるかどうか（一時的に一律true）
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーションルールを定義
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // (一時的に自分で命名)フロントのkey名に合わせる
        return [
            'latitude' => ['required', 'numeric'],      // 緯度（値・数値確認）
            'longitude' => ['required', 'numeric'],     // 軽度（値・数値確認）
            'radius' => ['required', 'numeric'],        // 半径（値・数値確認）
            'answers' => ['required', 'array'],         // 解答（値・配列確認）
            'answers.*' => 'required|string',           // 配列の各要素
        ];
    }

    /**
     * エラーメッセージの日本語表示
     * @return array{answers.array: string, answers.required: string, latitude.numeric: string, latitude.required: string, longitude.numeric: string, longitude.required: string, radius.numeric: string, radius.required: string}
     */
    public function messages(): array
    {
        return [
            'latitude.required' => '現在地の緯度情報が必要です。',
            'latitude.numeric'  => '緯度は数値で入力してください。',

            'longitude.required' => '現在地の経度情報が必要です。',
            'longitude.numeric'  => '経度は数値で入力してください。',

            'radius.required' => '検索半径が必要です。',
            'radius.numeric'  => '検索半径は数値で入力してください。',

            'answers.required' => '質問の回答を選択してください。',
            'answers.array'    => '質問の回答は配列形式で送信してください。',
            'answers.*.string' => '解答は文字列で入力してください',
        ];
    }
}
