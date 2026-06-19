/**
 * {}
 * @brief 検索結果の情報を表示する
 * @Author J.Naka
 * @Date 26/06/12
 * @Update 26/06/12
 */

import React from "react";

// 1つのスポット情報を受け取る
const SpotCard = ({ spot }) => {
    return (
        <div
            style={{
                padding: "15px",
                border: "1px solid #ccc",
                marginBottom: "10px",
                borderRadius: "8px",
            }}>
            <h4 style={{ margin: "0 0 10px 0" }}>{spot.name}</h4>
            <p style={{ margin: "0 0 5px 0" }}>
                <strong>住所:</strong> {spot.address}
            </p>
            {/* APIのレスポンスに他の情報（評価、写真など）があればここに追加 */}
        </div>
    );
};

export default SpotCard;
