import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import noImage from "../../assets/no_image.jpg";
import IconButton from "../buttons/IconButton";
import { useAuth } from "../../hooks/useAuth";
import { useSpot } from "../../hooks/useSpot";

const CardDisplay = ({ places = [] }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // ログインしているか判定
  const { saveSpot, getSpots } = useSpot();
  const [savedSpotIds, setSavedSpotIds] = useState(() => new Set());

  // ログイン後にDBのお気に入り一覧を取得し、各カードの保存状態を判定する
  useEffect(() => {
    if (!isAuthenticated) {
      // ログアウト中は、前のユーザーの保存状態を画面に残さない
      setSavedSpotIds(new Set());
      return undefined;
    }

    let cancelled = false;

    getSpots()
      .then(({ spots = [] }) => {
        if (!cancelled) {
          setSavedSpotIds(new Set(spots.map((spot) => String(spot.spotId))));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [getSpots, isAuthenticated]);

  // 安全対策
  const displayPlaces = Array.isArray(places) ? places : places?.data || [];

  if (displayPlaces.length === 0) {
    return <div className="no-places">条件に合う場所が見つかりませんでした。</div>;
  }

  // お気に入りボタンを押した時の処理
  const handleBookmark = async (e, place) => {
    e.stopPropagation(); // 親のカードクリックイベント（詳細への遷移）が発火するのを防ぐ

    if (!isAuthenticated) {
      // 未ログインの場合は、保存せずにログイン画面へ案内する
      navigate("/login", { state: { from: { pathname: "/recommend" } } });
      return;
    }

    if (savedSpotIds.has(String(place.spotId))) return;

    try {
      const result = await saveSpot(place);
      // 保存成功後すぐにアイコンを塗りつぶし、再度の保存も防ぐ
      setSavedSpotIds((prev) => new Set(prev).add(String(place.spotId)));
      toast.success(result.message);
    } catch {}
  };

  return (
    <div className="card-display-container">
      {displayPlaces.map((place, index) => {
        // 画像のコードに合わせつつ、実際のAPIレスポンスのキーにマッピング
        const title = place.sName || "名称不明";
        const description = place.summary || "説明はありません。";
        const rating = place.rating ? (
          <div className="rating">
            <FaStar color="#f59e0b" />
            {place.rating}
          </div>
        ) : (
          "評価なし"
        );
        const primaryTag = place.types?.[0] || place.primaryType || "スポット";
        const matchScore = place.matchScore; // マッチ度があれば取得
        // APIの説明データがない古いレスポンスでも安全に表示できるようにする
        const matchReasons = Array.isArray(place.matchReasons) ? place.matchReasons : [];
        const matchWarnings = Array.isArray(place.matchWarnings) ? place.matchWarnings : [];
        // 画像URLの生成
        const imageUrl = place.photoUrl ? place.photoUrl : noImage;

        // カード全体をクリックした時の処理（詳細画面へ遷移）
        // spot はコンテキストから取得するため、戻り先のみ state で渡す
        const onCardClick = () => {
          navigate(`/detail/${place.spotId}`, {
            state: { from: "/recommend", isSaved: savedSpotIds.has(String(place.spotId)) },
          });
        };
        return (
          <div key={place.spotId || index} className="card-display" onClick={onCardClick}>
            <div className="card-image-wrapper">
              <img
                src={imageUrl}
                className="card-image"
                alt={title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = noImage;
                }}
              />
              {/* マッチ度バッジ */}
              {matchScore && <div className="match-badge">マッチ度: {matchScore}%</div>}

              {/* DBに保存済みなら塗りつぶし、未保存なら枠線のハートを表示する */}
              <IconButton
                icon={savedSpotIds.has(String(place.spotId)) ? <FaHeart color="#e53e3e" /> : <FaRegHeart color="#94a3b8" />}
                variant="bookmark"
                onClick={(e) => handleBookmark(e, place)}
              />
            </div>

            <div className="card-content">
              <h3 className="card-title">{title}</h3>
              <p className="card-description">{description}</p>
              <div className="card-tags">
                <span className="card-tag">{rating}</span>
                <span className="card-tag">{primaryTag}</span>
              </div>
              {/* 一覧では理由を最大2件に絞り、カードが長くなりすぎないようにする */}
              {matchReasons.length > 0 && (
                <div className="card-reasons" aria-label="おすすめ理由">
                  {matchReasons.slice(0, 2).map((reason) => (
                    <span key={reason} className="card-reason">
                      ✓ {reason}
                    </span>
                  ))}
                </div>
              )}
              {matchWarnings.length > 0 && <p className="card-warning">※ {matchWarnings[0]}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardDisplay;
