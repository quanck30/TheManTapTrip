import { useState } from 'react';
import { FaChevronLeft, FaExclamationTriangle } from 'react-icons/fa';
import TempButton from '../components/buttons/TempButton';
import GoogleLoginButton from '../components/buttons/GoogleLoginButton';
import { useEmailAuth } from '../hooks/useEmailAuth';

function Login({ onLoginSuccess, onBackToWelcome, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputError, setInputError] = useState('');

  // Email/パスワードによるログイン処理（成功時に画面遷移）
  const { login, isLoading, error: authError } = useEmailAuth((user) => {
    onLoginSuccess(user);
  });

  // 入力チェックのエラーとサーバー由来のエラーをまとめて表示する
  const error = inputError || authError;

  const handleSubmit = (e) => {
    e.preventDefault();

    // 入力チェック
    if (!email || !password) {
      setInputError('メールアドレスとパスワードを入力してください');
      return;
    }

    setInputError('');
    login({ email, password });
  };

  return (
    <div className="login-container">
      <div className="login-back-wrapper">
        <span className="login-back-btn" onClick={onBackToWelcome}>
          <FaChevronLeft style={{ verticalAlign: "middle", marginRight: 4 }} />戻る
        </span>
      </div>

      <div className="login-header">
        <h2 className="login-title">ログイン</h2>
        <p className="login-subtitle">おかえりなさい！アカウントにログインしてください</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && (
          <div className="login-error">
            <FaExclamationTriangle color="#e53e3e" style={{ verticalAlign: "middle", marginRight: 4 }} />
            {error}
          </div>
        )}

        <div className="form-group">
          <label>メールアドレス</label>
          <input 
            type="email" 
            placeholder="example@email.com" 
            value={email} 
            onChange={(e) => { setEmail(e.target.value); setInputError(''); }}
          />
        </div>

        <div className="form-group">
          <label>パスワード</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => { setPassword(e.target.value); setInputError(''); }}
          />
        </div>

        <div className="login-forgot-pass">パスワードをお忘れですか？</div>

        <TempButton 
          text={isLoading ? "ログイン中..." : "ログイン"} 
          variant="primary" 
          type="submit"
          className="login-submit-btn"
        />
      </form>

      <div className="google-btn-wrapper" style={{ marginTop: '20px' }}>
        <GoogleLoginButton onLoginSuccess={onLoginSuccess} />
      </div>

      <div className="login-footer">
        アカウントをお持ちでないですか？{' '}
        <span onClick={onNavigateToRegister}>新規登録</span>
      </div>
    </div>
  );
}

export default Login;
