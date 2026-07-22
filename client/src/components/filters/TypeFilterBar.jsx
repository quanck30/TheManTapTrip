/**
 * おすすめ一覧と保存済み一覧で共通利用するタイプフィルター。
 * 表示だけを担当し、選択時の処理は各ルート側で行う。
 */
function TypeFilterBar({ types = [], selectedType = null, onChange }) {
  if (types.length === 0) return null;

  return (
    <div className="type-filter-bar">
      <button
        type="button"
        className={`type-filter-chip ${!selectedType ? "type-filter-chip--active" : ""}`}
        onClick={() => onChange(null)}
        disabled={!selectedType}
      >
        すべて
      </button>

      {types.map((type) => (
        <button
          key={type}
          type="button"
          className={`type-filter-chip ${selectedType === type ? "type-filter-chip--active" : ""}`}
          onClick={() => onChange(type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

export default TypeFilterBar;
