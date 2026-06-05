/**
 * @brief
 * @Author
 * @Date 26/05/26
 * @Update
 */

import React from 'react';

function CategoryButton({ label, isActive, onClick }) {
  return (
    <button 
      className={`user-type-tag ${isActive ? 'is-active' : ''}`} 
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default CategoryButton;