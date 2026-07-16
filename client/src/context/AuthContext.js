/**
 * @brief 認証コンテキストのオブジェクト定義のみ
 * @note フックは useAuth.js、Provider は AuthProvider.jsx にある。
 */

import { createContext } from "react";

export const AuthContext = createContext(null);
