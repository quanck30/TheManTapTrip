/**
 * ./components/search/SearchResultList.jsx にて呼び出す
 * @brief 回答を送ってその結果を取得する
 * @Author J.Naka
 * @Date 26/06/09
 * @Update 26/06/12
 */

// Cloudflare: .env
// Local: 'api/v1'
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        throw new Error("場所の検索に失敗しました");
    }
    return response.json();
};
