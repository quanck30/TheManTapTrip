import React from 'react';
import { toast } from "react-hot-toast";
import IconButton from '../buttons/IconButton'
import '../../Styles/card.css'

function CardDisplay({ spot, onCardClick, matchScore }) {
  if (!spot) return null;

  const title = spot.displayName?.text || "名称不明";
  const description = spot.editorialSummary?.text || "説明はありません。";
  const rating = spot.rating ? `⭐️ ${spot.rating}` : "評価なし";
  const primaryTag = spot.types?.[0] || "スポット";
  const imageUrl = spot.photos?.[0]?.flagUrl || "https://via.placeholder.com/150";

  const handleBookmark = (e) => {
    e.stopPropagation();
    toast.success(`${title}をお気に入りに保存しました！`, {
      className: 'toast-bookmark'
    });
  };

  return (
    <div className="card-display" onClick={onCardClick}>
      <div className="card-image-wrapper">
        <img src={imageUrl} className="card-image" alt={title} />
        {matchScore && <div className="match-badge">マッチ度: {matchScore}%</div>}
        <IconButton icon="❤️" variant="bookmark" onClick={handleBookmark} />
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-tags">
          <span className="card-tag">{rating}</span>
          <span className="card-tag">{primaryTag}</span>
        </div>
      </div>
    </div>
  );
}

export default CardDisplay;




'../../Styles/card.css'