//
//  Favorite.swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/06/30.
//

import SwiftUI

// 保存済みスポットの一覧と絞り込みを表示する画面。
struct FavoriteView: View {
    
    @EnvironmentObject private var favoriteSpotStore: FavoriteSpotStore
    
    @State private var showsFilterSheet = false
    @State private var searchText = ""
    @State private var selectedTag: String?
    @State private var priceFilter: FavoritePriceFilter = .all
    @State private var sortOption: FavoriteSortOption = .saved
    @State private var onlyHighRating = false
    @State private var onlyChildren = false
    @State private var onlyParking = false
    
    var body: some View {
        Group {
            // 保存が1件もない時の空状態。
            if favoriteSpotStore.spots.isEmpty {
                ContentUnavailableView(
                    "保存済みの場所がありません",
                    systemImage: "bookmark",
                    description: Text("詳細画面のハートを押すと、ここに表示されます。")
                )
            // 保存はあるが絞り込み条件に合わない時の空状態。
            } else if filteredSpots.isEmpty {
                ContentUnavailableView(
                    "条件に合う場所がありません",
                    systemImage: "line.3.horizontal.decrease.circle",
                    description: Text("絞り込み条件を変更してください。")
                )
            // 絞り込み後のスポットだけをカードで表示する。
            } else {
                ScrollView {
                    LazyVStack(spacing: 20) {
                        ForEach(filteredSpots) { spot in
                            SpotCard(spot: spot, showsMatchScore: false)
                        }
                    }
                    .padding(.vertical)
                }
                .background(Color(.systemGroupedBackground))
            }
        }
        .navigationTitle("保存済み")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: Spot.self) { spot in
            SpotDetailView(spot: spot)
        }
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    // 右上ボタンから絞り込みシートを開く。
                    showsFilterSheet = true
                } label: {
                    Image(systemName: hasActiveFilter ? "line.3.horizontal.decrease.circle.fill" : "line.3.horizontal.decrease.circle")
                }
            }
        }
        .sheet(isPresented: $showsFilterSheet) {
            // 絞り込み条件は親画面のStateとBindingで共有する。
            FavoriteFilterSheet(
                searchText: $searchText,
                selectedTag: $selectedTag,
                priceFilter: $priceFilter,
                sortOption: $sortOption,
                onlyHighRating: $onlyHighRating,
                onlyChildren: $onlyChildren,
                onlyParking: $onlyParking,
                availableTags: availableTags,
                onReset: resetFilters
            )
            .presentationDetents([.medium, .large])
        }
    }
    
    private var filteredSpots: [Spot] {
        // まず各条件に合う保存済みスポットだけを残す。
        var spots = favoriteSpotStore.spots.filter { spot in
            matchesSearch(spot)
            && matchesTag(spot)
            && matchesPrice(spot)
            && matchesHighRating(spot)
            && matchesChildren(spot)
            && matchesParking(spot)
        }
        
        // 絞り込んだ後に、選ばれた並び順へ並び替える。
        switch sortOption {
        case .saved:
            break
        case .rating:
            spots.sort { ($0.rating ?? 0) > ($1.rating ?? 0) }
        case .name:
            spots.sort { $0.sName.localizedStandardCompare($1.sName) == .orderedAscending }
        }
        
        return spots
    }
    
    private var availableTags: [String] {
        // 保存済みスポットに含まれるタグを重複なしで一覧化する。
        let tags = favoriteSpotStore.spots.flatMap(\.displayTags)
        return Array(Set(tags)).sorted()
    }
    
    private var hasActiveFilter: Bool {
        // 条件が1つでも変わっていれば、右上アイコンを塗りつぶしにする。
        !searchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        || selectedTag != nil
        || priceFilter != .all
        || sortOption != .saved
        || onlyHighRating
        || onlyChildren
        || onlyParking
    }
    
    private func matchesSearch(_ spot: Spot) -> Bool {
        // 名前・住所・種類・説明・タグをまとめてキーワード検索する。
        let keyword = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
        
        guard !keyword.isEmpty else {
            return true
        }
        
        let target = [
            spot.sName,
            spot.address,
            spot.primaryType ?? "",
            spot.summary ?? "",
            spot.types.joined(separator: " ")
        ]
        .joined(separator: " ")
        
        return target.localizedCaseInsensitiveContains(keyword)
    }
    
    private func matchesTag(_ spot: Spot) -> Bool {
        // タグ未選択ならすべて通し、選択中なら一致するものだけ残す。
        guard let selectedTag else {
            return true
        }
        
        return spot.displayTags.contains(selectedTag)
    }
    
    private func matchesPrice(_ spot: Spot) -> Bool {
        // priceLevelの有無と無料判定で、無料/金額ありを切り替える。
        switch priceFilter {
        case .all:
            return true
        case .free:
            return spot.isFree
        case .priced:
            guard let priceLevel = spot.priceLevel, !priceLevel.isEmpty else {
                return false
            }
            
            return !spot.isFree
        }
    }
    
    private func matchesHighRating(_ spot: Spot) -> Bool {
        // 評価条件がONの時だけ4.0以上に絞る。
        !onlyHighRating || (spot.rating ?? 0) >= 4
    }
    
    private func matchesChildren(_ spot: Spot) -> Bool {
        // 子ども向け条件は、子どもOKまたは子どもメニューで判定する。
        !onlyChildren || spot.goodForChildren == true || spot.menuForChildren == true
    }
    
    private func matchesParking(_ spot: Spot) -> Bool {
        // 駐車場条件がONの時だけ駐車場ありに絞る。
        !onlyParking || spot.hasParking == true
    }
    
    private func resetFilters() {
        // シート内のリセットボタンから全条件を初期値へ戻す。
        searchText = ""
        selectedTag = nil
        priceFilter = .all
        sortOption = .saved
        onlyHighRating = false
        onlyChildren = false
        onlyParking = false
    }
}

