/**
 * @brief メールアドレス／パスワードによるログイン・登録を管理するカスタムフック
 *        （Sanctum SPA セッション Cookie 認証）
 */

import { useState } from "react";
import { toast } from "sonner";
import { authService } from "../services/authService";
import { useAuth } from "./useAuth";

/**
 * Email 認証（ログイン・新規登録）のローディング・エラー状態と通信フローを管理するフック
 * @param {Function} [onSuccess] - 認証成功時に呼ばれるコールバック（引数: user）
 * @returns {{ login: Function, register: Function, isLoading: boolean, error: string|null }}
 */
export const useEmailAuth = (onSuccess) => {
  const { setAuthenticatedUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ログイン・登録に共通する実行ラッパー（成功時に状態保存とコールバック、失敗時にトースト）
  const run = async (action) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await action();

      if (!user) {
        throw new Error("ユーザー情報を取得できませんでした。");
      }

      setAuthenticatedUser(user);
      onSuccess?.(user);
      return user;
    } catch (err) {
      const message = err.message || "認証に失敗しました。";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * メールアドレスとパスワードでログインする
   * @param {{ email: string, password: string }} credentials
   */
  const login = (credentials) => run(() => authService.emailLogin(credentials));

  /**
   * メールアドレスでアカウント登録する
   * @param {{ displayName: string, email: string, password: string }} payload
   */
  const register = (payload) => run(() => authService.emailRegister(payload));

  return { login, register, isLoading, error };
};
