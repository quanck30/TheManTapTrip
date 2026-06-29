/**
 * @brief 検索結果（places）をアプリ全体で保持するコンテキスト
 */

import { createContext, useContext, useState } from "react";

export const PlacesContext = createContext();

export const PlacesProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);

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
