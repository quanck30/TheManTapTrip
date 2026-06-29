/**
 * 検索結果・スポット表示用のモックデータ
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
