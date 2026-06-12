import React from 'react';
import TempButton from '../components/buttons/TempButton';
import '../Styles/detail.css';
import noImage from '../assets/no_image.jpg';
import backArrow from '../assets/back_root.jpg'; // 追加

function Detail({ spot, onBack }) {
  if (!spot) return null;

  const title = spot.displayName?.text || spot.name || "名称不明";
  const address = spot.formattedAddress || spot.address || "住所情報なし";
  const rating = spot.rating || "N/A";
  const priceLevel = spot.priceLevel || "未設定";
  const description = spot.editorialSummary?.text || "説明はありません。";
  const imageUrl = spot.photos?.[0]?.flagUrl || noImage;

  return (
    <div className="detail-container">
      <div className="detail-hero">
        <img 
          src={imageUrl} 
          className="detail-hero-img" 
          alt={title} 
          onError={(e) => e.target.src = noImage}
        />
        {/* 新しい戻るボタンの構成 */}
        <div className="back-button-wrapper">
          <button onClick={onBack} className="back-button-arrow">
            <img src={backArrow} alt="戻る" />
          </button>
        </div>
      </div>

      <div className="detail-body">
        <h2 className="detail-main-title">{title}</h2>
        
        <div className="detail-info-box">
          <div className="detail-meta">
            <div className="detail-meta-item"><span>評価⭐</span> {rating}</div>
            <div className="detail-meta-item"><span>価格💰</span> {priceLevel}</div>
          </div>
          <p className="detail-address">📍 {address}</p>
        </div>

        <p className="detail-description">{description}</p>

        <div className="map-section">
          <h3 className="map-section-title">周辺の地図</h3>
          <div className="map-placeholder">Google Maps エリア</div>
        </div>
      </div>

      <div className="detail-footer-bar">
        <TempButton text="この場所へ行くルートを検索" variant="accent" />
      </div>
    </div>
  );
}

export default Detail;