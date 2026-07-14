import React, { useMemo, useCallback } from "react";
import { FaArrowLeft, FaStar, FaYenSign, FaMapMarkerAlt } from "react-icons/fa";
import TempButton from "../components/buttons/TempButton";
import noImage from "../assets/no_image.jpg";

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

function buildPhotoUrl(photoReference) {
    return `https://places.googleapis.com/v1/${photoReference}/media?key=${GOOGLE_PLACES_API_KEY}&maxHeightPx=400&maxWidthPx=400`;
}

function Detail({ spot, onBack }) {
    // 画像URLは spot.photoReference が変わったときだけ再計算する
    const imageUrl = useMemo(() => {
        if (!spot?.photoReference) return noImage;
        return buildPhotoUrl(spot.photoReference);
    }, [spot?.photoReference]);

    // 画像読み込み失敗時、毎レンダリングで関数を作り直さないようにする
    const handleImageError = useCallback((e) => {
        e.target.onerror = null;
        e.target.src = noImage;
    }, []);

    if (!spot) return null;

    const {
        sName,
        name,
        address = "住所情報なし",
        rating = "N/A",
        priceLevel = "未設定",
        summary = "説明はありません。",
        directionUrl,
    } = spot;

    const title = sName || name || "名称不明";

    return (
        <div className="detail-container">
            <div className="detail-hero">
                <img
                    src={imageUrl}
                    className="detail-hero-img"
                    alt={title}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                />
                <div className="hero-gradient" />
                <div className="back-button-wrapper">
                    <button onClick={onBack} className="back-button-arrow">
                        <FaArrowLeft className="back-button-icon" aria-label="戻る" />
                    </button>
                </div>

                {/* タイトルと評価を画像に重ねて表示 */}
                <div className="hero-overlay-text">
                    <h2 className="detail-main-title">{title}</h2>
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
                </div>
            </div>

            <div className="detail-body">
                <p className="detail-address">
                    <FaMapMarkerAlt className="address-icon" />
                    {address}
                </p>

                <p className="detail-description">{summary}</p>

                <div className="map-section">
                    <h3 className="map-section-title">周辺の地図</h3>
                    <div className="map-placeholder">Google Maps エリア</div>
                </div>
            </div>

            <div className="detail-footer-bar">
                {directionUrl ? (
                    <a
                        href={directionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        <TempButton
                            text="この場所へ行くルートを検索"
                            variant="accent"
                            className="footer-button-full"
                        />
                    </a>
                ) : (
                    <TempButton text="ルート情報なし" variant="secondary" disabled />
                )}
            </div>
        </div>
    );
}

export default React.memo(Detail);