<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
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
    protected function __construct(private ApiResponse $apiResponse) {}

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

            return $this->apiResponse->success(
                [
                    'id' => $user->id,
                    'displayName' => $user->displayName,
                    'email' => $request['email'],
                ],
                "アカウント登録に成功しました！",
                201
            );

        } catch(Exception $e) {

            // エラーをログファイルに出力
            Log::error("アカウント登録に失敗しました。", [
                'error_message' => $e->getMessage(), // エラー内容
                'file'          => $e->getFile(),    // 発生したファイル
                'line'          => $e->getLine(),    // 発生した行
                'input_email'   => $request->email,  // 調査用にEmailも記録（パスワードは個人情報なので含めない）
            ]);

            return $this->apiResponse->error(
                "アカウント登録中に予期せぬエラーが発生しました。時間を置いて再度お試しください。",
                500
            );
        }
    }
}
