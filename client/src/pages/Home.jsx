import React from "react";
import { FaArrowLeft, FaStar, FaYenSign, FaMapMarkerAlt } from "react-icons/fa";
import TempButton from "../components/buttons/TempButton";
import "../styles/detail.css";
import noImage from "../assets/no_image.jpg";

function Detail({ spot, onBack }) {
    if (!spot) return null;

    const title = spot.sName || spot.name || "名称不明";
    const address = spot.address || "住所情報なし";
    const rating = spot.rating || "N/A";
    const priceLevel = spot.priceLevel || "未設定";
    const description = spot.summary || "説明はありません。";
    const imageUrl = spot.photoReference
        ? `https://places.googleapis.com/v1/${spot.photoReference}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&maxHeightPx=400&maxWidthPx=400`
        : noImage;

    return (
        <div className="detail-container">
            <div className="detail-hero">
                <img
                    src={imageUrl}
                    className="detail-hero-img"
                    alt={title}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = noImage;
                    }}
                />
                {/* 新しい戻るボタンの構成 */}
                <div className="back-button-wrapper">
                    <button onClick={onBack} className="back-button-arrow">
                        <FaArrowLeft className="back-button-icon" aria-label="戻る" />
                    </button>
                </div>
            </div>

            {/* 画像とタイトルの間に重ねる情報カード */}
            <div className="detail-info-box detail-info-box-overlay">
                <div className="detail-meta">
                    <div className="detail-meta-item">
                        <FaStar className="star-icon" />
                        {rating}
                    </div>
                    <div className="meta-divider" />
                    <div className="detail-meta-item">
                        <FaYenSign className="price-icon" />
                        価格{priceLevel}
                    </div>
                </div>
                <p className="detail-address">
                    <FaMapMarkerAlt className="address-icon" />
                    {address}
                </p>
            </div>

            <div className="detail-body">
                <h2 className="detail-main-title">{title}</h2>

                <p className="detail-description">{description}</p>

                <div className="map-section">
                    <h3 className="map-section-title">周辺の地図</h3>
                    <div className="map-placeholder">Google Maps エリア</div>
                </div>
            </div>

            <div className="detail-footer-bar">
                {spot.directionUrl ? (
                    <a
                        href={spot.directionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link">
                        <TempButton
                            text="この場所へ行くルートを検索"
                            variant="accent"
                            className="footer-button-full"
                        />
                    </a>
                ) : (
                    <TempButton
                        text="ルート情報なし"
                        variant="secondary"
                        disabled
                    />
                )}
            </div>
        </div>
    );
}

export default Detail;