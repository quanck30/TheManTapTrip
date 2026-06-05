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

/**
 * Google OAuthログインを処理するコントローラーです。
 */
class GoogleAuthController extends Controller
{
    /**
     * Googleアクセストークンを検証し、ローカルユーザーとしてログインします。
     */
    public function googleLogin(LoginRequest $request)
    {
        try {
            // フロントエンドから受け取ったGoogleアクセストークンをSocialiteで検証します。
            /** @var AbstractProvider $provider */
            $provider = Socialite::driver('google');
            $googleUser = $provider->stateless()->userFromToken($request->accessToken);
        } catch (ClientException $e) {
            // Google側でトークンが無効と判断された場合は認証エラーを返します。
            return ApiResponse::error(
                'Googleトークンが無効です',
                401
            );
        } catch (RequestException $e) {
            // Google APIへの通信失敗は、外部サービス連携エラーとして扱います。
            Log::error('Googleトークン確認リクエストに失敗しました', [
                'message' => $e->getMessage(),
            ]);

            return ApiResponse::error(
                'Googleトークンを確認できませんでした',
                502
            );
        } catch (DriverMissingConfigurationException|BindingResolutionException $e) {
            // SocialiteやGoogle OAuth設定の不足はサーバー設定エラーとして記録します。
            Log::error('Google Socialite設定エラー', [
                'message' => $e->getMessage(),
            ]);

            return ApiResponse::error(
                'Googleログインの設定が正しくありません',
                500
            );
        } catch (Throwable $e) {
            // 想定外の認証エラーは詳細をログに残し、クライアントには汎用エラーを返します。
            Log::error('Googleトークンの確認に失敗しました', [
                'message' => $e->getMessage(),
            ]);

            return ApiResponse::error(
                'Google認証に失敗しました',
                401
            );
        }

        try {
            // 検証済みGoogleユーザーに対応するローカルユーザーを取得または作成します。
            $user = User::findOrCreateUserWithGoogle($googleUser);

            // 前回のトークンを削除する。
            $user->tokens()->delete();
            // API認証用のSanctumトークンを発行します。
            $token = $user->createToken('google-login')->plainTextToken;

            return ApiResponse::success([
                'user' => [
                    'id' => $user->id,
                    'displayName' => $user->display_name,
                ],
                'token' => $token,
                'tokenType' => 'Bearer',
            ], 'Googleログインに成功しました');
        } catch (Throwable $e) {
            // Google認証後のユーザー作成やトークン発行に失敗した場合の処理です。
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
