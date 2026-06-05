// Canvaの設計図に基づいた診断質問データ
export const diagnosticQuestions = [
  {
    id: 1,
    question: "子供と一緒に行きますか？",
    options: ["はい、子連れです", "いいえ、大人だけです"]
  },
  {
    id: 2,
    question: "移動手段は何にしますか？",
    options: ["徒歩・自転車", "車・バイク", "公共交通機関"]
  },
  {
    id: 3,
    question: "屋内と屋外はどちらがいいですか？",
    options: ["屋内施設", "屋外・自然", "どっちでもいい"]
  },
  {
    id: 4,
    question: "目的地で何をしたいですか？",
    options: ["食事・カフェ", "博物館・カルチャー", "レジャー・軽い散歩・観光"]
  },
  {
    id: 5,
    question: "予算はいくらですか？",
    options: ["無料・格安", "松（〜1,000円）", "竹（〜3,000円）", "梅（3,000円〜）"]
  }
];

// Figmaのデザインに基づいた最新のスポットデータ
export const mockSpots = [
  {
    id: "spot-1",
    displayName: { text: "バックダン公園" },
    formattedAddress: "ホーチミン市 1区 リバーサイド",
    distance: "1.2 km",
    priceLevel: "無料",
    rating: 4.5,
    editorialSummary: { text: "週末の散歩やリラックスに最適なリバーサイドの治安の良い公園です。" },
    photos: [{ name: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" }],
    tags: ["徒歩", "リバーサイド", "静か", "フィットスポット"],
    reasons: ["開放的な屋外スペース", "1〜2時間の滞在に最適", "ショッピングモールより静か"],
    timeZones: {
      cool: "夕方の涼しい時間",
      night: "19:00 以降"
    }
  },
  {
    id: "spot-2",
    displayName: { text: "サイゴン中央郵便局" },
    formattedAddress: "ホーチミン市 1区",
    distance: "2.5 km",
    priceLevel: "観光無料",
    rating: 4.6,
    editorialSummary: { text: "フランス植民地時代の美しい建築が残る、歴史的な観光スポット。" },
    photos: [{ name: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600" }],
    tags: ["公共交通", "屋内施設", "歴史建築", "観光"],
    reasons: ["雨の日でも安心な屋内", "写真映えするレトロな空間", "お土産ショップ併設"],
    timeZones: {
      cool: "午前中の比較的空いている時間",
      night: "17:00まで営業"
    }
  }
];