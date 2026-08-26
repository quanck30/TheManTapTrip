/**
 * ./components/search/SearchResultList.jsx にて呼び出す
 * @brief 回答を送ってその結果を取得する
 * @Author J.Naka
 * @Date 26/06/09
 * @Update 26/06/12
 */

import { getCsrfCookie, readXsrfToken } from "./authService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const searchPlaces = async (searchData) => {
  const hasAnswers = searchData?.answers && Object.keys(searchData.answers).length > 0;
  const hasLocation = searchData?.address || (searchData?.latitude != null && searchData?.longitude != null);
  if (!hasAnswers || !hasLocation) {
    throw new Error("検索データが不完全です。もう一度お試しください。");
  }

  // statefulApiミドルウェア配下のためログイン有無に関わらずCSRF検証が必要
  await getCsrfCookie();

  const response = await fetch(`${BASE_URL}/placeSearch`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": readXsrfToken(),
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
