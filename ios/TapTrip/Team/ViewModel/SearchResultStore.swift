//
//  SearchResultStore.swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/07/03.
//

import Foundation
import Combine

// 最新の検索結果を保存し、おすすめ画面へ渡す場所。
@MainActor
final class SearchResultStore: ObservableObject {
    
    private let storageKey = "latestPlaceSearchResults"
    
    @Published private(set) var places: [Spot] = []
    @Published private(set) var hasSearched = false
    
    var hasResults: Bool {
        !places.isEmpty
    }
    
    init() {
        // アプリを閉じても前回のおすすめが残るように読み込む。
        guard let data = UserDefaults.standard.data(forKey: storageKey),
              let places = try? JSONDecoder().decode([Spot].self, from: data) else {
            return
        }
        
        self.places = places
        hasSearched = true
    }
    
    func update(with places: [Spot]) {
        // 新しい検索結果を画面表示用と保存用の両方に反映する。
        self.places = places
        hasSearched = true
        save()
    }
    
    private func save() {
        // Spot配列をJSONにしてUserDefaultsへ保存する。
        guard let data = try? JSONEncoder().encode(places) else {
            return
        }
        
        UserDefaults.standard.set(data, forKey: storageKey)
    }
    
}
