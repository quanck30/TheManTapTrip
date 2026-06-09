/**
 * @brief Laravelとの認証に関する通信処理専門のオブジェクト
 * @Author J.Naka
 * @Date 26/06/02
 * @Update
 */

/**
 * Laravelとの認証に関する通信処理を専門に行う窓口オブジェクト
 */
export const authService = {
    /**
     * Googleから取得したアクセストークンを使ってログイン認証を行う非同期関数
     * * @param {string} accessToken - Googleから発行された暗号化文字列（アクセストークン）
     * @returns {Promise<Object>} - Laravelサーバーから返ってくるJSONデータ（トークンやユーザー情報）
     * @throws {Error} - サーバーとの通信に失敗、またはLaravel側からエラーレスポンス（401や500など）が返ってきた場合
     */
    googleLogin: async (accessToken) => {
        const response = await fetch(
            `api/v1/auth/google`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                // Laravel側の$request->access_tokenで持ってるキーと合わせる
                body: JSON.stringify({ access_token: accessToken }),
            },
        );

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            throw new Error(data.message || "login failed at Server");
        }

        return data;
    },
};
