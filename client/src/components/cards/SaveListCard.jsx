/**
 * @file SaveListCard.jsx
 * @brief 保存済みスポット一覧で表示される個別カードコンポーネント
 */

import React from "react";
import { Trash2, Star, CheckCircle2 } from "lucide-react";
import { FaPersonWalkingLuggage } from "react-icons/fa6";
import noImage from "../../assets/no_image.jpg";

/**
 * 保存済みスポットカード
 * @param {Object} props
 * @param {Object} props.spot - 表示対象のスポットデータ
 * @param {Function} props.onClick - カードタップ時（詳細へ遷移）
 * @param {Function} [props.onUnsave] - ゴミ箱タップ時（保存解除）
 * @param {Function} [props.onSetVisited] - 訪問済みボタンタップ時
 */
function SaveListCard({ spot, onClick, onUnsave, onSetVisited }) {
  if (!spot) return null;

  const title = spot.sName || "名称不明のスポット";
  const imageUrl = spot.photoUrl ? spot.photoUrl : noImage;
  const primaryType = spot.primaryType;
  const rating = spot.rating ? Number(spot.rating) : null;
  const price = spot.price;
  const isVisited = spot.isVisited === 1 || spot.isVisited === true;

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = noImage;
  };

  return (
    <div
      onClick={onClick}
      className="flex items-stretch gap-3 p-3 rounded-2xl border border-slate-100 bg-white cursor-pointer active:bg-slate-50"
    >
      <div className="relative shrink-0 self-start">
        <img
          src={imageUrl}
          alt={title}
          onError={handleImageError}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          className="w-16 h-16 rounded-xl object-cover bg-slate-100"
        />
        {isVisited && (
          <span
            className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white flex items-center justify-center"
            aria-label="訪問済み"
            title="訪問済み"
          >
            <CheckCircle2 size={13} className="fill-emerald-500 text-white" />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
        <h4 className="text-[14px] font-semibold text-slate-800 truncate">{title}</h4>

        <div className="flex items-center gap-2 text-[12px] flex-wrap">
          {rating && (
            <span className="flex items-center gap-0.5 text-amber-500 font-medium">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </span>
          )}
          {price && <span className="text-slate-400">{price}</span>}
          {spot.distance && <span className="text-slate-400">{spot.distance}</span>}
        </div>

        {primaryType && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{primaryType}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-between shrink-0 -my-1 -mr-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSetVisited?.(spot.id);
          }}
          className="text-slate-400 p-1.5 rounded-full active:bg-slate-100 transition-colors"
          aria-label="訪問済みにする"
        >
          <FaPersonWalkingLuggage size={15} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnsave?.(spot);
          }}
          className="text-slate-400 p-1.5 rounded-full active:bg-slate-100 active:scale-90 transition-all"
          aria-label="削除"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default SaveListCard;
