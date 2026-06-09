<?php

namespace App\Http\Responses;

/**
 * APIレスポンスのJSON形式を共通化します。
 */
class ApiResponse
{
    /**
     * 正常終了時の共通レスポンスを返します。
     */
    public static function success(
        mixed $data = null,
        string $message = '成功しました',
        int $status = 200
    ) {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    /**
     * エラー発生時の共通レスポンスを返します。
     */
    public static function error(
        string $message = 'エラー発生しました',
        int $status = 400
    ) {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], $status);
    }
}
