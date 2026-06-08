import React, { useState } from 'react';
import TempButton from '../components/buttons/TempButton';
import '../Styles/Register.css';
import GoogleLoginButton from "../components/buttons/GoogleLoginButton";

function Register({ onRegisterSuccess, onNavigateToLogin, onBackToWelcome }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

    setTimeout(() => {
      if (!name || !email || !password) {
        setError('すべての項目を入力してください。');
        setIsLoading(false);
        return;
      }
      if (password.length < 8) {
        setError('パスワードは8文字以上で入力してください。');
        setIsLoading(false);
        return;
      }

      onRegisterSuccess({
        uid: "user-" + Date.now(),
        displayName: name,
        email: email,
        photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="reg-container">
      <button className="reg-back-button" onClick={onBackToWelcome}>＜</button>

      <div className="reg-header">
        <div className="reg-logo-box">
          <span className="reg-logo-icon">🧭</span>
        </div>
        <h1 className="reg-title">TapTrip</h1>
      </div>

      <div className="reg-main">
        <h2 className="reg-heading">新規登録</h2>
        <p className="reg-subtext">冒険を始めましょう</p>

        {error && <div className="reg-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="reg-form">
          <div className="reg-field">
            <label className="reg-label">氏名</label>
            <div className="reg-input-wrapper">
              <span className="reg-icon">👤</span>
              <input type="text" placeholder="山田 太郎" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

          <div className="reg-field">
            <label className="reg-label">メールアドレス</label>
            <div className="reg-input-wrapper">
              <span className="reg-icon">✉️</span>
              <input type="email" placeholder="example@taptrip.jp" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="reg-field">
            <label className="reg-label">パスワード</label>
            <div className="reg-input-wrapper">
              <span className="reg-icon">🔒</span>
              <input type={showPassword ? "text" : "password"} placeholder="8文字以上" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <span className="reg-eye" onClick={() => setShowPassword(!showPassword)}>👁️</span>
            </div>
          </div>

          <TempButton 
            text={isLoading ? "登録中..." : "登録する"} 
            variant="primary" 
            type="submit"
            disabled={isLoading}
            className="reg-submit-btn"
          />
        </form>

        <div className="reg-divider"><span>または</span></div>

        <div className="reg-social-btns">
          <button onClick={() => alert('Google認証（モック）')}><span>🌐</span> Googleで続ける</button>
          <button onClick={() => alert('Apple認証（モック）')} className="reg-apple-btn"><span>🍎</span> Appleで続ける</button>
        </div>

        <div className="reg-footer">
          アカウントをお持ちですか？ <span onClick={onNavigateToLogin}>ログイン</span>
        </div>
      </div>
    </div>
  );
}

export default Register;
