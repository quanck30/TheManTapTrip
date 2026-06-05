/**
 * @brief
 * @Author
 * @Date 26/05/26
 * @Update
 */

import React from 'react';

function TempButton({ text, variant = 'primary', onClick }) {
  // variant: 'primary' (青グラデ), 'secondary' (白背景・青枠), 'accent' (緑)
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default TempButton;