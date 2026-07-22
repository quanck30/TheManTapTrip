/**
 * @brief Webから現在地の取得を行うカスタムフック
 * @Author J.Naka
 * @Date 26/06/02
 * @Update
 */

import { useState } from "react";

/**
 * 現在地取得フック
 * status: "idle" | "loading" | "granted" | "denied" | "unsupported"
 *  - denied: ユーザーが拒否／ブラウザ設定でブロック（再試行してもプロンプトが出ない場合を含む）
 *  - unsupported: 端末/ブラウザが Geolocation 非対応
 */
export const useGeolocation = () => {
    const [location, setLocation] = useState(sessionStorage.getItem("location") ? JSON.parse(sessionStorage.getItem("location")) : null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("idle");

    const getLocation = () => {
        // 現在地を取得できる状態か判定
        if (!navigator.geolocation) {
            setStatus("unsupported");
            setError("お使いの端末が位置情報に対応していません。");
            return;
        }

        setStatus("loading");
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                sessionStorage.setItem("location", JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude }));
                setStatus("granted");
            },
            (err) => {
                // PERMISSION_DENIED(1) はユーザー拒否／ブラウザ設定ブロック
                setStatus("denied");
                setError(
                    err.code === err.PERMISSION_DENIED
                        ? "位置情報の利用が拒否されています。ブラウザの設定から許可してください。"
                        : "位置情報の取得の許可、または通信環境を確認してください。",
                );
            },
        );
    };

    // isLoading は後方互換のため status から算出して返す
    return { location, error, status, isLoading: status === "loading", getLocation };
};
