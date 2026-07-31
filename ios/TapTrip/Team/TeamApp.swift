//
//  TeamApp.swift
//  Team
//
//  Created by 竹原昊生 on 2026/06/28.
//

import SwiftUI

// アプリ起動時に共有データを用意して最初の画面を表示する場所。
@main
struct TeamApp: App {
    
    // 最新のおすすめ結果を全画面から使えるように持つ。
    @StateObject
    private var searchResultStore = SearchResultStore()
    
    // 保存済みスポットを全画面から使えるように持つ。
    @StateObject
    private var favoriteSpotStore = FavoriteSpotStore()

    // 行き済みスポットを全画面から使えるように持つ。
    @StateObject
    private var visitedSpotStore = VisitedSpotStore()

    // ログイン中ユーザーとSanctumセッションを全画面で共有する。
    @StateObject
    private var authSession = AuthSession()
    
    var body: some Scene {
        WindowGroup {
            // ルート画面に共有データを渡す。
            ContentView()
                .environmentObject(searchResultStore)
                .environmentObject(favoriteSpotStore)
                .environmentObject(visitedSpotStore)
                .environmentObject(authSession)
                .task {
                    await authSession.restore()
                }
                .onOpenURL { url in
                    _ = GoogleSignInService.shared.handle(url: url)
                }
        }
    }
}