private enum FavoritePriceFilter: String, CaseIterable, Identifiable {
    case all = "すべて"
    case free = "無料"
    case priced = "金額あり"
    
    var id: String {
        rawValue
    }
}

private enum FavoriteSortOption: String, CaseIterable, Identifiable {
    case saved = "保存順"
    case rating = "評価"
    case name = "名前"
    
    var id: String {
        rawValue
    }
}

private struct FavoriteFilterSheet: View {
    
    @Environment(\.dismiss) private var dismiss
    
    @Binding var searchText: String
    @Binding var selectedTag: String?
    @Binding var priceFilter: FavoritePriceFilter
    @Binding var sortOption: FavoriteSortOption
    @Binding var onlyHighRating: Bool
    @Binding var onlyChildren: Bool
    @Binding var onlyParking: Bool
    
    let availableTags: [String]
    let onReset: () -> Void
    
    var body: some View {
        NavigationStack {
            Form {
                // 場所名や住所などの文字で絞り込む。
                Section("キーワード") {
                    TextField("場所名・住所・タグで検索", text: $searchText)
                }
                
                // 保存順・評価・名前の並び替えを選ぶ。
                Section("並び替え") {
                    Picker("並び順", selection: $sortOption) {
                        ForEach(FavoriteSortOption.allCases) { option in
                            Text(option.rawValue).tag(option)
                        }
                    }
                }
                
                // 無料か金額ありかを大まかに絞る。
                Section("金額") {
                    Picker("金額", selection: $priceFilter) {
                        ForEach(FavoritePriceFilter.allCases) { filter in
                            Text(filter.rawValue).tag(filter)
                        }
                    }
                    .pickerStyle(.segmented)
                }
                
                // 保存済みに存在するタグだけを選択肢として出す。
                if !availableTags.isEmpty {
                    Section("タグ") {
                        Picker("タグ", selection: $selectedTag) {
                            Text("すべて").tag(String?.none)
                            
                            ForEach(availableTags, id: \.self) { tag in
                                Text(tag).tag(Optional(tag))
                            }
                        }
                    }
                }
                
                // APIから取れている属性で追加条件を絞る。
                Section("条件") {
                    Toggle("評価4.0以上", isOn: $onlyHighRating)
                    Toggle("子ども向け", isOn: $onlyChildren)
                    Toggle("駐車場あり", isOn: $onlyParking)
                }
                
                // すべての条件を初期状態に戻す。
                Section {
                    Button("絞り込みをリセット", role: .destructive) {
                        onReset()
                    }
                }
            }
            .navigationTitle("絞り込み")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("完了") {
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    NavigationStack {
        FavoriteView()
    }
    .environmentObject(SearchResultStore())
    .environmentObject(FavoriteSpotStore())
    .environmentObject(VisitedSpotStore())
}
