import React, { useState } from 'react';
import TempButton from '../components/buttons/TempButton';

function Profile() {
  const [formData, setFormData] = useState({
    displayName: "Minh Anh",
    email: "minhanh@email.com",
    phone: "090 123 4567",
    area: "ホーチミン市 1区"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div 
      className="profile-container" 
      style={{ 
        backgroundColor: '#ffffff', 
        width: '100%',
        
        height: 'calc(100vh - 64px)', 
        maxHeight: '780px',            
        overflowY: 'auto',             
        overflowX: 'hidden',

        padding: '16px 20px 40px 20px', 
        color: '#2c3e50',
        fontFamily: 'sans-serif',
        boxSizing: 'border-box'
      }}
    >
      {/* ヘッダーエリア */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <span style={{ fontSize: '18px', cursor: 'pointer', color: '#2f80ed' }}>＜</span>
        <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>アカウント</h2>
        <span style={{ fontSize: '18px', cursor: 'pointer', color: '#2f80ed' }}>❓</span>
      </div>

      {/* プロフィールアイコン＆紹介文 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '12px' }}>
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" 
            alt="User Avatar" 
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', cursor: 'pointer' }}>
            📷
          </div>
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>ミン・アン</h3>
        <p style={{ fontSize: '12px', color: '#7f8c8d', margin: 0 }}>週末の散歩が好き</p>
      </div>

      {/* 個人情報フォームセクション */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#2f80ed', margin: '0 0 12px 0', letterSpacing: '0.5px' }}>個人情報</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#7f8c8d', marginBottom: '4px' }}>表示名</label>
            <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#7f8c8d', marginBottom: '4px' }}>メールアドレス</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#7f8c8d', marginBottom: '4px' }}>電話番号</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#7f8c8d', marginBottom: '4px' }}>よく行くエリア</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input type="text" name="area" value={formData.area} onChange={handleChange} style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }} />
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#7f8c8d' }}>⚙️</span>
            </div>
          </div>
        </div>
      </div>

      {/* おすすめの好み */}
      <div style={{ marginBottom: '28px' }}>
        <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#2f80ed', margin: '0 0 12px 0', letterSpacing: '0.5px' }}>おすすめの好み</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {["静かな場所", "アウトドア", "カフェ", "軽い散歩"].map((tag, idx) => (
            <span key={idx} style={{ background: '#e3f2fd', color: '#1e88e5', padding: '6px 14px', borderRadius: '16px', fontSize: '12px', fontWeight: '600' }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ textAlignment: 'center' }}>
          <span style={{ fontSize: '12px', color: '#2f80ed', cursor: 'pointer', textDecoration: 'underline' }}>⚙️ 好みを調整</span>
        </div>
      </div>

      {/* 設定メニューリスト */}
      <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #f1f5f9', marginBottom: '32px' }}>
        {[
          { text: "🔒 パスワード変更" },
          { text: "🔔 通知設定" },
          { text: "📍 位置情報の権限" }
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 4px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
            <span style={{ fontSize: '13px', color: '#2c3e50', fontWeight: '500' }}>{item.text}</span>
            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>＞</span>
          </div>
        ))}
      </div>

      {/* アクションボタン群 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%', paddingBottom: '20px' }}>
        <TempButton 
          text="変更を保存" 
          variant="primary" 
          onClick={() => alert('アカウント情報を保存しました！')} 
          style={{ width: '100%' }} 
        />
        
        <span 
          onClick={() => alert('ログアウトします')} 
          style={{ fontSize: '13px', color: '#e53e3e', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', marginTop: '4px' }}
        >
          ログアウト
        </span>
      </div>

    </div>
  );
}

export default Profile;