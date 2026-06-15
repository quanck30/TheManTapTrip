/**
 * ./components/search/QuestionForm.jsx にて呼び出す
 * @brief DBから質問内容と回答候補を取得する
 * @Author J.Naka
 * @Date 26/06/09
 * @Update 26/06/12
 */

const BASE_URL = "api/v1/questions";

// 未ログイン：/questions/guest
// ログイン済：/questions/login

export const fetchQuestions = async (userId) => {
    const endpoint = userId ? `${BASE_URL}/login` : `${BASE_URL}/guest`;
    const options = {
        method: "GET",
        headers: { Accept: "application/json" },
    };

    const response = await fetch(endpoint, options);
    if (!response.ok) throw new Error("質問の取得に失敗しました");

    const data = await response.json();

    // ログイン済みユーザ用の処理
    if (userId) {
        // ユーザの過去の回答があれば取得する
    }

    return data;
};
