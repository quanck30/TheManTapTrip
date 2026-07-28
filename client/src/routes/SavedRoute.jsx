import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Loader2, Sparkles } from "lucide-react";
import SaveListCard from "../components/cards/SaveListCard";
import TypeFilterBar from "../components/filters/TypeFilterBar";
import { useSpot } from "../hooks/useSpot";
import { toast } from "sonner";

export default function SavedRoute() {
  const navigate = useNavigate();
  const [spots, setSpots] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const { getSpots, deleteSpot, setVisited } = useSpot();
  const [primaryTypes, setPrimaryTypes] = useState([]);
  const [isLoadingSpots, setIsLoadingSpots] = useState(true);

  useEffect(() => {
    const loadSpots = async () => {
      try {
        const result = await getSpots();
        const nextSpots = result.spots ?? [];
        setSpots(nextSpots);

        const types = [...new Set(nextSpots.map((spot) => spot.primaryType).filter(Boolean))];

        setPrimaryTypes(types);
      } catch {}
      finally {
        setIsLoadingSpots(false);
      }
    };
    loadSpots();
    return () => {};
  }, [getSpots]);
  const handleUnsave = async (spot) => {
    try {
      const result = await deleteSpot(spot.id);
      setSpots((prev) => prev.filter((s) => s.id != spot.id));
      toast.success(result.message || `${spot.sName}お気に入りを削除しました`);
    } catch {}
  };

  const handleSetVisited = async (spotId) => {
    try {
      const result = await setVisited(spotId);
      setSpots((prev) => prev.map((s) => (s.id === spotId ? { ...s, isVisited: 1 } : s)));
      toast.success(result.message || "行き済みを登録しました");
    } catch {
      // useSpot側でエラー通知を表示する。
    }
  };

  const filteredSpots = activeFilter ? spots.filter((spot) => spot.primaryType === activeFilter) : spots;

  const isEmpty = filteredSpots.length === 0;

  return (
    <div className="w-full max-w-sm mx-auto bg-white h-full flex flex-col">
      {/* タイトル */}
      <div className="px-4 pt-8 pb-3">
        <h1 className="text-[20px] font-bold text-slate-800">あなたが保存したスポット</h1>
      </div>

      {/* フィルタータブ */}
      <div className="px-4 pb-3">
        <TypeFilterBar types={primaryTypes} selectedType={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* メインエリア */}
      {isLoadingSpots ? (
        <div className="filter-loading">
          <Loader2 className="filter-loading-spinner" />
          <span>保存したスポットを読み込み中...</span>
        </div>
      ) : isEmpty ? (
        <div className="flex-1 flex flex-col justify-center gap-4 px-4 pb-10">
          <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-2xl border border-slate-100">
            <Bookmark size={28} className="text-slate-300" />
            <p className="text-[13px] text-slate-400">保存したスポットはまだありません</p>
          </div>
          <button
            onClick={() => navigate("/recommend")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-sky-500 text-white text-[14px] font-medium active:bg-sky-600"
          >
            <Sparkles size={16} />
            おすすめのスポットを見る
          </button>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-3 pb-4 overflow-y-auto">
          {filteredSpots.map((spot) => (
            <SaveListCard
              key={spot.id}
              spot={spot}
              onSetVisited={handleSetVisited}
              onUnsave={handleUnsave}
              onClick={() => {
                navigate(`/detail/${spot.spotId}`, {
                  state: { spot, from: "/saved" },
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
