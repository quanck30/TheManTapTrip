
//
//  Tab.swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/06/24.
//

import SwiftUI

// アプリ全体のタブ構成をまとめる画面。
struct ContentView: View {
    @EnvironmentObject private var authSession: AuthSession
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            
            // ホームでは質問画面を表示し、検索完了時におすすめタブへ移動する。
            HomeTabView {
                selectedTab = 1
            }
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("ホーム")
                }
                .tag(0)
            
            // 質問結果を保持して表示するおすすめタブ。
            MyPageTabView()
                .tabItem {
                    Image(systemName: "star.fill")
                    Text("おすすめ")
                }
                .tag(1)
            
            // ユーザーが保存したスポットを見るタブ。
            CartTabView()
                .tabItem {
                    Image(systemName: "bookmark.fill")
                    Text("保存済み")
                }
                .tag(2)
            
            // ログイン・アカウント関連のタブ。
            ShortcutTabView()
                .tabItem {
                    Image(systemName: "person.fill")
                    Text("アカウント")
                }
                .tag(3)
        }
        .onChange(of: authSession.accountNavigationID) { _, navigationID in
            guard navigationID != nil else { return }
            // Googleログイン・メールログイン・新規登録の成功後はアカウント画面を表示する。
            selectedTab = 3
        }
    }
}

//画面表示部分
struct HomeTabView: View {
    
    var onShowRecommendations: () -> Void = {}
    
    var body: some View {
        // 質問画面をNavigationStack内で表示する。
        NavigationStack {
            QuestionView(onSearchFinished: onShowRecommendations)
        }
    }
}

struct MyPageTabView: View {
    var body: some View {
        // おすすめ一覧と詳細画面への遷移を扱う。
        NavigationStack {
//            Text("おすすめ")
//                .navigationTitle("おすすめ")
            RecommendView()
        }
    }
}

struct CartTabView: View {
    var body: some View {
        // 保存済み一覧と詳細画面への遷移を扱う。
        NavigationStack {
            FavoriteView()
        }
    }
}

struct ShortcutTabView: View {
    var body: some View {
        // 認証画面の履歴はAccountRequiredViewで一元管理する。
        AccountRequiredView()
    }
}




#Preview {
    ContentView()
        .environmentObject(SearchResultStore())
        .environmentObject(FavoriteSpotStore())
        .environmentObject(VisitedSpotStore())
        .environmentObject(AuthSession())
}
