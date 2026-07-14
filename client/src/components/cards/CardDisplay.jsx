import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaStar } from "react-icons/fa";
import noImage from "../../assets/no_image.jpg";
import IconButton from "../buttons/IconButton";
import { useAuth } from "../../hooks/useAuth";

const CardDisplay = ({ places = [] }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); // ログインしているか判定

    // 安全対策
    const displayPlaces = Array.isArray(places) ? places : places?.data || [];

    if (displayPlaces.length === 0) {
        return (
            <div className="no-places">
                条件に合う場所が見つかりませんでした。
            </div>
        );
    }

    // お気に入りボタンを押した時の処理
    const handleBookmark = (e, title) => {
        e.stopPropagation(); // 親のカードクリックイベント（詳細への遷移）が発火するのを防ぐ

        toast.success(`${title}をお気に入りに保存しました！`);
    };

    return (
        <div className="card-display-container">
            {displayPlaces.map((place, index) => {
                // 画像のコードに合わせつつ、実際のAPIレスポンスのキーにマッピング
                const title = place.sName || "名称不明";
                const description = place.summary || "説明はありません。";
                const rating = place.rating ? (
                    <div className="rating">
                        <FaStar color="#f59e0b"/>
                        {place.rating}
                    </div>
                ) : (
                    "評価なし"
                );
                const primaryTag =
                    place.types?.[0] || place.primaryType || "スポット";
                const matchScore = place.matchScore; // マッチ度があれば取得

                // 画像URLの生成（前回のVITE_GOOGLE_PLACES_API_KEYを使用！）
                const imageUrl = place.photoReference
                    ? `https://places.googleapis.com/v1/${place.photoReference}/media?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&maxHeightPx=400&maxWidthPx=400`
                    : noImage;

                // カード全体をクリックした時の処理（詳細画面へ遷移）
                // spot はコンテキストから取得するため、戻り先のみ state で渡す
                const onCardClick = () => {
                    navigate(`/detail/${place.spotId}`, {
                        state: { from: "/recommend" },
                    });
                };

                return (
                    <div
                        key={place.spotId || index}
                        className="card-display"
                        onClick={onCardClick}>
                        <div className="card-image-wrapper">
                            <img
                                src={imageUrl}
                                className="card-image"
                                alt={title}
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = noImage;
                                }}
                            />
                            {/* マッチ度バッジ */}
                            {matchScore && (
                                <div className="match-badge">
                                    マッチ度: {matchScore}%
                                </div>
                            )}

                            {/* ログイン中のみお気に入り（ハート）ボタンを表示 */}
                            {isAuthenticated && (
                                <IconButton
                                    icon={<FaHeart color="#e53e3e" />}
                                    variant="bookmark"
                                    onClick={(e) => handleBookmark(e, title)}
                                />
                            )}
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
            })}
        </div>
    );
};

export default CardDisplay;
