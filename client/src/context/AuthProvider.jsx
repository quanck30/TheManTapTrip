import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./AuthContext";

function removeDiagItems() {
  localStorage.removeItem("diag_step");
  localStorage.removeItem("diag_answers");
  localStorage.removeItem("diag_isConfirming");
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const setAuthenticatedUser = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const logout = async () => {
    // Email セッション（Cookie）ユーザーのためにサーバー側もログアウトする。失敗しても続行。
    try {
      await authService.emailLogout();
    } catch {
      // セッションが既に無い等は無視してローカルをクリアする
    }

    setUser(null);
    // 旧実装の認証キャッシュが残っている場合も削除する。
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    removeDiagItems();
  };

  // 起動時にHttpOnlyセッションCookieの有効性を確認し、現在のユーザーを取得する。
  useEffect(() => {
    let cancelled = false;

    authService
      .fetchMe()
      .then((currentUser) => {
        if (!cancelled) setUser(currentUser || null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        isAuthenticated: Boolean(user),
        logout,
        setAuthenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
