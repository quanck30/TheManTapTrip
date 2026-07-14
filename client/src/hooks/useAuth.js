/**
 * @brief 認証コンテキストを購読する useAuth フック
 * @note context 定義は AuthContext.js、Provider は AuthProvider.jsx にある。
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth は AuthProvider の内側で使用する必要があります。");
  }

  return context;
};
