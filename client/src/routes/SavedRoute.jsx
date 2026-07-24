import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
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

  useEffect(() => {
    const loadSpots = async () => {
      try {
        const result = await getSpots();
        const nextSpots = result.spots ?? [];
        setSpots(nextSpots);

        const types = [...new Set(nextSpots.map((spot) => spot.primaryType).filter(Boolean))];

        setPrimaryTypes(types);
      } catch {}
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
      toast.success(result.message || "行き済みを登録しました");
    } catch {
      // useSpot側でエラー通知を表示する。
    }
  };

  const filteredSpots = activeFilter ? spots.filter((spot) => spot.primaryType === activeFilter) : spots;

  const isEmpty = filteredSpots.length === 0;

  const CollectionButton = (
    <button onClick={() => navigate("/collections/new")} className="w-full flex flex-col items-center gap-2 py-6 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500">
      <span className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center">
        <Plus size={18} />
      </span>
      <span className="text-[13px] font-medium">コレクションを作成する</span>
    </button>
  );

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
      {isEmpty ? (
        <div className="flex-1 flex flex-col justify-center gap-4 px-4 pb-10">
          <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-2xl border border-slate-100">
            <Heart size={28} className="text-slate-300" />
            <p className="text-[13px] text-slate-400">保存したスポットはまだありません</p>
          </div>
          {CollectionButton}
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
          <div className="pt-1">{CollectionButton}</div>
        </div>
      )}
    </div>
  );
}
