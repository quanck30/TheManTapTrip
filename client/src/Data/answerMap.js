/**
 * @brief 質問の回答をAPIに送信する際の値のマッピング
 * @Author J.Naka
 * @Date 26/06/16
 * @Update 26/06/16
 */

export const apiValueMapping = {
    // 1: 子供と一緒に行くか？ (1=はい, 2=いいえ)
    1: { 1: true, 2: false },

    // 2: 移動手段 (1=徒歩, 2=自転車, 3=車, 4=公共交通機関)
    2: { 1: "walking", 2: "cycling", 3: "driving", 4: "transit" },

    // 3: 屋内外 (1=屋内, 2=屋外, 3=どちらでも)
    3: { 1: "indoor", 2: "outdoor", 3: "any" },

    // 4: 目的 (1=食事, 2=文化, 3=レジャー, 4=観光)
    4: { 1: "dining", 2: "culture", 3: "leisure", 4: "other" },

    // 5: 予算 (1=無料, 2=安い, 3=普通, 4=高い)
    5: { 1: "free", 2: "cheap", 3: "moderate", 4: "expensive" },
};

export const defaultRadiusMapping = {
    walking: 1000,
    cycling: 2000,
    transit: 3000,
    driving: 5000,
};
