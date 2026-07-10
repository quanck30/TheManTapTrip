import React, { useMemo, useCallback } from "react";
import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { FaArrowLeft, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { Baby, Utensils, SquareParking } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  console.log(imageUrl);
  // primaryType と types をまとめ、null・重複を除去して表示用リストを作る（全件表示）
  const typeList = useMemo(() => {
    const merged = [spot?.primaryType, ...(spot?.types || [])].filter(Boolean);
    return [...new Set(merged)].splice(0, 10); // 最大10件まで表示
  }, [spot?.primaryType, spot?.types]);

  // 画像読み込み失敗時、毎レンダリングで関数を作り直さないようにする
  const handleImageError = useCallback((e) => {
    e.target.onerror = null;
    e.target.src = noImage;
  }, []);

  if (!spot) return null;

  const { sName, address = "住所情報なし", rating = "N/A", priceLevel, summary = "説明はありません。", directionUrl, goodForChildren, menuForChildren, hasParking } = spot;

  const title = sName || "名称不明";

  // true の設備だけをバッジ表示する
  const features = [
    goodForChildren && { icon: Baby, label: "子供向け" },
    menuForChildren && { icon: Utensils, label: "子供メニューあり" },
    hasParking && { icon: SquareParking, label: "駐車場あり" },
  ].filter(Boolean);

  return (
    <div className="detail-container">
      <div className="detail-hero">
        <img src={imageUrl} className="detail-hero-img" alt={title} crossOrigin="anonymous" referrerPolicy="no-referrer" onError={handleImageError} />
        <div className="hero-gradient" />
        <div className="back-button-wrapper">
          <button onClick={onBack} className="back-button-arrow" aria-label="戻る">
            <FaArrowLeft className="back-button-icon" />
          </button>
        </div>

        {/* タイトルと評価を画像に重ねて表示 */}
        <div className="hero-overlay-text">
          <h2 className="detail-main-title">{title}</h2>
          <div className="detail-meta">
            <span className="detail-meta-item">
              <FaStar className="star-icon" />
              {rating}
            </span>
            {priceLevel && (
              <>
                <Separator orientation="vertical" className="meta-divider" />
                <span className="detail-meta-item">{priceLevel}</span>
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

        {/* カテゴリー（ボタン風だが押せない・横スクロールで無限ループ） */}
        {typeList.length > 0 && (
          <>
            {/* 横スクロール（自動再生なし・末尾で停止） */}
            <div className="detail-type-scroll">
              {typeList.map((type, index) => {
                const isPrimary = index === 0;
                return (
                  <Button
                    key={type}
                    variant={isPrimary ? "default" : "secondary"}
                    size="sm"
                    tabIndex={-1}
                    aria-disabled="true"
                    className={isPrimary ? "detail-type-button detail-type-button--primary" : "detail-type-button"}
                  >
                    {type}
                  </Button>
                );
              })}
            </div>
          </>
        )}

        {/* 周辺の地図 */}
        <Card size="sm">
          <CardHeader>
            <CardTitle>周辺の地図</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="map-placeholder">
              <Map mapId={import.meta.env.VITE_GOOGLE_MAP_ID} defaultCenter={{ lat: spot.lat, lng: spot.long }} defaultZoom={16} style={{ width: "100%", height: "100%" }}>
                <AdvancedMarker position={{ lat: spot.lat, lng: spot.long }} />
              </Map>
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
