/**
 * @brief
 * @Author
 * @Date 26/05/26
 * @Update
 */

import React from 'react';
import { FaHome, FaMagic, FaRegBookmark, FaRegUser } from 'react-icons/fa';

function Navigation({ currentTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'ホーム', Icon: FaHome },
    { id: 'recommend', label: 'おすすめ', Icon: FaMagic },
    { id: 'saved', label: '保存済み', Icon: FaRegBookmark },
    { id: 'profile', label: 'アカウント', Icon: FaRegUser }
  ];

  return (
    <nav className="bottom-nav-bar">
      {tabs.map((tab) => (
        <div 
          key={tab.id}
          className={`nav-item ${currentTab === tab.id ? 'is-active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="nav-icon"><tab.Icon /></span>
          <span>{tab.label}</span>
        </div>
      ))}
    </nav>
  );
}

export default Navigation;