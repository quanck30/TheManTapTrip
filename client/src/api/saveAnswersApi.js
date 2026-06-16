/**
 * ./components/search/QuestionForm.jsx にて呼び出す
 * @brief DBに回答を保存する
 * @Author J.Naka
 * @Date 26/06/12
 * @Update 26/06/12
 */

const BASE_URL = "/api/v1";

export const saveAnswers = async (userId, answers) => {
    const response = await fetch(`${BASE_URL}/choices`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ userId, answers }),
    });
    if (!response.ok) throw new Error("回答の保存に失敗しました");
    return response.json();
};
