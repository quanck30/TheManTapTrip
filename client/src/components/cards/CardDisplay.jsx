/**
 * @brief
 * @Author
 * @Date 26/05/26
 * @Update
 */

import React from 'react';
import IconButton from '../buttons/IconButton';

function CardDisplay({ spot, onCardClick }) {
  if (!spot) return null;

  const title = spot.displayName?.text || "名称不明";
  const description = spot.editorialSummary?.text || "説明はありません。";
  const rating = spot.rating ? `⭐️ ${spot.rating}` : "評価なし";
  const primaryTag = spot.types && spot.types[0] ? spot.types[0] : "スポット";
  const imageUrl = spot.photos && spot.photos[0]?.flagUrl ? spot.photos[0].flagUrl : "https://via.placeholder.com/150";

  return (
    <div className="spot-card" onClick={onCardClick} style={{ cursor: 'pointer', marginBottom: '16px' }}>
      <div className="spot-image-wrapper">
        <img src={imageUrl} className="spot-image" alt={title} />
        <IconButton icon="❤️" variant="bookmark" onClick={(e) => {
          e.stopPropagation();
          alert(`${title}をお気に入りに保存しました`);
        }} />
      </div>
      <div className="spot-content">
        <h3 className="spot-title" style={{ color: '#2c3e50' }}>{title}</h3>
        <p className="spot-description" style={{ color: '#7f8c8d' }}>{description}</p>
        <div className="spot-tags">
          <span className="tag">{rating}</span>
          <span className="tag">{primaryTag}</span>
        </div>
      </div>
    </div>
  );
}

export default CardDisplay;