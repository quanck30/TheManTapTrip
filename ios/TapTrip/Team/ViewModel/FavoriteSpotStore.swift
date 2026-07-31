import Foundation
import Combine

// 保存済みスポットを端末内に保存し、画面へ共有する場所。
@MainActor
final class FavoriteSpotStore: ObservableObject {
    
    private let storageKey = "favoriteSpots"
    
    @Published private(set) var spots: [Spot] = []
    
    init() {
        // アプリ起動時に、端末内に保存したスポットを復元する。
        guard let data = UserDefaults.standard.data(forKey: storageKey),
              let spots = try? JSONDecoder().decode([Spot].self, from: data) else {
            return
        }
        
        self.spots = spots
    }
    
    func contains(_ spot: Spot) -> Bool {
        // ハートや保存ボタンの表示切り替えに使う。
        spots.contains { $0.spotId == spot.spotId }
    }
    
    func toggle(_ spot: Spot) {
        // すでに保存済みなら削除、未保存なら先頭に追加する。
        if let index = spots.firstIndex(where: { $0.spotId == spot.spotId }) {
            spots.remove(at: index)
        } else {
            spots.insert(spot, at: 0)
        }
        
        save()
    }
    
    private func save() {
        // 保存済みリストをJSONにして端末内へ残す。
        guard let data = try? JSONEncoder().encode(spots) else {
            return
        }
        
        UserDefaults.standard.set(data, forKey: storageKey)
    }
}
