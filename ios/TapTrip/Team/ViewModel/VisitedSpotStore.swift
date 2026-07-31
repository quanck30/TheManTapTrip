import Combine
import Foundation

// 行き済みスポットを端末内に保存し、画面へ共有する場所。
@MainActor
final class VisitedSpotStore: ObservableObject {
    private let storageKey = "visitedSpots"

    @Published private(set) var spots: [Spot] = []

    init() {
        guard let data = UserDefaults.standard.data(forKey: storageKey),
              let spots = try? JSONDecoder().decode([Spot].self, from: data) else {
            return
        }

        self.spots = spots
    }

    func contains(_ spot: Spot) -> Bool {
        spots.contains { $0.spotId == spot.spotId }
    }

    func toggle(_ spot: Spot) {
        if let index = spots.firstIndex(where: { $0.spotId == spot.spotId }) {
            spots.remove(at: index)
        } else {
            spots.insert(spot, at: 0)
        }

        save()
    }

    private func save() {
        guard let data = try? JSONEncoder().encode(spots) else {
            return
        }

        UserDefaults.standard.set(data, forKey: storageKey)
    }
}
