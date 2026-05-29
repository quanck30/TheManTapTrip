<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Exceptions\DriverMissingConfigurationException;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\AbstractProvider;
use Throwable;

class GoogleAuthController extends Controller
{
    public function googleLogin(LoginRequest $request)
    {
        try {
            /** @var AbstractProvider $provider */
            $provider = Socialite::driver('google');
            $googleUser = $provider->stateless()->userFromToken($request->access_token);
        } catch (ClientException $e) {
            return ApiResponse::error(
                'Googleトークンが無効です',
                401
            );
        } catch (RequestException $e) {
            Log::error('Googleトークン確認リクエストに失敗しました', [
                'message' => $e->getMessage(),
            ]);

            return ApiResponse::error(
                'Googleトークンを確認できませんでした',
                502
            );
        } catch (DriverMissingConfigurationException|BindingResolutionException $e) {
            Log::error('Google Socialite設定エラー', [
                'message' => $e->getMessage(),
            ]);

            return ApiResponse::error(
                'Googleログインの設定が正しくありません',
                500
            );
        } catch (Throwable $e) {
            Log::error('Googleトークンの確認に失敗しました', [
                'message' => $e->getMessage(),
            ]);

            return ApiResponse::error(
                'Google認証に失敗しました',
                401
            );
        }

        try {
            $user = User::findOrCreateUserWithGoogle($googleUser);
            $token = $user->createToken('google-login')->plainTextToken;

            return ApiResponse::success([
                'user' => [
                    'id' => $user->id,
                    'display_name' => $user->display_name,
                ],
                'token' => $token,
                'token_type' => 'Bearer',
            ], 'Googleログインに成功しました');
        } catch (Throwable $e) {
            Log::error('Google認証後のローカルユーザーログイン処理に失敗しました', [
                'message' => $e->getMessage(),
            ]);

            return ApiResponse::error(
                'ログイン処理を完了できませんでした',
                500
            );
        }
    }
}
