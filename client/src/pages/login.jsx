import React, { useState } from 'react';
import { loginService } from '../Services/auth';
import TempButton from '../components/buttons/TempButton';
import '../Styles/login.css';
import { GoogleLoginButton } from "../components/buttons/GoogleLoginButton";

function Login({ onLoginSuccess, onBackToWelcome, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await loginService(email, password);
      if (response.success) onLoginSuccess(response.user);
    } catch (err) {
      setError(err.message || "ログインに失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-back-wrapper"><span className="login-back-btn" onClick={onBackToWelcome}>＜ 戻る</span></div>
      <div className="login-header">
        <h2 className="login-title">ログイン</h2>
        <p className="login-subtitle">おかえりなさい！</p>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="login-error">⚠️ {error}</div>}
        <div className="form-group">
          <label>メールアドレス</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>パスワード</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <TempButton text={isLoading ? "ログイン中..." : "ログイン"} variant="primary" type="submit" disabled={isLoading} />
      </form>
      <div className="login-divider">または</div>
      <div className="login-social-btns">
        <GoogleLoginButton />
      </div>
      <div className="login-footer">アカウントをお持ちでないですか？ <span onClick={onNavigateToRegister}>新規登録</span></div>
    </div>
  );
}

export default Login;