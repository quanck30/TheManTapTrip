/**
 * @brief
 * @Author
 * @Date 26/05/26
 * @Update
 */

/**
 * 汎用ボタンコンポーネント
 * *      @param {string} text - ボタンに表示するラベルテキスト
 *        @param {('primary'|'secondary'|'accent')} [variant='primary'] - ボタンのスタイル種別
 * - primary: メインアクション用（青グラデーション）
 * - secondary: サブアクション用（白背景・青枠）
 * - accent: 強調アクション用（緑色）
 *        @param {function} onClick - ボタンクリック時に実行されるコールバック関数
 * *      @note 
 * - スタイルは btn-{variant} クラスで制御されています。
 * - 利用する際は CSS ファイル側で各 variant のスタイル定義が必要です。
 */

function TempButton({
  text,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) {
  // variant: 'primary' (青グラデ), 'secondary' (白背景・青枠), 'accent' (緑)
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default TempButton;
