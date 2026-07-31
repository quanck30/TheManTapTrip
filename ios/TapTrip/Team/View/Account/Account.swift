//
//  Favorite.swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/06/30.
//

import SwiftUI

private enum AccountRoute: Hashable {
    case login
    case register
    case notificationSettings
}

// アカウントタブで、ログインが必要な状態を表示する画面。
struct AccountRequiredView: View {
    
    @EnvironmentObject private var authSession: AuthSession
    @State private var navigationPath: [AccountRoute] = []
    
    var body: some View {
        NavigationStack(path: $navigationPath) {
            Group {
                if authSession.isRestoring {
                    ScrollView {
                        ProgressView("ログイン状態を確認中...")
                            .frame(maxWidth: .infinity, minHeight: 220)
                            .padding()
                    }
                } else if authSession.isAuthenticated {
                    AccountView()
                } else {
                    ScrollView {
                        // 未ログインの間はログイン案内だけを表示する。
                        LoginRequiredView {
                            showLogin()
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("アカウント")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                if !authSession.isRestoring && !authSession.isAuthenticated {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button {
                            navigationPath.append(.notificationSettings)
                        } label: {
                            Image(systemName: "bell")
                        }
                    }
                }
            }
            .navigationDestination(for: AccountRoute.self) { route in
                switch route {
                case .login:
                    LoginView {
                        showRegistration()
                    }
                case .register:
                    RegisterView(
                        onRegistrationSuccess: returnToAccount,
                        onShowLogin: showLogin
                    )
                case .notificationSettings:
                    NotificationSettingsView()
                }
            }
            .onChange(of: authSession.accountNavigationID) { _, navigationID in
                guard navigationID != nil else { return }
                // 認証後は履歴をすべて消してアカウント画面へ戻す。
                returnToAccount()
            }
        }
    }

    private func showLogin() {
        // 作成画面から何度押しても、ログイン画面を重複させない。
        navigationPath = [.login]
    }

    private func showRegistration() {
        // 作成画面の戻り先が必ずログイン画面になる固定履歴を作る。
        navigationPath = [.login, .register]
    }

    private func returnToAccount() {
        navigationPath.removeAll()
    }
}

#Preview {
    AccountRequiredView()
    .environmentObject(AuthSession())
}
