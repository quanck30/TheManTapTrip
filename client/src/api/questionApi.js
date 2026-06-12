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

export const fetchQuestions = async () => {
    // ログインの判定ロジックを後で追加
    if (true) {
        const response = await fetch(`${BASE_URL}/guest? : ;`, {
            method: "GET",
            headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("質問の取得に失敗しました");
        return response.json();
    } else {
        // ログイン済みユーザは自分のDBを見に行く
        const response = await fetch(`${BASE_URL}/login`, {});
    }
};
