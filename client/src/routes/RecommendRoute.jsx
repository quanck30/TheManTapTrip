import { useMemo, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import CardDisplay from "../components/cards/CardDisplay";
import TypeFilterBar from "../components/filters/TypeFilterBar";
import { usePlaces } from "../hooks/usePlaces";
import { useNavigate } from "react-router-dom";

const RecommendRoute = () => {
  const { places } = usePlaces();
  const navigate = useNavigate();

  // 選択中のタイプ（null = すべて表示）と絞り込み中のローディング状態
  const [selectedType, setSelectedType] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // 結果に含まれる全タイプを重複なしで抽出する
  const allTypes = useMemo(() => {
    const set = new Set();
    (places || []).forEach((p) => {
      [p?.primaryType, ...(p?.types || [])].filter(Boolean).forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [places]);

  // 選択中のタイプで結果を絞り込む（未選択なら全件）
  const filteredPlaces = useMemo(() => {
    if (!selectedType) return places || [];
    return (places || []).filter((p) => p?.primaryType === selectedType || (p?.types || []).includes(selectedType));
  }, [places, selectedType]);

  // タイプをクリックした時：同じものなら解除、違えば絞り込み。少し待ってローディング演出を見せる
  const handleSelectType = (type) => {
    const next = selectedType === type ? null : type;
    setIsFiltering(true);
    setTimeout(() => {
      setSelectedType(next);
      setIsFiltering(false);
    }, 400);
  };

  return (
    <>
      <div className="recommend-title">
        <button
          onClick={() => {
            navigate("/home");
          }}
        >
          <FaChevronLeft color="#2d3748" />
        </button>
        <h2> おすすめスポット</h2>
        <button></button>
      </div>

      <div className="recommend">
        {/* タイプ絞り込みバー */}
        <TypeFilterBar types={allTypes} selectedType={selectedType} onChange={handleSelectType} />

        {/* 絞り込み中はローディングアニメーションを表示 */}
        {isFiltering ? (
          <div className="filter-loading">
            <Loader2 className="filter-loading-spinner" />
            <span>絞り込み中...</span>
          </div>
        ) : (
          <CardDisplay places={filteredPlaces} />
        )}
      </div>
    </>
  );
};

export default RecommendRoute;
