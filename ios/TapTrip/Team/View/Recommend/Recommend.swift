import SwiftUI

// 質問結果から見つかったおすすめスポットを一覧表示する画面。
struct RecommendView: View {
    
    @EnvironmentObject
    private var searchResultStore: SearchResultStore
    
    var body: some View {
        
        Group {
            // 検索結果がある場合はカード一覧として表示する。
            if searchResultStore.hasResults {
                ScrollView {
                    
                    LazyVStack(spacing: 20) {
                        
                        ForEach(searchResultStore.places) { spot in
                            SpotCard(spot: spot)
                        }
                        
                    }
                    .padding(.vertical)
                }
                .background(Color(.systemGroupedBackground))
            // まだ検索していない時と、検索結果0件の時で文言を分ける。
            } else {
                ContentUnavailableView(
                    searchResultStore.hasSearched ? "条件に合う場所がありません" : "まだおすすめがありません",
                    systemImage: "sparkles",
                    description: Text(
                        searchResultStore.hasSearched
                        ? "もう一度質問に答えると、おすすめを更新できます。"
                        : "質問に答えると、検索結果がおすすめに表示されます。"
                    )
                )
            }
        }
        .navigationTitle("あなたへのおすすめ")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: Spot.self) { spot in
            SpotDetailView(spot: spot)
        }
    }
}

#Preview {
    NavigationStack {
        RecommendView()
    }
    .environmentObject(SearchResultStore())
}
