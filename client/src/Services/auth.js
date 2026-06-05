/**
 * 簡易ログイン認証サービス（開発用モック）
 */
export const loginService = async (email, password) => {
  // 本来はここでバックエンドのAPI（APIサーバーなど）を叩きます
  // 今回はフロントエンドを動かすための擬似的な遅延（非同期処理）を挟みます
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 簡易バリデーション：空文字チェック
      if (!email || !password) {
        reject(new Error("メールアドレスとパスワードを入力してください。"));
        return;
      }

      // 開発用のテストアカウント
      // もし特定のメアドだけで検証したい場合はここを変更してください
      if (email === "shutou@example.com" || email.includes("@")) {
        resolve({
          success: true,
          user: {
            uid: "user-12345",
            displayName: "ミン・アン",
            email: email,
            photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
          }
        });
      } else {
        reject(new Error("メールアドレスまたはパスワードが正しくありません。"));
      }
    }, 800); // 0.8秒後にレスポンスを返す（通信のシミュレート）
  });
};