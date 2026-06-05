import React, { useState } from 'react';


// CSSインポート
import './Styles/reset.css';
import './Styles/variables.css';
import './Styles/global.css';
import './Styles/layout.css';
import './Styles/button.css';
import './Styles/card.css';
import './Styles/welcome.css';
import './Styles/login.css';
import './Styles/Home.css';
import './Styles/profile.css';
import './Styles/detail.css';

// ページコンポーネント
import CardDisplay from './components/cards/CardDisplay';
import ListItem from './components/cards/ListItem';
import Navigation from './components/layout/Navigation';
import Welcome from './pages/welcome';
import Login from './pages/login';
import Register from './pages/register';
import LoginPrompt from './pages/loginPronpt';
import Home from './pages/home';
import Detail from './pages/detail';
import Profile from './pages/profile';

// データ
import { mockSpots } from './Data/questions';

function App() {
  const [user, setUser] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [authScreen, setAuthScreen] = useState('welcome'); // 'welcome' | 'login' | 'register'
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedSpot, setSelectedSpot] = useState(null);

  // --- 1. 認証フロー (未ログイン・未探索状態) ---
  if (!user && !isGuestMode) {
    return (
      <div className="body" style={{ display: 'flex', justifyContent: 'center', background: '#f5f5f5', minHeight: '100vh', alignItems: 'center' }}>
        <div className="app-wrapper" style={{ position: 'relative', height: '844px', width: '390px', overflow: 'hidden', boxShadow: '0 0 24px rgba(0,0,0,0.1)', backgroundColor: '#ffffff' }}>
          
          {authScreen === 'welcome' && (
            <Welcome 
              onStartExplore={() => { setIsGuestMode(true); setCurrentTab('home'); }}
              onNavigateToLogin={() => setAuthScreen('login')}
              onNavigateToRegister={() => setAuthScreen('register')}
            />
          )}
          {authScreen === 'login' && (
            <Login 
              onLoginSuccess={(u) => { setUser(u); setCurrentTab('home'); }}
              onNavigateToRegister={() => setAuthScreen('register')}
              onBackToWelcome={() => setAuthScreen('welcome')}
            />
          )}
          {authScreen === 'register' && (
            <Register 
              onRegisterSuccess={(u) => { setUser(u); setCurrentTab('home'); }}
              onNavigateToLogin={() => setAuthScreen('login')}
              onBackToWelcome={() => setAuthScreen('welcome')}
            />
          )}
        </div>
      </div>
    );
  }

  // --- 2. 詳細画面 (最前面) ---
  if (selectedSpot) {
    return (
      <div className="body" style={{ display: 'flex', justifyContent: 'center', background: '#f5f5f5', minHeight: '100vh', alignItems: 'center' }}>
        <div className="app-wrapper" style={{ position: 'relative', height: '844px', width: '390px', overflow: 'hidden', boxShadow: '0 0 24px rgba(0,0,0,0.1)' }}>
          <Detail spot={selectedSpot} onBack={() => setSelectedSpot(null)} />
        </div>
      </div>
    );
  }

  // --- 3. メイン画面 (ナビゲーションあり) ---
  return (
    <div className="body" style={{ display: 'flex', justifyContent: 'center', background: '#f5f5f5', minHeight: '100vh', alignItems: 'center' }}>
      <div className="app-wrapper" style={{ position: 'relative', height: '844px', width: '390px', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', boxShadow: '0 0 24px rgba(0,0,0,0.1)' }}>
        
        <div className="app-content-area" style={{ padding: '20px', overflowY: 'auto', overflowX: 'hidden', height: 'calc(100% - 64px)', boxSizing: 'border-box' }}>
          
          {currentTab === 'home' && <Home onDiagnoseComplete={() => setCurrentTab('recommend')} />}
          
          {currentTab === 'recommend' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#2c3e50' }}>おススメスポット</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mockSpots.map(spot => <CardDisplay key={spot.id} spot={spot} onCardClick={() => setSelectedSpot(spot)} />)}
              </div>
            </div>
          )}

          {currentTab === 'saved' && (
            user ? (
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#2c3e50', textAlign: 'center' }}>保存済みの場所</h2>
                <div style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  {mockSpots.map(spot => <ListItem key={spot.id} spot={spot} onClick={() => setSelectedSpot(spot)} />)}
                </div>
              </div>
            ) : (
              <LoginPrompt onNavigateToLogin={() => { setIsGuestMode(false); setAuthScreen('login'); }} />
            )
          )}

          {currentTab === 'profile' && (
            user ? <Profile /> : <LoginPrompt onNavigateToLogin={() => { setIsGuestMode(false); setAuthScreen('login'); }} />
          )}
        </div>

        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
    </div>
  );
}

export default App;