/**
 * @brief Laravelとの認証に関する通信処理専門のオブジェクト
 * @Author J.Naka
 * @Date 26/06/02
 * @Update
 */

/**
 * document.cookie から XSRF-TOKEN を読み取り、URLデコードして返す
 * @returns {string} - CSRFトークン（存在しない場合は空文字）
 */
export const readXsrfToken = () => {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
};

/**
 * Sanctum SPA の CSRF Cookie を発行してもらう
 * 書き込み系（register/login/logout）を叩く前に必ず呼ぶ
 */
export const getCsrfCookie = async () => {
  await fetch(`/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
};

/**
 * レスポンスを解析し、失敗時はバックエンドのメッセージで Error を throw する
 * @param {Response} response - fetch のレスポンス
 * @param {string} fallbackMessage - メッセージが取れなかった場合の既定文言
 * @returns {Promise<Object>} - 成功時のJSONデータ
 */
const parseJsonOrThrow = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // 422（バリデーション）は errors の先頭メッセージを優先する
    const firstError = data.errors && Object.values(data.errors)?.[0]?.[0];
    throw new Error(firstError || data.message || fallbackMessage);
  }

  return data;
};

/**
 * 1回だけ POST を実行する（CSRF Cookie 取得 → ヘッダ付与 → 送信）
 */
const sendPost = async (url, body) => {
  await getCsrfCookie();

  return fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": readXsrfToken(),
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
};

/**
 * CSRF Cookie を取得したうえで書き込み系リクエストを送信する共通処理。
 * 419（CSRF/セッション不整合。古い Cookie 等が原因）の場合は Cookie を取り直して1回だけ再試行する。
 * @param {string} url - リクエスト先
 * @param {Object} [body] - 送信するボディ（省略可）
 * @returns {Promise<Response>}
 */
const postWithCsrf = async (url, body) => {
  let response = await sendPost(url, body);

  if (response.status === 419) {
    // 古い XSRF-TOKEN 等で失敗した場合に備え、新しい Cookie で1度だけ再試行する
    response = await sendPost(url, body);
  }

  return response;
};

/**
 * Laravelとの認証に関する通信処理を専門に行う窓口オブジェクト
 */
export const authService = {
  /**
   * Googleから取得したアクセストークンを使ってログイン認証を行う非同期関数（Sanctum SPA セッション）
   * メールログインと同じく HttpOnly Cookie（セッション）で認証する。トークンは返さない。
   * @param {string} accessToken - Googleから発行された暗号化文字列（アクセストークン）
   * @returns {Promise<Object>} - ログインしたユーザー情報
   * @throws {Error} - サーバーとの通信に失敗、またはLaravel側からエラーレスポンス（401や500など）が返ってきた場合
   */
  googleLogin: async (accessToken) => {
    // Laravel側の$request->accessTokenで持ってるキーと合わせる
    const response = await postWithCsrf(`/api/v1/auth/google`, { accessToken });

    const data = await parseJsonOrThrow(response, "ログインに失敗しました。");
    return data.data?.user ?? data.user;
  },

  /**
   * メールアドレスでアカウント登録する（Sanctum SPA セッション）
   * @param {Object} payload
   * @param {string} payload.displayName - 表示名
   * @param {string} payload.email - メールアドレス
   * @param {string} payload.password - パスワード（8文字以上）
   * @returns {Promise<Object>} - 登録したユーザー情報
   */
  emailRegister: async ({ displayName, email, password }) => {
    const response = await postWithCsrf(`/api/v1/auth/register`, {
      displayName,
      email,
      password,
    });

    const data = await parseJsonOrThrow(response, "アカウント登録に失敗しました。");
    return data.data?.user ?? data.user;
  },

  /**
   * メールアドレスとパスワードでログインする（Sanctum SPA セッション）
   * @param {Object} payload
   * @param {string} payload.email - メールアドレス
   * @param {string} payload.password - パスワード
   * @returns {Promise<Object>} - ログインしたユーザー情報
   */
  emailLogin: async ({ email, password }) => {
    const response = await postWithCsrf(`/api/v1/auth/email`, {
      email,
      password,
    });

    const data = await parseJsonOrThrow(response, "ログインに失敗しました。");
    return data.data?.user ?? data.user;
  },

  /**
   * ログアウトする（セッション破棄）
   */
  emailLogout: async () => {
    const response = await postWithCsrf(`/api/v1/auth/logout`);
    await parseJsonOrThrow(response, "ログアウトに失敗しました。");
  },

  /**
   * 現在のセッションでログイン中のユーザーを取得する
   * @returns {Promise<Object|null>} - ログイン中ならユーザー情報、未ログインなら null
   */
  fetchMe: async () => {
    const response = await fetch(`/api/v1/me`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      // 401（未ログイン）などは null を返す
      return null;
    }

    const data = await response.json().catch(() => ({}));
    return data.data?.user ?? data.user ?? null;
  },
};
