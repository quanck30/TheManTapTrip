//
//  CommonComponets.swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/06/26.
//

import SwiftUI

// ログインや登録画面で使う共通入力部品。
struct AuthTextField: View {
    
    let title: String
    let placeholder: String
    let icon: String
    
    @Binding var text: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            
            // 入力欄の上に表示するラベル。
            Text(title)
                .font(.caption)
                .foregroundColor(.cyan)
            
            HStack {
                // 入力内容に合わせた左アイコン。
                Image(systemName: icon)
                    .foregroundColor(.gray)
                
                // 親画面のStateとBindingでつながる入力欄。
                TextField(placeholder, text: $text)
            }
            .padding()
            .background(Color(.secondarySystemBackground))
            .cornerRadius(12)
        }
    }
}

struct PasswordField: View {
    
    let title: String
    
    @Binding var password: String
    
    @State private var isSecure = true
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            
            // パスワード欄のラベル。
            Text(title)
                .font(.caption)
                .foregroundColor(.cyan)
            
            HStack {
                
                Image(systemName: "lock")
                    .foregroundColor(.gray)
                
                // 目のボタンの状態に合わせて表示/非表示を切り替える。
                if isSecure {
                    SecureField("パスワード", text: $password)
                } else {
                    TextField("パスワード", text: $password)
                }
                
                Button {
                    // パスワードの見える/見えないを切り替える。
                    isSecure.toggle()
                } label: {
                    Image(systemName: isSecure ? "eye.slash" : "eye")
                        .foregroundColor(.gray)
                }
            }
            .padding()
            .background(Color(.secondarySystemBackground))
            .cornerRadius(12)
        }
    }
}

struct SocialButton: View {
    
    let title: String
    let image: String
    var background: Color = Color(.secondarySystemBackground)
    var foreground: Color = Color(.label)
    
    var body: some View {
        
        Button {
            
        } label: {
            
            // Googleなどの外部ログインボタンの見た目だけを共通化する。
            HStack {
                Spacer()
                
                Image(systemName: image)
                
                Text(title)
                    .fontWeight(.medium)
                
                Spacer()
            }
            .frame(height: 54)
            .background(background)
            .foregroundColor(foreground)
            .cornerRadius(14)
        }
    }
}
