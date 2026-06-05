import React, { useState } from 'react';
import { loginService } from '../Services/auth';
import TempButton from '../components/buttons/TempButton';

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
      if (response.success) {
        onLoginSuccess(response.user);
      }
    } catch (err) {
      setError(err.message || "ログインに失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="login-container"
      style={{
        padding: '40px 24px',
        backgroundColor: '#ffffff',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      {/* 戻るボタン */}
      <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
        <span 
          onClick={onBackToWelcome}
          style={{ fontSize: '18px', cursor: 'pointer', color: '#7f8c8d', padding: '8px' }}
        >
          ＜ 戻る
        </span>
      </div>

      {/* ヘッダー */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#2c3e50', margin: '0 0 8px 0' }}>ログイン</h2>
        <p style={{ fontSize: '14px', color: '#7f8c8d', margin: 0 }}>おかえりなさい！アカウントにログインしてください</p>
      </div>

      {/* フォーム */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {error && (
          <div style={{ backgroundColor: '#fff5f5', color: '#e53e3e', padding: '12px', borderRadius: '8px', fontSize: '13px', border: '1px solid #fed7d7' }}>
            ⚠️ {error}
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>メールアドレス</label>
          <input 
            type="email" 
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }} 
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>パスワード</label>
          <input 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#f8fafc' }} 
            required
          />
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '12px', color: '#2f80ed', cursor: 'pointer' }}>パスワードをお忘れですか？</span>
        </div>

        <div style={{ marginTop: '16px' }}>
          <TempButton 
            text={isLoading ? "ログイン中..." : "ログイン"} 
            variant="primary" 
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', padding: '14px' }} 
          />
        </div>
      </form>

      {/* 新規登録への誘導リンク */}
      <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: '#7f8c8d' }}>
        アカウントをお持ちでないですか？{' '}
        <span 
          onClick={onNavigateToRegister}
          style={{ color: '#2f80ed', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
        >
          新規登録
        </span>
      </div>
    </div>
  );
}

export default Login;