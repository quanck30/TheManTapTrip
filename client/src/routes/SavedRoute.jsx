import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SaveListCard from "../components/cards/SaveListCard";
import { mockSpots } from "../data/mockSpots";

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
      {mockSpots.map((spot) => (
        <SaveListCard
          key={spot.id}
          spot={spot}
          onClick={() => {
            navigate(`/detail/${spot.id}`, {
              state: { spot, from: "/saved" },
            });
          }}
        />
      ))}
    </div>
  );
}