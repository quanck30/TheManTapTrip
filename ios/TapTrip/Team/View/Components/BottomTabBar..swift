//
//  BottomTabBar..swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/06/26.
//

import SwiftUI

// 旧デザインの下タブバー用コンポーネント。
struct BottomTabBar: View {
    
    var body: some View {
        
        HStack {
            
            Spacer()
            
            // ホーム。
            VStack {
                Image(systemName: "house")
                Text("ホーム")
            }
            
            Spacer()
            
            // 探索。
            VStack {
                Image(systemName: "location.circle.fill")
                Text("探索")
            }
            
            Spacer()
            
            // 保存済み。
            VStack {
                Image(systemName: "bookmark")
                Text("保存済み")
            }
            
            Spacer()
            
            // アカウント。
            VStack {
                Image(systemName: "person")
                Text("アカウント")
            }
            
            Spacer()
        }
        .font(.caption)
        .padding(.top,10)
    }
}
