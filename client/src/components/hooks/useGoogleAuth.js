/**
 * @brief
 * @Author J.Naka
 * @Date 26/06/02
 * @Update
 */

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { authService } from "../../Services/authService";

/**
 *
 */
export const useGoogleAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await authService.googleLogin(
                    tokenResponse.access_token,
                );
                const { token, user } = result;
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        },

        onError: (err) => {
            console.error("Google login error:", err);
            setError(err.message);
        },
    });

    return { login, isLoading, error };
};
