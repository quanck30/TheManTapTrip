import React, { useEffect, useMemo, useCallback, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { FaArrowLeft, FaHeart, FaMapMarkerAlt, FaRegHeart, FaStar } from "react-icons/fa";
import { Baby, Utensils, SquareParking } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import noImage from "../assets/no_image.jpg";
import IconButton from "../components/buttons/IconButton";
import { useAuth } from "../hooks/useAuth";
import { useSpot } from "../hooks/useSpot";

function Detail({ spot, initialSaved = false, onBack }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { saveSpot, getSpots } = useSpot();
  const [isSaved, setIsSaved] = useState(initialSaved);

  // 詳細画面を開いたときも、DBの保存状態を最新情報で確認する
  useEffect(() => {
    if (!spot || !isAuthenticated) return undefined;

    let cancelled = false;

    getSpots()
      .then(({ spots = [] }) => {
        if (!cancelled) {
          setIsSaved(spots.some((savedSpot) => String(savedSpot.spotId) === String(spot.spotId)));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [getSpots, isAuthenticated, spot]);
  // バックエンドから返された画像URLをそのまま使用する
  const imageUrl = useMemo(() => {
    return spot?.photoUrl || noImage;
  }, [spot?.photoUrl]);

  // 画像読み込み失敗時、毎レンダリングで関数を作り直さないようにする
  const handleImageError = useCallback((e) => {
    e.target.onerror = null;
    e.target.src = noImage;
  }, []);

  if (!spot) return null;

  const {
    sName,
    address = "住所情報なし",
    rating: rawRating,
    priceLevel,
    price,
    summary = "説明はありません。",
    directionUrl,
    goodForChildren,
    menuForChildren,
    hasParking,
    matchScore,
    matchReasons: rawMatchReasons,
    matchWarnings: rawMatchWarnings,
  } = spot;

  const title = sName || "名称不明";
  const rating = rawRating ?? "評価なし";
  const displayPriceLevel = priceLevel ?? price;
  const latitude = Number(spot.lat);
  const longitude = Number(spot.long);
  const matchReasons = Array.isArray(rawMatchReasons) ? rawMatchReasons : [];
  const matchWarnings = Array.isArray(rawMatchWarnings) ? rawMatchWarnings : [];
  // マッチ情報があるスポットだけ、推薦理由のセクションを表示する
  const hasRecommendationInfo = matchScore > 0 || matchReasons.length > 0 || matchWarnings.length > 0;

  // true の設備だけをバッジ表示する
  const features = [
    goodForChildren && { icon: Baby, label: "子供向け" },
    menuForChildren && { icon: Utensils, label: "子供メニューあり" },
    hasParking && { icon: SquareParking, label: "駐車場あり" },
  ].filter(Boolean);

  const handleBookmark = async (event) => {
    event.stopPropagation();

    if (!isAuthenticated) {
      // 未ログインの場合は保存せず、ログイン画面へ案内する
      navigate("/login", { state: { from: { pathname: `/detail/${spot.spotId}` } } });
      return;
    }

    if (isSaved) return;

    try {
      const result = await saveSpot(spot);
      // DBへの保存が成功したときだけ、ハートを塗りつぶす
      setIsSaved(true);
      toast.success(result.message);
    } catch {}
  };

  return (
    <div className="detail-container">
      <div className="detail-hero">
        <img src={imageUrl} className="detail-hero-img" alt={title} referrerPolicy="no-referrer" onError={handleImageError} />
        <div className="hero-gradient" />
        <div className="back-button-wrapper">
          <button onClick={onBack} className="back-button-arrow" aria-label="戻る">
            <FaArrowLeft className="back-button-icon" />
          </button>
        </div>
        {/* DBの保存状態に応じて、枠線または塗りつぶしのハートを表示する */}
        <IconButton icon={isSaved ? <FaHeart color="#e53e3e" /> : <FaRegHeart color="#94a3b8" />} variant="bookmark" onClick={handleBookmark} />

        {/* タイトルと評価を画像に重ねて表示 */}
        <div className="hero-overlay-text">
          <h2 className="detail-main-title">{title}</h2>
          <div className="detail-meta">
            <span className="detail-meta-item">
              <FaStar className="star-icon" />
              {rating}
            </span>
            {displayPriceLevel && (
              <>
                <Separator orientation="vertical" className="meta-divider" />
                <span className="detail-meta-item">{displayPriceLevel}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="detail-body">
        <p className="detail-address">
          <FaMapMarkerAlt className="address-icon" />
          {address}
        </p>

        {/* 設備バッジ */}
        {features.length > 0 && (
          <div className="detail-features">
            {features.map(({ icon: Icon, label }) => (
              <Badge key={label} variant="secondary" className="detail-feature-badge">
                <Icon />
                {label}
              </Badge>
            ))}
          </div>
        )}

        {/* 一覧より詳しく、マッチ度の根拠と確認すべき情報を表示する */}
        {hasRecommendationInfo && (
          <section className="detail-recommendation" aria-labelledby="recommendation-reasons-title">
            <div className="detail-recommendation-header">
              <h3 id="recommendation-reasons-title">この場所がおすすめの理由</h3>
              {matchScore > 0 && <span className="detail-match-score">相性 {matchScore}%</span>}
            </div>
            {matchReasons.length > 0 ? (
              <ul className="detail-reason-list">
                {matchReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p className="detail-recommendation-empty">選択した条件に合う候補です。</p>
            )}
            {matchWarnings.length > 0 && (
              <div className="detail-recommendation-warnings">
                <p>確認しておきたいこと</p>
                <ul className="detail-warning-list">
                  {matchWarnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* APIから取得したスポットの説明文を詳細画面にも表示する */}
        <p className="detail-description">{summary}</p>

        {/* 周辺の地図 */}
        <Card size="sm">
          <CardHeader>
            <CardTitle>周辺の地図</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="map-placeholder">
              {Number.isFinite(latitude) && Number.isFinite(longitude) ? (
                <Map mapId={import.meta.env.VITE_GOOGLE_MAP_ID} defaultCenter={{ lat: latitude, lng: longitude }} defaultZoom={16} style={{ width: "100%", height: "100%" }}>
                  <AdvancedMarker position={{ lat: latitude, lng: longitude }} />
                </Map>
              ) : (
                <p>地図情報がありません。</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="detail-footer-bar">
        {directionUrl ? (
          <Button asChild size="lg" className="footer-button-full footer-button-route">
            <a href={directionUrl} target="_blank" rel="noopener noreferrer">
              この場所へ行くルートを検索
            </a>
          </Button>
        ) : (
          <Button disabled variant="secondary" size="lg" className="footer-button-full">
            ルート情報なし
          </Button>
        )}
      </div>
    </div>
  );
}

export default React.memo(Detail);
