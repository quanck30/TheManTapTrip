<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Responses\ApiResponse;
use Exception;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{

    public function __construct(private ApiResponse $apiResponse) {}

    /**
     * Display the specified resource.
     */
    public function show()
    {
        try {
            // ログインアカウントのユーザーIDを取得
            $userId = Auth::id();

            // ユーザー情報を取得
            $user["displayName"] = User::find($userId)->displayName;

            // 取得した情報を返す
            return $this->apiResponse->success(
                $user,
                "データ取得に成功しました。"
            );
        } catch (Exception $e) {
            // DB保存でエラーが起きた場合ログに記録
            Log::error('ユーザー名更新エラー: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request)
    {
        // ログインアカウントのユーザーIDを取得
        $user = Auth::user();
        $user->displayName = $request->displayName;

        try {
            // データベースに保存
            $user->save();

            // レスポンスを返す
            return $this->apiResponse->success(
                null,
                "ユーザー名を更新しました。"
            );

        } catch(Exception $e) {
            // DB保存でエラーが起きた場合ログに記録
            Log::error('ユーザー名更新エラー: ' . $e->getMessage());

            return $this->apiResponse->error(
                "サーバーエラーが発生したため、更新に失敗しました。",
                500
            );
        }
    }
}
