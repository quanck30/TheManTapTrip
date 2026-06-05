import { useGoogleAuth } from "../components/hooks/useGoogleAuth.js";
import { useGeolocation } from "../components/hooks/useGeolocation";

export const TestPage = () => {
    // 1. Googleログイン用のリモコンと状態を取得
    // （名前が被らないように、isLoadingとerrorの名前を変更して受け取っています）
    const {
        login,
        isLoading: isGoogleLoading,
        error: googleError,
    } = useGoogleAuth();

    // 2. 現在地取得用のリモコンと状態を取得
    const {
        location,
        isLoading: isGeoLoading,
        error: geoError,
        getLocation,
    } = useGeolocation();

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>動作テスト用ページ</h2>

            {/* =========================================
          現在地取得のテストエリア
      ========================================= */}
            <section
                style={{
                    marginBottom: "40px",
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                }}>
                <h3>📍 現在地取得テスト</h3>

                <button
                    onClick={getLocation}
                    disabled={isGeoLoading}
                    style={{ padding: "10px 20px", cursor: "pointer" }}>
                    {isGeoLoading ? "取得中..." : "現在地を取得する"}
                </button>

                {/* エラーがあれば赤文字で表示 */}
                {geoError && (
                    <p style={{ color: "red", fontWeight: "bold" }}>
                        {geoError}
                    </p>
                )}

                {/* 取得に成功して location にデータが入っていれば表示 */}
                {location && (
                    <div
                        style={{
                            marginTop: "15px",
                            padding: "10px",
                            backgroundColor: "#eef",
                        }}>
                        <p>
                            <strong>緯度 (Latitude):</strong> {location.lat}
                        </p>
                        <p>
                            <strong>経度 (Longitude):</strong> {location.lng}
                        </p>
                    </div>
                )}
            </section>

            {/* =========================================
          Googleログインのテストエリア
      ========================================= */}
            <section
                style={{
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                }}>
                <h3>🔑 Googleログインテスト</h3>
                <p style={{ fontSize: "14px", color: "#666" }}>
                    ※F12キーを押して「Console」タブを開いてから実行してください
                </p>

                <button
                    onClick={() => login()}
                    disabled={isGoogleLoading}
                    style={{
                        padding: "10px 20px",
                        cursor: "pointer",
                        backgroundColor: "#4285F4",
                        color: "white",
                        border: "none",
                    }}>
                    {isGoogleLoading ? "通信中..." : "Googleでログイン"}
                </button>

                {/* エラーがあれば赤文字で表示 */}
                {googleError && (
                    <p style={{ color: "red", fontWeight: "bold" }}>
                        {googleError}
                    </p>
                )}
            </section>
        </div>
    );
};
