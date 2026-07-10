/**
 * @file SaveListCard.jsx
 * @brief 保存済みスポット一覧で表示される個別カードコンポーネント
 */

import React from "react";
import { MoreVertical, Heart } from "lucide-react";

const noImage = "https://via.placeholder.com/72";

/**
 * 保存済みスポットカード
 * @param {Object} props
 * @param {Object} props.spot - 表示対象のスポットデータ
 * @param {Function} props.onClick - カードタップ時（詳細へ遷移）
 * @param {Function} [props.onUnsave] - ハートタップ時（保存解除）
 * @param {Function} [props.onOpenMenu] - "⋮"タップ時
 */
function SaveListCard({ spot, onClick, onUnsave, onOpenMenu }) {
  if (!spot) return null;

  const title = spot.displayName?.text || "名称不明のスポット";
  const imageUrl = spot.photos?.[0]?.flagUrl || noImage;
  const tags = spot.tags || [];

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = noImage;
  };

  return (
    <div
      onClick={onClick}
      className="relative flex gap-3 p-3 rounded-2xl border border-slate-100 bg-white cursor-pointer active:bg-slate-50"
    >
      <img
        src={imageUrl}
        alt={title}
        onError={handleImageError}
        className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0"
      />

      <div className="flex-1 min-w-0 flex flex-col gap-1.5 pr-6">
        <h4 className="text-[14px] font-semibold text-slate-800 truncate">
          {title}
        </h4>

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

export default SaveListCard;