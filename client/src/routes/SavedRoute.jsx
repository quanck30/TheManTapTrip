import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Heart, LayoutGrid, Plus } from "lucide-react";
import SaveListCard from "../components/cards/SaveListCard";

const FILTERS = [
  { key: "all", label: "すべて" },
  { key: "weekend", label: "週末" },
  { key: "cafe", label: "カフェ" },
  { key: "walk", label: "散歩" },
];

export default function SavedRoute() {
  const navigate = useNavigate();
  const [savedSpots, setSavedSpots] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("saved_spots");
      const data = raw ? JSON.parse(raw) : [];
      setSavedSpots(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("保存データの読み込みに失敗しました", e);
      setSavedSpots([]);
    }
  }, []);

  const handleUnsave = (spot) => {
    setSavedSpots((prev) => {
      const next = prev.filter((s) => s.id !== spot.id);
      try {
        localStorage.setItem("saved_spots", JSON.stringify(next));
      } catch (e) {
        console.error("保存データの更新に失敗しました", e);
      }
      return next;
    });
  };

  const filteredSpots =
    activeFilter === "all"
      ? savedSpots
      : savedSpots.filter((s) => s.categories?.includes(activeFilter));

  const isEmpty = filteredSpots.length === 0;

  const CollectionButton = (
    <button
      onClick={() => navigate("/collections/new")}
      className="w-full flex flex-col items-center gap-2 py-6 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500"
    >
      <span className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center">
        <Plus size={18} />
      </span>
      <span className="text-[13px] font-medium">コレクションを作成する</span>
    </button>
  );

  return (
    <div className="w-full max-w-sm mx-auto bg-white h-full flex flex-col">
      {/* トップヘッダー */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button className="text-slate-700 p-1 -ml-1" aria-label="メニュー">
            <Menu size={20} />
          </button>
          <span className="text-[16px] font-bold text-sky-500">TapTrip</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-sky-500">保存済み</span>
          <button
            onClick={() => navigate("/search")}
            className="text-slate-500 p-1"
            aria-label="検索"
          >
            <Search size={18} />
          </button>
          <button onClick={() => navigate("/profile")}>
            <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden" />
          </button>
        </div>
      </div>

      {/* タイトル + 件数 */}
      <div className="flex items-center justify-between px-4 pt-2 pb-3">
        <h1 className="text-[20px] font-bold text-slate-800">あなたが保存したスポット</h1>
        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-[13px]">{filteredSpots.length}</span>
          <LayoutGrid size={16} />
        </div>
      </div>

      {/* フィルタータブ */}
      <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`text-[13px] px-3.5 py-1.5 rounded-full whitespace-nowrap border ${
              activeFilter === f.key
                ? "bg-sky-400 text-white border-sky-400"
                : "bg-white text-slate-500 border-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* メインエリア */}
      {isEmpty ? (
        // データが無いときは残りスペースの縦中央に配置
        <div className="flex-1 flex flex-col justify-center gap-4 px-4 pb-10">
          <div className="flex flex-col items-center justify-center gap-2 py-10 rounded-2xl border border-slate-100">
            <Heart size={28} className="text-slate-300" />
            <p className="text-[13px] text-slate-400">
              保存したスポットはまだありません
            </p>
          </div>
          {CollectionButton}
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-3 pb-4 overflow-y-auto">
          {filteredSpots.map((spot) => (
            <SaveListCard
              key={spot.id}
              spot={spot}
              onUnsave={handleUnsave}
              onClick={() => {
                navigate(`/detail/${spot.id}`, {
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