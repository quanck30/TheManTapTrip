/**
 * @brief Googleログインの処理を管理するカスタムフック
 * @Author J.Naka
 * @Date 26/06/02
 * @Update
 */

import { useState } from "react";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { authService } from "../services/authService";
import { useAuth } from "./useAuth";

/**
 * Googleログインの画面起動、ローディング状態、エラー状態、Laravelとの連携フローを管理するカスタムフック
 * * @returns {Object} - ログイン関数、ローディング状態、エラー状態を返すオブジェクト
 * @return {Function} triggerGoogleLogin - Googleログインを開始する関数
 * @return {boolean} isLoading - ログイン処理が進行中かどうかの状態
 * @return {string|null} error - ログイン処理中に発生したエラーのメッセージ、エラーがない場合はnull
 */
export const useGoogleAuth = (onLoginSuccess) => {
  const { setAuthenticatedUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerGoogleLogin = useGoogleLogin({
    /**
     * Google側で本人認証が成功した場合の処理
     * @param {Object} tokenResponse - Googleから返ってきた認証データ一式
     * @param {string} tokenResponse.access_token - Google APIにアクセスするための一時的な通行証
     */
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);

      try {
        const user = await authService.googleLogin(tokenResponse.access_token);

        if (!user) {
          throw new Error("ログイン情報を取得できませんでした。");
        }

        // セッション（HttpOnly Cookie）認証なのでトークンは保存しない。
        setAuthenticatedUser(user);
        onLoginSuccess?.(user);
      } catch (err) {
        // バックエンドが返すメッセージをそのままトースト表示
        const message = err.message || "Googleログインに失敗しました。";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },

    /**
     * ユーザがGoogleログインをキャンセルした場合や、Google側でエラーが発生した場合の処理
     * @param {Object} err - Googleから渡されるエラーオブジェクト
     */
    onError: (err) => {
      console.error("Google login error:", err);
      setIsLoading(false);
      const message =
        err.error_description ||
        err.error ||
        err.message ||
        "Googleログインに失敗しました。";
      setError(message);
      toast.error(message);
    },

    onNonOAuthError: (err) => {
      console.error("Google non OAuth error:", err);
      setIsLoading(false);
      const message =
        err.type === "popup_closed"
          ? "Googleログイン画面が閉じられました。"
          : "Googleログインを開始できませんでした。";
      setError(message);
      toast.error(message);
    },
  });

  return { triggerGoogleLogin, isLoading, error };
};
