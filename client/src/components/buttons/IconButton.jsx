/**
 * @brief
 * @Author J.Naka
 * @Date 26/05/26
 * @Update
 */

import React from 'react';

function IconButton({ icon, onClick, variant }) {
  // variant: 'bookmark'（カード内右上）か 'back'（詳細画面左上）を指定
  const className = variant === 'back' ? 'back-btn' : 'bookmark-btn';
  
  return (
    <button className={className} onClick={onClick}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
    </button>
  );
}

export default IconButton;