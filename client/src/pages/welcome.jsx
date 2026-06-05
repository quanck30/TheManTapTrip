import React from 'react';
import TempButton from '../components/buttons/TempButton';

function Welcome({ onStartExplore, onNavigateToLogin, onNavigateToRegister }) {
  return (
    <div 
      className="welcome-container"
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #e3f2fd 0%, #f7fafc 100%)',
        padding: '40px 24px 32px 24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'sans-serif'
      }}
    >
      {/* ロゴとキャッチコピー */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          <span style={{ fontSize: '24px', background: '#2c3e50', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>🧭</span>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1a202c', margin: 0 }}>TapTrip</h1>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#2b6cb0', margin: '0 0 12px 0', textAlign: 'center' }}>今日はどこへ行く？</h2>
        <p style={{ fontSize: '13px', color: '#4a5568', textAlign: 'center', lineHeight: '1.6' }}>
          いくつかの質問に答えるだけで、TapTripが今の気分にぴったりの場所を提案します。
        </p>
      </div>

      {/* グラフィック領域 */}
      <div style={{ width: '100%', height: '240px', borderRadius: '24px', background: 'linear-gradient(135deg, #a7f3d0 0%, #818cf8 100%)', position: 'relative', boxShadow: '0 12px 32px rgba(43, 108, 176, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>Your Smart Trip Planner</div>
      </div>

      {/* アクションボタン */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
        <TempButton text="探索をはじめる ➔" variant="primary" onClick={onStartExplore} style={{ width: '100%', padding: '14px', borderRadius: '14px' }} />
        <TempButton text="新規登録 ➔" variant="secondary" onClick={onNavigateToRegister} style={{ width: '100%', padding: '14px', borderRadius: '14px', backgroundColor: '#90cdf4', color: '#1a202c', border: 'none' }} />
        <span onClick={onNavigateToLogin} style={{ fontSize: '13px', color: '#2b6cb0', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', marginTop: '6px' }}>
          すでにアカウントをお持ちの方
        </span>
      </div>
    </div>
  );
}

export default Welcome;