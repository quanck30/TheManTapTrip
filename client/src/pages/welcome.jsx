import React from 'react';
import TempButton from '../components/buttons/TempButton';
import '../Styles/welcome.css'; // 通常のCSSファイルをインポート

import logoImage from '../assets/Taptrip.png';

function Welcome({ onStartExplore, onNavigateToLogin, onNavigateToRegister }) {
  return (
    <div className="welcome-container">
      {/* ロゴとキャッチコピー */}
      <div className="welcome-header">
        <div className="welcome-logo-wrapper">
         <img src={logoImage} alt="TapTrip Logo" className="welcome-logo-image" />
          <h1 className="welcome-title">TapTrip</h1>
        </div>
        <h2 className="welcome-subtitle">今日はどこへ行く？</h2>
        <p className="welcome-description">
          いくつかの質問に答えるだけで、TapTripが今の気分にぴったりの場所を提案します。
        </p>
      </div>

      {/* グラフィック領域 */}
      <div className="welcome-graphic">
        <div className="welcome-graphic-text">Your Smart Trip Planner</div>
      </div>

      {/* アクションボタン */}
      <div className="welcome-actions">
        <TempButton 
          text="探索をはじめる ➔" 
          variant="primary" 
          onClick={onStartExplore} 
          className="welcome-btn" 
        />
        <TempButton 
          text="新規登録 ➔" 
          variant="secondary" 
          onClick={onNavigateToRegister} 
          className="welcome-btn welcome-btn-register"
        />
        <span onClick={onNavigateToLogin} className="welcome-login-link">
          すでにアカウントをお持ちの方
        </span>
      </div>
    </div>
  );
}

export default Welcome;