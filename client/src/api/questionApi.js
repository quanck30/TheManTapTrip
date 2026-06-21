/**
 * ./components/search/QuestionForm.jsx にて呼び出す
 * @brief DBから質問内容と回答候補を取得する
 * @Author J.Naka
 * @Date 26/06/09
 * @Update 26/06/12
 */

/**
 * src/api/questionApi.js
 */
const BASE_URL = "/api/v1";

export const fetchQuestions = async () => {
    const token = localStorage.getItem("authToken");

    // トークンがあれば login 用、なければ guest 用のURLを設定
    const endpoint = token
        ? `${BASE_URL}/questions/login`
        : `${BASE_URL}/questions/guest`;

    let response = await fetch(endpoint, {
        method: "GET",
        headers: {
            Accept: "application/json",
            // トークンがある場合のみAuthorizationヘッダーを付与
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (response.status === 401) {
        response = await fetch(`${BASE_URL}/questions/guest`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });
    }

    if (!response.ok) {
        throw new Error("質問の取得に失敗しました");
    }

    return await response.json();
};

export const saveAnswers = async (questionId, queryItemId) => {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${BASE_URL}/choices`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ questionId, queryItemId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`回答の保存に失敗しました: ${error.message}`);
    }
    return await response.json();
};
