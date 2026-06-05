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

            'answers' => ['required', 'array'],                      // 解答（値・配列確認）
            'answers.with_children' => ['required', 'boolean'],      // 子供と一緒に行くか
            'answers.travel_mode' => ['required', 'string'],         // 移動手段
            'answers.location_type' => ['required', 'string'],       // 屋内か屋外か
            'answers.purpose' => ['required', 'string'],             // 目的地で何がしたいか
            'answers.price_level' => ['required', 'string'],         // 価格帯
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

            'answers.with_children.required' => '子供と一緒に行くのかという情報が必要です。',
            'answers.with_children.boolean'  => '子供と一緒に行くのかは論理値で送信してください。',

            'answers.travel_mode.required' => '移動手段の情報が必要です。',
            'answers.travel_mode.string'   => '移動手段の情報は文字列で送信してください。',

            'answers.location_type.required' => '屋内か屋外かの情報が必要です。',
            'answers.location_type.string'   => '屋内か屋外かの情報は文字列で送信してください。',

            'answers.purpose.required' => '目的地でしたいことの情報が必要です。',
            'answers.purpose.string'   => '目的地でしたいことの情報は文字列で送信してください。',

            'answers.price_level.required' => '価格帯の情報が必要です。',
            'answers.price_level.string'   => '価格帯の情報は文字列で送信してください。',
        ];
    }
}
