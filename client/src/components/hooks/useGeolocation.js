/**
 * @brief Webから現在地の取得を行うカスタムフック
 * @Author J.Naka
 * @Date 26/06/02
 * @Update
 */

import { useState } from "react";

/**
 *
 */
export const useGeolocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getLocation = () => {
        // 現在地を取得できる状態か判定
        if (!navigator.geolocation) {
            setError("お使いの端末が位置情報に対応していません。");
            return;
        }

        setIsLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setIsLoading(false);
            },
            (err) => {
                setError(
                    "位置情報の取得の許可、または通信環境を確認してください。",
                );
                setIsLoading(false);
            },
        );
    };

    return { location, error, isLoading, getLocation };
};
