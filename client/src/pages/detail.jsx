import React from 'react';
import IconButton from '../components/buttons/IconButton';
import TempButton from '../components/buttons/TempButton';

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
        <h2 className="detail-main-title" style={{ color: '#2c3e50' }}>{title}</h2>
        <p className="detail-description" style={{ color: '#555555' }}>{description}</p>

        {/* Google Maps APIプレースホルダー（構文エラーを完全修正） */}
        <div className="map-section" style={{ margin: '20px 0' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#2c3e50' }}>周辺の地図</h3>
          <div 
            style={{ 
              width: '100%', 
              height: '180px', 
              backgroundColor: '#e2e8f0', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7f8c8d',
              fontSize: '13px',
              border: '1px dashed #cbd5e1'
            }}
          >
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