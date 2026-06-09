/**
 * @brief Google連携のログインボタン
 * @Author J.Naka
 * @Date 26/06/05
 * @Update
 */

import TempButton from "./TempButton.jsx";
import { useGoogleAuth } from "../hooks/useGoogleAuth.js";

/**
 * Googleログイン用のボタンコンポーネント
 */
export const GoogleLoginButton = ({ onSuccess }) => {
    // Google hookから必要な機能と状態を受け取る
    const { login, isLoading, error } = useGoogleAuth({
        onSuccessCallback: onSuccess,
    });

    return (
        <TempButton
            text="Googleでログイン"
            onClick={() => login()}
            disabled={isLoading}
            error={error}
        />
    );
};

export default GoogleLoginButton;
