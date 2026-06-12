import React, { useState } from 'react';
import TempButton from '../components/buttons/TempButton';
import '../Styles/Profile.css';

function Profile() {
  const [formData, setFormData] = useState({
    displayName: "Minh Anh",
    email: "minhanh@email.com",
    phone: "090 123 4567",
    area: "ホーチミン市 1区"
  });

  // 保存中の状態と、完了メッセージの状態を追加
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage("");

    // 擬似的なAPI通信（1.5秒待機）
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSaving(false);
    setStatusMessage("プロフィールを更新しました！");
    
    // 3秒後にメッセージを消す
    setTimeout(() => setStatusMessage(""), 3000);
  };

  return (
    <div className="profile-container">
      {/* ...ヘッダー・アバター・フォーム部分は省略（既存のまま）... */}
      
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
        <span className="logout-link" onClick={() => alert('ログアウトします')}>ログアウト</span>
      </div>
    </div>
  );
}

export default Profile;