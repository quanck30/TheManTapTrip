/**
 * @brief
 * @Author
 * @Date 26/05/26
 * @Update
 */

import React from 'react';

function Navigation({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'ホーム', icon: '🏠' },
    { id: 'recommend', label: 'おすすめ', icon: '✨' },
    { id: 'saved', label: '保存済み', icon: '🔖' },
    { id: 'profile', label: 'アカウント', icon: '👤' }
  ];

  return (
    <nav className="bottom-nav-bar">
      {tabs.map((tab) => (
        <div 
          key={tab.id}
          className={`nav-item ${currentTab === tab.id ? 'is-active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </div>
      ))}
    </nav>
  );
}

export default Navigation;