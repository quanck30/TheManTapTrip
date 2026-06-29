/**
 * @brief Googleログインの処理を管理するカスタムフック
 * @Author J.Naka
 * @Date 26/06/02
 * @Update
 */

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

/**
 * Googleログインの画面起動、ローディング状態、エラー状態、Laravelとの連携フローを管理するカスタムフック
 * * @returns {Object} - ログイン関数、ローディング状態、エラー状態を返すオブジェクト
 * @return {Function} login - Googleログインを開始する関数
 * @return {boolean} isLoading - ログイン処理が進行中かどうかの状態
 * @return {string|null} error - ログイン処理中に発生したエラーのメッセージ、エラーがない場合はnull
 */
export const useGoogleAuth = (onLoginSuccess) => {
  const { login: saveAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useGoogleLogin({
    /**
     * Google側で本人認証が成功した場合の処理
     * @param {Object} tokenResponse - Googleから返ってきた認証データ一式
     * @param {string} tokenResponse.access_token - Google APIにアクセスするための一時的な通行証
     */
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await authService.googleLogin(tokenResponse.access_token);
        const { token, user } = result.data ?? result;

        if (!token || !user) {
          throw new Error("ログイン情報を取得できませんでした。");
        }

        saveAuth(token, user);
        onLoginSuccess?.(user);
      } catch (err) {
        setError(err.message || "Googleログインに失敗しました。");
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
      setError(
        err.error_description ||
          err.error ||
          err.message ||
          "Googleログインに失敗しました。",
      );
    },

    onNonOAuthError: (err) => {
      console.error("Google non OAuth error:", err);
      setIsLoading(false);
      setError(
        err.type === "popup_closed"
          ? "Googleログイン画面が閉じられました。"
          : "Googleログインを開始できませんでした。",
      );
    },
  });

  return { login, isLoading, error };
};
