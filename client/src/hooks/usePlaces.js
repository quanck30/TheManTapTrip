/**
 * @brief 検索結果（places）コンテキストを購読する usePlaces フック
 * @note context 定義は PlacesContext.js、Provider は PlacesProvider.jsx にある。
 */

import { useContext } from "react";
import { PlacesContext } from "../context/PlacesContext";

export const usePlaces = () => useContext(PlacesContext);
