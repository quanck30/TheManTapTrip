/**
 * 診断質問データ
 * 質問ID、質問文、および選択肢(queryItems)を定義
 */
export const diagnosticQuestions = [
  {
    id: "q1",
    title: "子供と一緒に行きますか？",
    queryItems: [
      { id: "i1-1", title: "はい、子連れです" },
      { id: "i1-2", title: "いいえ、大人だけです" }
    ]
  },
  {
    id: "q2",
    title: "移動手段は何にしますか？",
    queryItems: [
      { id: "i2-1", title: "徒歩・自転車" },
      { id: "i2-2", title: "車・バイク" },
      { id: "i2-3", title: "公共交通機関" }
    ]
  },
  {
    id: "q3",
    title: "屋内と屋外はどちらがいいですか？",
    queryItems: [
      { id: "i3-1", title: "屋内施設" },
      { id: "i3-2", title: "屋外・自然" },
      { id: "i3-3", title: "どっちでもいい" }
    ]
  },
  {
    id: "q4",
    title: "目的地で何をしたいですか？",
    queryItems: [
      { id: "i4-1", title: "食事・カフェ" },
      { id: "i4-2", title: "博物館・カルチャー" },
      { id: "i4-3", title: "レジャー・軽い散歩・観光" }
    ]
  },
  {
    id: "q5",
    title: "予算はいくらですか？",
    queryItems: [
      { id: "i5-1", title: "無料・格安" },
      { id: "i5-2", title: "松（〜1,000円）" },
      { id: "i5-3", title: "竹（〜3,000円）" },
      { id: "i5-4", title: "梅（3,000円〜）" }
    ]
  }
];





/**
 * 検索結果・スポット表示用データ
 */
export const mockSpots = [
  {
    id: "spot-1",
    displayName: { text: "バックダン公園" },
    editorialSummary: { text: "リバーサイドの静かな公園。" },
    rating: 4.5,
    types: ["公園"],
    photos: [
      { flagUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" }
    ],
    matchScore: 95
  },
  {
    id: "spot-2",
    displayName: { text: "サイゴン中央郵便局" },
    editorialSummary: { text: "歴史的な建築物。" },
    rating: 4.6,
    types: ["歴史建築"],
    photos: [
      { flagUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600" }
    ],
    matchScore: 82
  }
];