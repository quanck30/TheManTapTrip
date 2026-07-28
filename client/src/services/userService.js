/**
 * @brief ユーザー情報の更新に関する通信処理
 *
 * LaravelのセッションCookie認証を使用して、ログイン中ユーザーのプロフィール情報を更新する。
 */

import { getCsrfCookie, readXsrfToken } from "./authService";

const USER_URL = "/api/v1/user/";

/**
 * APIレスポンスを解析し、エラー時はバックエンドのメッセージでErrorをthrowする。
 * @param {Response} response - APIレスポンス
 * @param {string} fallbackMessage - メッセージが取得できない場合の既定文言
 * @returns {Promise<Object>} 成功時のJSONデータ
 * @throws {Error} APIリクエストが失敗した場合
 */
const parseOrThrow = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // 422（バリデーション）はフィールドごとのエラーメッセージを優先する
    const validationErrors = Object.values(data.errors ?? {})
      .flat()
      .join(", ");

    throw new Error(validationErrors || data.message || fallbackMessage);
  }

  return data;
};

/**
 * ログイン中ユーザーの表示名を更新する。
 * @param {string} displayName - 更新する表示名（1〜20文字）
 * @returns {Promise<{message: string}>} 更新結果のメッセージ
 * @throws {Error} APIリクエストまたは表示名の更新に失敗した場合
 */
export const updateDisplayName = async (displayName) => {
  // セッション認証のため、更新リクエストの前にCSRF Cookieを取得する
  await getCsrfCookie();

  const response = await fetch(USER_URL, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": readXsrfToken(),
    },
    // LaravelのUserRequestが受け取るキー名に合わせる
    body: JSON.stringify({ displayName }),
  });

  const result = await parseOrThrow(response, "プロフィールの更新に失敗しました。");

  return {
    message: result.message ?? "",
  };
};
