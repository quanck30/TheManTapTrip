export const mockSpots = [
  {
    id: "spot-1",
    displayName: { text: "バクダン公園" },
    editorialSummary: { text: "リバーサイドの静かな公園。" },
    rating: 4.5,
    types: ["公園"],
    distance: "1.2 km",
    tags: ["リバーサイド", "散歩"],
    categories: ["weekend", "walk"],
    photos: [
      { flagUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" }
    ],
    matchScore: 95
  },
  // ...既存の他データにも同様に distance / tags / categories を追加
];