import React from 'react';
import IconButton from '../components/buttons/IconButton';
import TempButton from '../components/buttons/TempButton';
import '../Styles/detail.css';

function Detail({ spot, onBack }) {
  if (!spot) return null;

  const title = spot.displayName?.text || "名称不明";
  const description = spot.editorialSummary?.text || "説明はありません。";
  const imageUrl = spot.photos && spot.photos[0]?.flagUrl ? spot.photos[0].flagUrl : "https://via.placeholder.com/300";

  return (
    <div className="detail-container">
      <div className="detail-hero">
        <img src={imageUrl} className="detail-hero-img" alt={title} />
        <div className="detail-hero-overlay"></div>
        <IconButton icon="←" variant="back" onClick={onBack} />
      </div>

      <div className="detail-body">
        <h2 className="detail-main-title">{title}</h2>
        <p className="detail-description">{description}</p>

        <div className="map-section">
          <h3 className="map-section-title">周辺の地図</h3>
          <div className="map-placeholder">
            🗺️ Google Maps エリア (API結合時に自動描画)
          </div>
        </div>
      </div>

      <div className="detail-footer-bar">
        <TempButton text="この場所へ行くルートを検索" variant="accent" />
      </div>
    </div>
  );
}

export default Detail;