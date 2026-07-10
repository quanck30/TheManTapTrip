/**
 * @file ListItem.js
 * @brief スポット一覧で表示される個別のアイテムコンポーネント
 * @author [谷之木誠多]
 * @date 2026/06/05
 */

import React from 'react';
import { FaTag, FaChevronRight } from 'react-icons/fa';

/**
 * リストアイテムを表示するコンポーネント
 * @param {Object} props - コンポーネントのプロパティ
 * @param {Object} props.spot - 表示対象のスポットデータオブジェクト
 * @param {Function} props.onClick - アイテムをクリックした際のコールバック関数
 */
function ListItem({ spot, onClick }) {
  if (!spot) return null;

  // スポットデータの各プロパティを安全に取得（フォールバック付き）
  const title = spot.displayName?.text || "名称不明のスポット";
  const category = spot.types && spot.types[0] ? spot.types[0] : "観光";
  const imageUrl = spot.photos && spot.photos[0]?.flagUrl ? spot.photos[0].flagUrl : "https://via.placeholder.com/60";

  return (
    <div className="list-item-container" onClick={onClick}>
      {/* スポット画像 */}
      <img src={imageUrl} alt={title} className="list-item-image" />
      
      {/* テキストコンテンツ（タイトルとカテゴリー） */}
      <div className="list-item-content">
        <h4 className="list-item-title">{title}</h4>
        <span className="list-item-category">
          <FaTag color="#319795" style={{ verticalAlign: "middle", marginRight: 4 }} />
          {category}
        </span>
      </div>

      {/* 詳細への遷移を示すインジケーター */}
      <span className="list-item-arrow"><FaChevronRight color="#cbd5e0" /></span>
    </div>
  );
}

export default ListItem;