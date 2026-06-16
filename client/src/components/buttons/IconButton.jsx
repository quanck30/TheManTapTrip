/**
 * @brief
 * @Author J.Naka
 * @Date 26/05/26
 * @Update
 */

import React from 'react';
import '../../Styles/IconButton.css';

function IconButton({ icon, onClick, variant }) {
  // variant: 'bookmark' か 'back' をクラス名に変換
  const className = variant === 'back' ? 'icon-btn-back' : 'icon-btn-bookmark';
  
  return (
    <button className={`icon-btn ${className}`} onClick={onClick}>
      <span className="icon-content">{icon}</span>
    </button>
  );
}

export default IconButton;