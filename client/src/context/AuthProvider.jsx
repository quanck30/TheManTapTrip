import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./AuthContext";

const TOKEN_STORAGE_KEY = "authToken";
const USER_STORAGE_KEY = "authUser";

function removeDiagItems() {
  localStorage.removeItem("diag_step");
  localStorage.removeItem("diag_answers");
  localStorage.removeItem("diag_isConfirming");
}
const getStoredUser = () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(getStoredUser);

  const setAuthenticatedUser = (authenticatedUser) => {
    setUser(authenticatedUser);

    if (authenticatedUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const login = ( authenticatedUser) => {
    if (authenticatedUser) {
      setAuthenticatedUser(authenticatedUser);
    }
  };

  const logout = async () => {
    // Email セッション（Cookie）ユーザーのためにサーバー側もログアウトする。失敗しても続行。
    try {
      await authService.emailLogout();
    } catch {
      // セッションが既に無い等は無視してローカルをクリアする
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    removeDiagItems();
  };

  // 起動時ブートストラップ：Bearer トークンが無い（＝Email セッション想定）ときのみ
  // /api/me でセッションの有効性を確認し、状態を最新化する。
  useEffect(() => {
    if (token) {
      return;
    }

    let cancelled = false;

    authService
      .fetchMe()
      .then((currentUser) => {
        if (cancelled) return;
        // 返ればログイン中、返らなければ（401）ローカルの user をクリアする
        setAuthenticatedUser(currentUser || null);
      })
      .catch(() => {
        // ネットワークエラー時はローカルのキャッシュを維持する
      });

    return () => {
      cancelled = true;
    };
    // 初回マウント時のみ実行する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token) || Boolean(user),
        login,
        logout,
        getToken: () => token,
        setAuthenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
