<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\EmailLoginRequest;
use App\Http\Requests\UserRegisterRequest;
use App\Http\Responses\ApiResponse;
use App\Models\User;
use App\Models\UserAuth;
use DB;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Log;

class AuthenticatedSessionController extends Controller
{
    public function __construct(private ApiResponse $apiResponse)
    {
    }

    /**
     * メールアドレスでアカウント登録
     * @param UserRegisterRequest $request アカウント登録情報
     * @return JsonResponse 登録結果
     */
    public function register(UserRegisterRequest $request)
    {
        try {
            $user = DB::transaction(function () use ($request) {
                // ユーザー作成
                $user = User::create([
                    'displayName' => $request['displayName'],
                ]);

                UserAuth::create([
                    'userId' => $user->id,
                    'provider' => 'email',
                    'providerKey' => null,
                    'email' => $request['email'],
                    'passHash' => Hash::make($request['password']),
                ]);

                return $user;
            });

            // 登録後そのままログイン状態にする
            Auth::login($user);

            // セッション固定攻撃のためセッションIDを作り直す
            $request->session()->regenerate();

            $user->load('userAuths');

            return $this->apiResponse->success(
                $this->buildAuthData($user),
                "アカウント登録に成功しました！",
                201
            );

        } catch (Exception $e) {

            // エラーをログファイルに出力
            Log::error("アカウント登録に失敗しました。", [
                'error_message' => $e->getMessage(), // エラー内容
                'file' => $e->getFile(),    // 発生したファイル
                'line' => $e->getLine(),    // 発生した行
                'input_email' => $request->email,  // 調査用にEmailも記録（パスワードは個人情報なので含めない）
            ]);

            return $this->apiResponse->error(
                "アカウント登録中に予期せぬエラーが発生しました。時間を置いて再度お試しください。",
                500
            );
        }
    }

    /**
     * メールアドレスを使用したログイン処理
     * @param EmailLoginRequest $request
     * @return JsonResponse ログイン結果
     */
    public function emailLogin(EmailLoginRequest $request): JsonResponse
    {
        try {
            // emailログイン情報を取得
            $userAuth = UserAuth::query()
                ->with('user.userAuths')
                ->where('provider', 'email')
                ->where('email', $request->input('email'))
                ->first();

            // 認証失敗
            if (!$userAuth || !$userAuth->passHash || !Hash::check($request->input('password'), $userAuth->passHash)) {
                return $this->apiResponse->error(
                    "メールアドレスまたはパスワードが正しくありません。",
                    401
                );
            }

            $user = $userAuth->user;

            // セッションログイン
            Auth::login($user, $request->input('remember'));

            // セッションID再生成
            $request->session()->regenerate();

            return $this->apiResponse->success(
                $this->buildAuthData($user),
                'ログインに成功しました。',
                200
            );

        } catch (Exception $e) {
            // エラーをログファイルに出力
            Log::error("ログインに失敗しました。", [
                'error_message' => $e->getMessage(), // エラー内容
                'file' => $e->getFile(),    // 発生したファイル
                'line' => $e->getLine(),    // 発生した行
                'input_email' => $request->email,  // 調査用にEmailも記録（パスワードは個人情報なので含めない）
            ]);

            return $this->apiResponse->error(
                "ログインに失敗しました。",
                500
            );
        }
    }

    /**
     * ログアウト処理
     * @param Request $request
     * @return JsonResponse ログアウト結果
     */
    public function emailLogout(Request $request): JsonResponse
    {
        try {
            // セッションログアウト
            Auth::guard('web')->logout();

            // セッション破棄
            $request->session()->invalidate();

            // csrfトークンの再生成
            $request->session()->regenerateToken();

            return $this->apiResponse->success(
                [],
                'ログアウトしました。',
                200,
            );
        } catch (Exception $e) {
            // エラーをログファイルに出力
            Log::error("ログアウトに失敗しました。", [
                'error_message' => $e->getMessage(), // エラー内容
                'file' => $e->getFile(),    // 発生したファイル
                'line' => $e->getLine(),    // 発生した行
            ]);

            return $this->apiResponse->error(
                "ログアウトに失敗しました。",
                500
            );
        }
    }

    /**
     * ログイン中ユーザー取得
     * @param Request $request
     * @return JsonResponse ログイン中のユーザー情報
     */
    public function me(Request $request)
    {

        $user = $request->user();

        if (!$user) {
            return $this->apiResponse->error('認証情報が無効です。再度ログインしてください。', 401);
        }

        $user->loadMissing('userAuths');

        return $this->apiResponse->success(
            [
                'user' => $this->userResponse($user),
            ],
            "ログイン中のユーザー情報を取得しました。",
            200,
        );

    }

    /*
    | 認証成功時のdata生成
    */
    private function buildAuthData(User $user): array
    {
        $data = [
            'user' => $this->userResponse($user),
        ];

        return $data;
    }

    /*
    | ユーザー情報レスポンス生成
    */
    private function userResponse(User $user): array
    {
        return [
            'id' => $user->id,
            'displayName' => $user->displayName,
            'email' => $user->userAuths
                        ->firstWhere('provider', 'email')?->email,
        ];
    }
}
