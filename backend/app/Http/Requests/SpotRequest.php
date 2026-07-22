<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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

            // PlacesAPIのスポットID
            'spotId' => ['required', 'string', Rule::unique('spots', 'spotId')->where(
                fn($query) =>
                $query->where('userId', $this->user()->id),
            )],

            // 住所
            'address' => ['required', 'string', 'max:255'],

            // スポット名
            'sName' => ['nullable', 'string'],

            // 緯度
            'lat' => ['nullable', 'numeric'],

            // 経度
            'long' => ['nullable', 'numeric'],

            // 評価点
            'rating' => ['nullable', 'numeric'],

            // 価格帯
            'price' => ['nullable', 'max:255'],

            // 駐車場有無
            'hasParking' => ['nullable', 'boolean'],

            // スポット説明
            'summary' => ['nullable', 'string', 'max:255'],

            // PlacesAPIの写真参照ID
            'photoReference' => ['nullable', 'string', 'max:2048'],

            // GoogleMapルート案内URL
            'directionUrl' => ['nullable', 'string', 'max:255'],

            //Primary Type
            'primaryType' => ['nullable', 'string', 'max:255']

        ];
    }
    //バリデーションエラーメッセージ
    public function messages()
    {

        return [

            // PlacesAPIのスポットID
            'spotId.required' => 'スポットIDがありません',
            'spotId.integer'  => 'スポットIDは整数で入力してください',
            'spotId.unique' => 'このスポットはすでに保存されています。',

            // 住所
            'address.required' => '住所がありません',
            'address.string'   => '住所は文字列で入力してください',
            'address.max'      => '住所は255文字以内で入力してください',

            // 訪問済みフラグ
            'isVisited.required' => '訪問状態がありません',
            'isVisited.boolean'  => '訪問状態が不正です',

            // スポット名
            'sName.string' => 'スポット名は文字列で入力してください',

            // 緯度
            'lat.decimal' => '緯度は整数で入力してください',

            // 経度
            'long.decimal' => '経度は整数で入力してください',

            // 評価点
            'rating.decimal' => '評価点は整数で入力してください',

            // 価格帯
            'price.integer' => '価格帯は整数で入力してください',

            // 駐車場有無
            'hasParking.boolean' => '駐車場有無が不正です',

            // スポット説明
            'summary.string' => '説明は文字列で入力してください',
            'summary.max'    => '説明は255文字以内で入力してください',

            // PlacesAPIの写真参照ID
            'photoReference.string' => '写真参照IDは文字列で入力してください',
            'photoReference.max'    => '写真参照IDは255文字以内で入力してください',

            // GoogleMapルート案内URL
            'directionUrl.string' => 'ルート案内リンクは文字列で入力してください',
            'directionUrl.max'    => 'ルート案内リンクは255文字以内で入力してください',

             // GoogleMapルート案内URL
            'primaryType.string' => 'タイプは文字列で入力してください',
            'primaryType.max'    => 'タイプは255文字以内で入力してください',
        ];
    }
}
