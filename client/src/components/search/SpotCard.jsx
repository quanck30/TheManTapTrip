/**
 * @brief 検索結果の情報を表示する
 * @Author J.Naka
 * @Date 26/06/22
 * @Update 26/06/22
 */

import React from "react";
import noImage from "../../assets/no_image.jpg";
import "../../Styles/card.css";

const SpotCard = ({ place }) => {
    const imageUrl = place.photoReference
        ? `https://places.googleapis.com/v1/${place.photoReference}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&maxHeightPx=400&maxWidthPx=400`
        : noImage;

    return (
        <div className="spot-card">
            <img src={imageUrl} alt={place.sName} className="spot-image" />
            <div className="spot-info">
                <h3>{place.sName}</h3>
                <p className="rating">
                    評価: {place.rating ? `⭐ ${place.rating}` : "評価なし"}
                </p>
                <p className="summary">{place.summary}</p>
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
    );
};

export default SpotCard;
