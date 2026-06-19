/**
 * @brief
 * @Author
 * @Date 26/05/26
 * @Update
 */


import React from 'react';

/**
 * カテゴリー選択用のボタンコンポーネント
 * * @param {string} label - ボタンに表示するテキスト
 * @param {boolean} isActive - 現在選択されているかどうかを示すフラグ
 * @param {function} onClick - ボタンクリック時に発火するコールバック関数
 */

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