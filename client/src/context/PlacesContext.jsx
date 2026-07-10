/**
 * @brief 検索結果（places）をアプリ全体で保持するコンテキスト
 */

import { createContext, useContext, useState } from "react";

const PLACES_STORAGE_KEY = "search_places";

// sessionStorage から places を安全に読み込む（不正なデータの場合は空配列＆キー削除）
const getStoredPlaces = () => {
  try {
    const raw = sessionStorage.getItem(PLACES_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("検索結果の読み込みに失敗しました", e);
    sessionStorage.removeItem(PLACES_STORAGE_KEY);
    return [];
  }
};

export const PlacesContext = createContext();

export const PlacesProvider = ({ children }) => {
  const [places, setPlacesState] = useState(getStoredPlaces);

  // 新しい検索結果が来るたびに、古いsessionStorageのデータを削除してから新しいデータを保存する
  const setPlaces = (newPlaces) => {
    sessionStorage.removeItem(PLACES_STORAGE_KEY);
    sessionStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(newPlaces));
    setPlacesState(newPlaces);
  };

  // 一覧から spotId でスポットを探す（/detail/:spotId のパラメータと一致）
  const getSpotById = (spotId) =>
    places.find((p) => String(p.spotId) === String(spotId));

  return (
    <PlacesContext.Provider value={{ places, setPlaces, getSpotById }}>
      {children}
    </PlacesContext.Provider>
  );
};

export const usePlaces = () => useContext(PlacesContext);
