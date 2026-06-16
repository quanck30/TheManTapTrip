import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TempButton from "../components/buttons/TempButton";
import "../Styles/profile.css";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phone: "090 123 4567",
    area: "ホーチミン市 1区",
  });

  // 保存中の状態と、完了メッセージの状態を追加
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage("");

    // 擬似的なAPI通信（1.5秒待機）
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSaving(false);
    setStatusMessage("プロフィールを更新しました！");

    // 3秒後にメッセージを消す
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="profile-container">
      {/* ...ヘッダー・アバター・フォーム部分は省略（既存のまま）... */}
      <div className="profile-summary">
        <h2>{formData.displayName}</h2>
        <p>{formData.email}</p>
      </div>

      {/* 好みセクションまで省略 */}

      {/* アクションエリア */}
      <div className="profile-actions">
        {/* メッセージ表示エリア */}
        {statusMessage && <div className="status-success">{statusMessage}</div>}

        <TempButton
          text={isSaving ? "保存中..." : "変更を保存"}
          variant="primary"
          disabled={isSaving} // 保存中はボタンを無効化
          onClick={handleSave}
          className="save-btn"
        />
        <span className="logout-link" onClick={handleLogout}>
          ログアウト
        </span>
      </div>
    </div>
  );
}

export default Profile;
