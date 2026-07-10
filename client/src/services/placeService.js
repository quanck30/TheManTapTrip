/**
 * ./components/search/SearchResultList.jsx にて呼び出す
 * @brief 回答を送ってその結果を取得する
 * @Author J.Naka
 * @Date 26/06/09
 * @Update 26/06/12
 */

const BASE_URL = "/api/v1";

export const searchPlaces = async (searchData) => {
    const response = await fetch(`${BASE_URL}/placeSearch`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(searchData),
    });

    if (!response.ok) {
        // バックエンドが返すメッセージをそのまま利用する
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "場所の検索に失敗しました");
    }
    return response.json();
};
