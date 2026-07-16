import { useState } from "react";
import {
  Menu,
  Search,
  MoreVertical,
  Heart,
  LayoutGrid,
  Plus,
  Home,
  Compass,
  Bookmark,
  User,
} from "lucide-react";
import noImage from "../assets/no_image.jpg";
import { mockSpots } from "../data/mockSpots";

const FILTERS = [
  { key: "all", label: "すべて" },
  { key: "weekend", label: "週末" },
  { key: "cafe", label: "カフェ" },
  { key: "walk", label: "散歩" },
];

function SpotCard({ spot, onSelect, onUnsave, onOpenMenu }) {
  const title = spot.displayName?.text || "名称不明";
  const imageUrl = spot.photos?.[0]?.flagUrl || noImage;
  const tags = spot.tags || [];

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = noImage;
  };

  return (
    <div
      onClick={() => onSelect?.(spot)}
      className="relative flex gap-3 p-3 rounded-2xl border border-slate-100 bg-white cursor-pointer active:bg-slate-50"
    >
      <img
        src={imageUrl}
        alt={title}
        onError={handleImageError}
        className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0"
      />

      <div className="flex-1 min-w-0 flex flex-col gap-1.5 pr-6">
        <h3 className="text-[14px] font-semibold text-slate-800 truncate">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-[12px]">
          {typeof spot.matchScore === "number" && (
            <span className="bg-emerald-500 text-white font-medium px-2 py-0.5 rounded-full text-[11px]">
              {spot.matchScore}% match
            </span>
          )}
          {spot.distance && (
            <span className="text-slate-400">{spot.distance}</span>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex items-center gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenMenu?.(spot);
        }}
        className="absolute top-2 right-2 text-slate-400 p-1"
        aria-label="メニュー"
      >
        <MoreVertical size={16} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onUnsave?.(spot);
        }}
        className="absolute bottom-3 right-3 text-rose-400 p-1"
        aria-label="保存を解除"
      >
        <Heart size={18} className="fill-rose-400" />
      </button>
    </div>
  );
}

function BottomNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 py-1 px-3"
    >
      <div
        className={`p-1.5 rounded-full ${
          active ? "bg-sky-100 text-sky-500" : "text-slate-400"
        }`}
      >
        <Icon size={20} className={active ? "fill-sky-100" : ""} />
      </div>
      <span
        className={`text-[10px] ${
          active ? "text-sky-500 font-medium" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function Saved({
  onMenuClick,
  onSearchClick,
  onProfileClick,
  onSelectSpot,
  onOpenSpotMenu,
  onCreateCollection,
  onNavigate,
}) {
  const [savedSpots, setSavedSpots] = useState(mockSpots);
  const [activeFilter, setActiveFilter] = useState("all");

  const handleUnsave = (spot) => {
    setSavedSpots((prev) => prev.filter((s) => s.id !== spot.id));
  };

  const filteredSpots =
    activeFilter === "all"
      ? savedSpots
      : savedSpots.filter((s) => s.categories?.includes(activeFilter));

  return (
    <div className="w-full max-w-sm mx-auto bg-white min-h-full flex flex-col">
      {/* トップヘッダー */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={onMenuClick} className="text-slate-700 p-1 -ml-1">
            <Menu size={20} />
          </button>
          <span className="text-[16px] font-bold text-sky-500">TapTrip</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-sky-500">
            保存済み
          </span>
          <button onClick={onSearchClick} className="text-slate-500 p-1">
            <Search size={18} />
          </button>
          <button onClick={onProfileClick}>
            <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden" />
          </button>
        </div>
      </div>

      {/* タイトル + 件数 */}
      <div className="flex items-center justify-between px-4 pt-2 pb-3">
        <h1 className="text-[20px] font-bold text-slate-800">保存画面</h1>
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

      {/* リスト */}
      <div className="px-4 flex flex-col gap-3 pb-4">
        {filteredSpots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart size={28} className="text-slate-300 mb-2" />
            <p className="text-[13px] text-slate-400">
              保存したスポットはまだありません
            </p>
          </div>
        ) : (
          filteredSpots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              onSelect={onSelectSpot}
              onUnsave={handleUnsave}
              onOpenMenu={onOpenSpotMenu}
            />
          ))
        )}
      </div>

      {/* コレクション作成 */}
      <div className="px-4 pb-4">
        <button
          onClick={onCreateCollection}
          className="w-full flex flex-col items-center gap-2 py-6 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500"
        >
          <span className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center">
            <Plus size={18} />
          </span>
          <span className="text-[13px] font-medium">
            コレクションを作成する
          </span>
        </button>
      </div>

      {/* ボトムナビ */}
      <div className="mt-auto flex items-center justify-around border-t border-slate-100 py-2 sticky bottom-0 bg-white">
        <BottomNavItem
          icon={Home}
          label="ホーム"
          onClick={() => onNavigate?.("home")}
        />
        <BottomNavItem
          icon={Compass}
          label="探索"
          onClick={() => onNavigate?.("explore")}
        />
        <BottomNavItem
          icon={Bookmark}
          label="保存済み"
          active
          onClick={() => onNavigate?.("saved")}
        />
        <BottomNavItem
          icon={User}
          label="アカウント"
          onClick={() => onNavigate?.("account")}
        />
      </div>
    </div>
  );
}

export default Saved;