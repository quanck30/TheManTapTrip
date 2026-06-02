/**
 * @brief
 * @Author J.Naka
 * @Date 26/06/02
 * @Update
 */

/**
 *
 */
export const authService = {
    googleLogin: async (accessToken) => {
        const response = await fetch(`/api/auth/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            // Laravel側の$request->access_tokenで持ってるキーと合わせる
            body: JSON.stringify({ access_token: accessToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "login failed at Server");
        }

        return data;
    },
};
