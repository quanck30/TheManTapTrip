<?php

/**
 * @author DINH BINH QUAN
 * 2026/06/05
 */

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Responses\ApiResponse;
use App\Providers\GoogleProvider;
use App\Services\SocialLoginService;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Exceptions\DriverMissingConfigurationException;
use Throwable;

class SocialLoginController extends Controller
{
    //
    public function google(LoginRequest $request, SocialLoginService $socialLoginService)
    {
        try {
            $user = $socialLoginService->login(new GoogleProvider, $request->accessToken);
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
        } catch (DriverMissingConfigurationException | BindingResolutionException $e) {
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
        // API認証用のSanctumトークンを発行します。
        $token = $user->createToken('google-login')->plainTextToken;

        return ApiResponse::success([
            'user' => [
                'id' => $user->id,
                'displayName' => $user->displayName,
            ],
            'token' => $token,
            'tokenType' => 'Bearer',
        ], 'Googleログインに成功しました');
    }
}
