/**
 * @brief
 * @Author
 * @Date 26/05/26
 * @Update
 */

import React from 'react';

function ListItem({ spot, onClick }) {
  if (!spot) return null;

  // Google Places API (New) から安全にデータを抽出
  const title = spot.displayName?.text || "名称不明のスポット";
  const category = spot.types && spot.types[0] ? spot.types[0] : "観光";
  const imageUrl = spot.photos && spot.photos[0]?.flagUrl ? spot.photos[0].flagUrl : "https://via.placeholder.com/60";

  return (
    <div 
      className="profile-menu-item" 
      onClick={onClick} 
      style={{ 
        display: 'flex', 
        gap: '16px', 
        alignItems: 'center', 
        padding: '16px',
        borderBottom: '1px solid #f1f5f9',
        cursor: 'pointer',
        backgroundColor: '#ffffff'
      }}
    >
      <img 
        src={imageUrl} 
        alt={title} 
        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#e2e8f0' }} 
      />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#2c3e50', margin: 0 }}>
          {title}
        </h4>
        <span style={{ fontSize: '12px', color: '#7f8c8d' }}>
          🏷️ {category}
        </span>
      </div>
      
      <span style={{ fontSize: '16px', color: '#cbd5e1', fontWeight: 'bold' }}>＞</span>
    </div>
  );
}

export default ListItem;