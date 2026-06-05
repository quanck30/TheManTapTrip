import React from 'react';
import TempButton from '../components/buttons/TempButton';

function LoginPrompt({ onNavigateToLogin }) {
  return (
    <div 
      style={{
        padding: '40px 24px',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#ffffff'
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#2c3e50', marginBottom: '12px' }}>
        ログインが必要です
      </h2>
      <p style={{ fontSize: '14px', color: '#7f8c8d', lineHeight: '1.6', marginBottom: '32px', padding: '0 20px' }}>
        スポットの保存機能や、マイアカウントの確認・編集を行うにはログインが必要です。
      </p>

      <TempButton 
        text="ログイン画面へ進む" 
        variant="primary" 
        onClick={onNavigateToLogin}
        style={{ width: '100%', padding: '14px' }}
      />
    </div>
  );
}

export default LoginPrompt;