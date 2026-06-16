import React from 'react';
import TempButton from '../components/buttons/TempButton';
import '../Styles/LoginPrompt.css';

function LoginPrompt({ onNavigateToLogin }) {
  return (
    <div className="login-prompt-container">
      <div className="login-prompt-icon">🔒</div>
      <h2 className="login-prompt-title">ログインが必要です</h2>
      <p className="login-prompt-description">
        スポットの保存機能や、マイアカウントの確認・編集を行うにはログインが必要です。
      </p>

      <TempButton 
        text="ログイン画面へ進む" 
        variant="primary" 
        onClick={onNavigateToLogin}
        className="login-prompt-button"
      />
    </div>
  );
}

export default LoginPrompt;