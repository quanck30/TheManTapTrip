/**
 * @brief
 * @Author
 * @Date 26/05/26
 * @Update
 */

/**
 * スポット情報をカード形式で表示するコンポーネント
 * @param {Object} spot - 表示対象のスポットデータ
 * @param {Function} onCardClick - カード全体がクリックされた時の遷移処理
 */
import React from "react";
// import { Toaster, toast } from "react-hot-toast";
import IconButton from "../buttons/IconButton";
import "../../Styles/card.css";

function CardDisplay({ spot, onCardClick }) {
    if (!spot) return null;

    const title = spot.displayName?.text || "名称不明";
    const description = spot.editorialSummary?.text || "説明はありません。";
    const rating = spot.rating ? `⭐️ ${spot.rating}` : "評価なし";
    const primaryTag = spot.types && spot.types[0] ? spot.types[0] : "スポット";
    const imageUrl =
        spot.photos && spot.photos[0]?.flagUrl
            ? spot.photos[0].flagUrl
            : "https://via.placeholder.com/150";

    const handleBookmark = (e) => {
        e.stopPropagation();
        toast.success(`${title}をお気に入りに保存しました！`, {
            style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
    };

    return (
        <div className="card-display" onClick={onCardClick}>
            <div className="card-image-wrapper">
                <img src={imageUrl} className="card-image" alt={title} />
                <IconButton
                    icon="❤️"
                    variant="bookmark"
                    onClick={handleBookmark}
                />
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
