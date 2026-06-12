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
import { mockSpots } from './Data/questions';

function App() {
  const [user, setUser] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [authScreen, setAuthScreen] = useState('welcome');
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedSpot, setSelectedSpot] = useState(null);

  const handleAuthSuccess = (u) => {
    setUser(u);
    setIsGuestMode(false);
    setAuthScreen(null);
    setCurrentTab('home');
  };

  // 認証・ゲスト選択画面
  if (!user && !isGuestMode) {
    return (
      <div className="app-body">
        <div className="app-wrapper">
          {authScreen === 'welcome' && (
            <Welcome 
              onStartExplore={() => { setIsGuestMode(true); setCurrentTab('home'); }}
              onNavigateToLogin={() => setAuthScreen('login')}
              onNavigateToRegister={() => setAuthScreen('register')}
            />
          )}
          {authScreen === 'login' && (
            <Login 
              onLoginSuccess={handleAuthSuccess}
              onNavigateToRegister={() => setAuthScreen('register')}
              onBackToWelcome={() => setAuthScreen('welcome')}
            />
          )}
          {authScreen === 'register' && (
            <Register 
              onRegisterSuccess={handleAuthSuccess}
              onNavigateToLogin={() => setAuthScreen('login')}
              onBackToWelcome={() => setAuthScreen('welcome')}
            />
          )}
        </div>
      </div>
    );
  }

  // メインアプリ画面
  return (
    <div className="app-body">
      <div className="app-wrapper">
        <div className="app-content-area">
          {selectedSpot ? (
            <Detail spot={selectedSpot} onBack={() => setSelectedSpot(null)} />
          ) : (
            <>
              {currentTab === 'home' && <Home onDiagnoseComplete={() => setCurrentTab('recommend')} />}
              {currentTab === 'recommend' && (
                <div>
                  <h2 className="recommend-title">おススメスポット</h2>
                  <div className="spot-list">
                    {mockSpots.map(spot => <CardDisplay key={spot.id} spot={spot} onCardClick={() => setSelectedSpot(spot)} />)}
                  </div>
                </div>
              )}
              {currentTab === 'saved' && (
                user ? (
                  <div className="saved-list-container">
                    {mockSpots.map(spot => <ListItem key={spot.id} spot={spot} onClick={() => setSelectedSpot(spot)} />)}
                  </div>
                ) : (
                  <LoginPrompt onNavigateToLogin={() => { setIsGuestMode(false); setAuthScreen('login'); }} />
                )
              )}
              {currentTab === 'profile' && (
                user ? <Profile /> : <LoginPrompt onNavigateToLogin={() => { setIsGuestMode(false); setAuthScreen('login'); }} />
              )}
            </>
          )}
        </div>
        {!selectedSpot && <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />}
      </div>
    </div>
  );
}

export default App;