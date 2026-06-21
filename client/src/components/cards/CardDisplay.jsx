import React from "react";
import noImage from "../../assets/no_image.jpg";

const CardDisplay = ({ places = [] }) => {
    const displayPlaces = Array.isArray(places)
        ? places
        : places?.data || places?.places || [];

    // 検索結果が空だった場合の表示
    if (!displayPlaces || displayPlaces.length === 0) {
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
                    {/* 画像がない場合は noImage を表示する */}
                    <img
                        src={
                            place.photoReference
                                ? `https://places.googleapis.com/v1/${place.photoReference}/media?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&maxHeightPx=400&maxWidthPx=400`
                                : noImage
                        }
                        alt={place.sName}
                        className="spot-image"
                    />
                    <div className="spot-info">
                        <h3>{place.sName}</h3>
                        <p className="rating">
                            評価:{" "}
                            {place.rating ? `⭐ ${place.rating}` : "評価なし"}
                        </p>
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
