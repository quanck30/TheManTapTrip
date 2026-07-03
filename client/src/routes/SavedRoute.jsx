import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListItem from "../components/cards/ListItem";

export default function SavedRoute() {
  const navigate = useNavigate();
  const [savedSpots, setSavedSpots] = useState([]);

  useEffect(() => {
    // localStorageから保存データを取得
    try {
      const raw = localStorage.getItem("saved_spots");
      const data = raw ? JSON.parse(raw) : [];
      setSavedSpots(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("保存データの読み込みに失敗しました", e);
      setSavedSpots([]);
    }
  }, []);

  return (
    <div className="saved-list-container">
      {savedSpots.length > 0 ? (
        savedSpots.map((spot) => {
          const id = spot.spotId || spot.id;
          return (
            <ListItem
              key={id}
              spot={spot}
              onClick={() => {
                navigate(`/detail/${id}`, {
                  state: { spot, from: "/saved" },
                });
              }}
            />
          );
        })
      ) : (
        <div className="empty-message">保存されたスポットはありません。</div>
      )}
    </div>
  );
}