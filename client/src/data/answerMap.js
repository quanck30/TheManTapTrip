/**
 * @brief 質問の回答をAPIに送信する際の値のマッピング
 * @Author J.Naka
 * @Date 26/06/16
 * @Update 26/06/16
 */

export const queConf = {
    // 1: 子供と一緒に行くか？ (1=はい, 2=いいえ)
    1: {
        apiKey: "withChildren",
        values: { 1: true, 2: false },
        default: false,
    },

    // 2: 移動手段 (1=徒歩, 2=自転車, 3=車, 4=公共交通機関)
    2: {
        apiKey: "travelMode",
        values: { 1: "walk", 2: "bicycle", 3: "drive", 4: "" },
        default: "walk",
    },

    // 3: 屋内外 (1=屋内, 2=屋外, 3=どちらでも)
    3: {
        apiKey: "locationType",
        values: { 1: "indoor", 2: "outdoor", 3: "any" },
        default: "any",
    },

    // 4: 目的 (1=食事, 2=文化, 3=レジャー, 4=観光)
    4: {
        apiKey: "purpose",
        values: { 1: "eat", 2: "play", 3: "sightsee", 4: "shop", 5: "relax" },
        default: "play",
    },

    // 5: 予算 (1=無料, 2=安い, 3=普通, 4=高い)
    5: {
        apiKey: "priceLevel",
        values: { 1: "free", 2: "cheap", 3: "moderate", 4: "expensive" },
        default: "free",
    },
};

export const defaultRadMap = {
    walk: 1000,
    bicycle: 2000,
    drive: 5000,
};
