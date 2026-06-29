import { useState, React } from 'react';
import { FaChevronLeft, FaExclamationTriangle } from 'react-icons/fa';
import TempButton from '../components/buttons/TempButton';
import '../styles/register.css';
import { GoogleLoginButton } from "../components/buttons/GoogleLoginButton";

function Register({ onRegisterSuccess, onNavigateToLogin, onBackToWelcome }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('すべての項目を入力してください。');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      onRegisterSuccess({ uid: "user-" + Date.now(), displayName: name, email: email });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="reg-container">
      <button className="reg-back-button" onClick={onBackToWelcome}><FaChevronLeft /></button>
      <div className="reg-header">
        <h1 className="reg-title">TapTrip</h1>
      </div>
      <div className="reg-main">
        <h2 className="reg-heading">新規登録</h2>
        {error && (
          <div className="reg-error">
            <FaExclamationTriangle color="#e53e3e" style={{ verticalAlign: "middle", marginRight: 4 }} />
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="reg-form">
          <div className="reg-field">
            <label className="reg-label">氏名</label>
            <div className="reg-input-wrapper">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="reg-field">
            <label className="reg-label">メールアドレス</label>
            <div className="reg-input-wrapper">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="reg-field">
            <label className="reg-label">パスワード</label>
            <div className="reg-input-wrapper">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <TempButton text={isLoading ? "登録中..." : "登録する"} type="submit" disabled={isLoading} />
        </form>
        <div className="reg-divider"><span>または</span></div>
        <GoogleLoginButton onLoginSuccess={onRegisterSuccess} />
        <div className="reg-footer">
          アカウントをお持ちですか？ <span onClick={onNavigateToLogin}>ログイン</span>
        </div>
      </div>
    </div>
  );
}

export default Register;
