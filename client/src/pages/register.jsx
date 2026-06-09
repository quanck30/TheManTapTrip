import React, { useState } from "react";
import TempButton from "../components/buttons/TempButton";
import GoogleLoginButton from "../components/buttons/GoogleLoginButton";

function Register({ onRegisterSuccess, onNavigateToLogin, onBackToWelcome }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // 擬似的な通信遅延のあとに登録完了とする
        setTimeout(() => {
            if (!name || !email || !password) {
                setError("すべての項目を入力してください。");
                setIsLoading(false);
                return;
            }
            if (password.length < 8) {
                setError("パスワードは8文字以上で入力してください。");
                setIsLoading(false);
                return;
            }

            // 登録成功として親コンポーネントにユーザーデータを渡す
            onRegisterSuccess({
                uid: "user-" + Date.now(),
                displayName: name,
                email: email,
                photoURL:
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            });
            setIsLoading(false);
        }, 800);
    };

    return (
        <div
            className="register-container"
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#ffffff",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                fontFamily: "sans-serif",
                position: "relative",
            }}>
            {/* 戻るボタン */}
            <button
                onClick={onBackToWelcome}
                style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    color: "#ffffff",
                    zIndex: 10,
                }}>
                ＜
            </button>

            {/* 上部グラデーションヘッダーエリア */}
            <div
                style={{
                    width: "100%",
                    height: "200px",
                    background:
                        "linear-gradient(180deg, #3498db 0%, #63cdff 100%)",
                    borderBottomLeftRadius: "40px",
                    borderBottomRightRadius: "40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                }}>
                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        width: "54px",
                        height: "54px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        marginBottom: "10px",
                    }}>
                    <span style={{ fontSize: "24px", color: "#2c3e50" }}>
                        🧭
                    </span>
                </div>
                <h1
                    style={{
                        fontSize: "20px",
                        fontWeight: "800",
                        margin: 0,
                        letterSpacing: "1px",
                    }}>
                    TapTrip
                </h1>
            </div>

            {/* メインフォームコンテンツ */}
            <div
                style={{
                    padding: "32px 24px 40px 24px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}>
                <h2
                    style={{
                        fontSize: "22px",
                        fontWeight: "800",
                        color: "#2c3e50",
                        margin: "0 0 4px 0",
                    }}>
                    新規登録
                </h2>
                <p
                    style={{
                        fontSize: "13px",
                        color: "#7f8c8d",
                        margin: "0 0 24px 0",
                    }}>
                    冒険を始めましょう
                </p>

                {error && (
                    <div
                        style={{
                            backgroundColor: "#fff5f5",
                            color: "#e53e3e",
                            padding: "12px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            marginBottom: "16px",
                            border: "1px solid #fed7d7",
                        }}>
                        ⚠️ {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}>
                    {/* 氏名入力 */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#2f80ed",
                                marginBottom: "6px",
                            }}>
                            氏名
                        </label>
                        <div style={{ position: "relative" }}>
                            <span
                                style={{
                                    position: "absolute",
                                    left: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#a0aec0",
                                }}>
                                👤
                            </span>
                            <input
                                type="text"
                                placeholder="山田 太郎"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 12px 12px 40px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "12px",
                                    fontSize: "14px",
                                    boxSizing: "border-box",
                                    backgroundColor: "#ffffff",
                                }}
                                required
                            />
                        </div>
                    </div>

                    {/* メールアドレス入力 */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#2f80ed",
                                marginBottom: "6px",
                            }}>
                            メールアドレス
                        </label>
                        <div style={{ position: "relative" }}>
                            <span
                                style={{
                                    position: "absolute",
                                    left: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#a0aec0",
                                }}>
                                ✉️
                            </span>
                            <input
                                type="email"
                                placeholder="example@taptrip.jp"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 12px 12px 40px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "12px",
                                    fontSize: "14px",
                                    boxSizing: "border-box",
                                    backgroundColor: "#ffffff",
                                }}
                                required
                            />
                        </div>
                    </div>

                    {/* パスワード入力 */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#2f80ed",
                                marginBottom: "6px",
                            }}>
                            パスワード
                        </label>
                        <div style={{ position: "relative" }}>
                            <span
                                style={{
                                    position: "absolute",
                                    left: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "#a0aec0",
                                }}>
                                🔒
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="8文字以上"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 40px 12px 40px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "12px",
                                    fontSize: "14px",
                                    boxSizing: "border-box",
                                    backgroundColor: "#ffffff",
                                }}
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    color: "#a0aec0",
                                }}>
                                👁️
                            </span>
                        </div>
                    </div>

                    {/* 登録するボタン */}
                    <div style={{ marginTop: "10px" }}>
                        <TempButton
                            text={isLoading ? "登録中..." : "登録する"}
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "12px",
                            }}
                        />
                    </div>
                </form>

                {/* 区切り線（または） */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "24px 0",
                        color: "#a0aec0",
                        fontSize: "12px",
                    }}>
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            backgroundColor: "#e2e8f0",
                        }}></div>
                    <span style={{ padding: "0 12px" }}>または</span>
                    <div
                        style={{
                            flex: 1,
                            height: "1px",
                            backgroundColor: "#e2e8f0",
                        }}></div>
                </div>

                {/* SNS連携ボタン群 */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginBottom: "32px",
                    }}>
                    <GoogleLoginButton onSuccess={onRegisterSuccess} />
                </div>

                {/* 既存アカウントへのログイン誘導 */}
                <div
                    style={{
                        textAlign: "center",
                        marginTop: "auto",
                        fontSize: "13px",
                        color: "#7f8c8d",
                    }}>
                    アカウントをお持ちですか？{" "}
                    <span
                        onClick={onNavigateToLogin}
                        style={{
                            color: "#2f80ed",
                            fontWeight: "600",
                            cursor: "pointer",
                        }}>
                        ログイン
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Register;
