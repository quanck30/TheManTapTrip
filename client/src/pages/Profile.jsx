import { useState } from "react";
import { FaUser, FaCamera, FaBell } from "react-icons/fa";
import { RiShieldKeyholeFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    displayName: "Minh Anh",
    email: "minhanh@email.com",
    phone: "090 123 4567",
    avatarUrl: "", // 画像URLがあればそれを表示、なければプレースホルダー
  });

  // 保存中の状態と、完了メッセージの状態
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // 画像の読み込みに失敗した場合もプレースホルダーに切り替える
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  // 表示名は入力中ずっと反映せず、フォーカスが外れたタイミングでまとめて反映する
  const [displayNameDraft, setDisplayNameDraft] = useState(formData.displayName);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // 入力中はdisplayNameDraftだけ更新し、フォーカスが外れたら formData に反映する
  const handleDisplayNameBlur = () => {
    setFormData((prev) => ({ ...prev, displayName: displayNameDraft }));
  };

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

  const handleBack = () => {
    console.log("戻る");
  };

  const handleMenuClick = (label) => {
    console.log(`${label} がクリックされました`);
  };

  const handleLogout = async () => {
    // セッション破棄とローカル状態のクリアを行い、トップへ戻る
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="profile-container">
      {/* ヘッダー */}
      <div className="profile-header">
        <span className="nav-icon" onClick={handleBack}>‹</span>
        <h1 className="header-title">アカウント</h1>
        <span className="nav-icon">?</span>
      </div>

      {/* アバター */}
      <div className="profile-avatar-section">
        <div className="avatar-wrapper">
          {formData.avatarUrl && !avatarLoadError ? (
            <img
              className="avatar-img"
              src={formData.avatarUrl}
              alt="プロフィール画像"
              onError={() => setAvatarLoadError(true)}
            />
          ) : (
            <div className="avatar-img avatar-placeholder">
              <FaUser />
            </div>
          )}
          <span className="avatar-edit-icon">
            <FaCamera />
          </span>
        </div>
        <h2 className="user-name">{formData.displayName}</h2>
        <p className="user-bio">週末の散歩が好き</p>
      </div>

      {/* 個人情報 */}
      <div className="profile-section">
        <p className="section-title">個人情報</p>
        <div className="form-group">
          <div>
            <label className="input-label">表示名</label>
            <input
              type="text"
              value={displayNameDraft}
              onChange={(e) => setDisplayNameDraft(e.target.value)}
              onBlur={handleDisplayNameBlur}
            />
          </div>
          <div>
            <label className="input-label">メールアドレス</label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
            />
          </div>
        </div>
      </div>

      {/* メニュー */}
      <div className="menu-list">
        <div className="menu-item" onClick={() => handleMenuClick("パスワード変更")}>
          <span>
            <RiShieldKeyholeFill className="menu-icon" />
            パスワード変更
          </span>
          <span className="arrow">›</span>
        </div>
        <div className="menu-item" onClick={() => handleMenuClick("通知設定")}>
          <span>
            <FaBell className="menu-icon" />
            通知設定
          </span>
          <span className="arrow">›</span>
        </div>
      </div>

      {/* アクションエリア */}
      <div className="profile-actions">
        {/* メッセージ表示エリア（高さを常に確保してボタン位置がズレないようにする） */}
        <div className={`status-success ${statusMessage ? "is-visible" : ""}`}>
          {statusMessage || "\u00A0"}
        </div>

        <button
          className="save-btn"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? "保存中..." : "変更を保存"}
        </button>
        <span className="logout-link" onClick={handleLogout}>
          ログアウト
        </span>
      </div>
    </div>
  );
}

export default Profile;