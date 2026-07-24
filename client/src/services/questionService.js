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
import { getCsrfCookie, readXsrfToken } from "./authService";

const BASE_URL = "/api/v1";

export const fetchQuestions = async (isAuthenticated) => {
    await getCsrfCookie();

    // ログイン中なら login 用、未ログインなら guest 用のURLを設定
    const endpoint = isAuthenticated
        ? `${BASE_URL}/questions/login`
        : `${BASE_URL}/questions/guest`;

    let response = await fetch(endpoint, {
        method: "GET",
        // セッション（Cookie）認証のために Cookie を送受信する
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    });

    if (response.status === 401) {
        response = await fetch(`${BASE_URL}/questions/guest`, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        });
    }
    if (!response.ok) {
        // バックエンドが返すメッセージをそのまま利用する
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "質問の取得に失敗しました");
    }

    return await response.json();
};

export const saveAnswers = async (questionId, queryItemId) => {
    if (
        questionId == null || queryItemId == null ||
        Number.isNaN(Number(questionId)) || Number.isNaN(Number(queryItemId))
    ) {
        throw new Error("回答データが不完全です。もう一度お試しください。");
    }

    // セッション認証のため CSRF Cookie を用意してヘッダに付与する
    await getCsrfCookie();

    const response = await fetch(`${BASE_URL}/choices`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": readXsrfToken(),
        },
        body: JSON.stringify({ questionId, queryItemId }),
    });

    if (!response.ok) {
        // バックエンドが返すメッセージをそのまま利用する
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "回答の保存に失敗しました");
    }
    return await response.json();
};

/**
 * 全ての質問に回答が揃っているか検証する。送信前のガードとして使う。
 */
export const validateAnswersComplete = (questions, answers) => {
    const unanswered = questions.filter((q) => answers[q.id] === undefined || answers[q.id] === null);
    if (unanswered.length > 0) {
        throw new Error(
            `未回答の質問があります（${unanswered.map((q) => q.title).join("、")}）。もう一度お試しください。`
        );
    }
};
