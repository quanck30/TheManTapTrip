import React from "react";
import noImage from "../../assets/no_image.jpg";

const CardDisplay = ({ places = [] }) => {
    // 安全対策：配列であることを保証する
    const displayPlaces = Array.isArray(places) ? places : places?.data || [];

    if (displayPlaces.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                条件に合う場所が見つかりませんでした。
            </div>
        );
    }

    return (
        <div className="card-display-container">
            {displayPlaces.map((place, index) => (
                <div key={place.spotId || index} className="spot-card">
                    {/* 画像：APIキーを使ってGoogleから取得、なければ noImage */}
                    <img
                        src={
                            place.photoReference
                                ? `https://places.googleapis.com/v1/${place.photoReference}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&maxHeightPx=400&maxWidthPx=400`
                                : noImage
                        }
                        alt={place.sName}
                        className="spot-image"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = noImage;
                        }}
                    />

                    <div className="spot-info">
                        <h3>{place.sName}</h3>
                        <p className="rating">
                            評価:{" "}
                            {place.rating ? `⭐ ${place.rating}` : "評価なし"}
                        </p>

                        {/* 追加のお宝データ（駐車場・子供向け）をバッジ表示 */}
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                margin: "10px 0",
                                fontSize: "12px",
                                color: "#666",
                            }}>
                            {place.hasParking && <span>🅿️ 駐車場あり</span>}
                            {place.goodForChildren && <span>👶 子供向け</span>}
                            {place.menuForChildren && (
                                <span>🍽️ キッズメニューあり</span>
                            )}
                        </div>

                        <p className="summary">{place.summary}</p>
                        <p className="address">{place.address}</p>

                        {/* ルート案内ボタン */}
                        {place.directionUrl && (
                            <a
                                href={place.directionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="route-btn">
                                ルートを見る
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardDisplay;
