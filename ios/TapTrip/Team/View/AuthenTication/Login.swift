import SwiftUI

// メールとパスワードでログインする画面。
struct LoginView: View {
    
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var authSession: AuthSession

    var onShowRegistration: () -> Void = {}
    
    @State private var email = ""
    @State private var password = ""
    @State private var isSecure = true
    @State private var isLoggingIn = false
    @State private var isLoggingInWithGoogle = false
    @State private var errorMessage: String?
    
    var body: some View {
        ZStack {
                
                // 登録画面と同じ背景グラデーション。
                LinearGradient(
                    colors: [
                        colorScheme == .dark
                        ? Color(.systemBackground)
                        : Color(red: 0.94, green: 0.97, blue: 1.0),
                        colorScheme == .dark
                        ? Color(.secondarySystemBackground)
                        : Color(red: 0.90, green: 0.96, blue: 0.95)
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()
                
                ScrollView {
                    
                    VStack(alignment: .leading, spacing: 24) {
                        
                        // ブランド名とログイン画面の説明。
                        VStack(alignment: .leading, spacing: 8) {
                            
                            Text("TapTrip")
                                .fontWeight(.bold)
                            
                            Spacer()
                                .frame(height: 30)
                            
                            Text("お帰りなさい")
                                .font(.system(size: 42))
                                .fontWeight(.medium)
                            
                            Text("ログインして、TapTripであなた好みの旅を見つけましょう。")
                                .foregroundColor(.secondary)
                        }
                        
                        // メールとパスワードの入力カード。
                        VStack(alignment: .leading, spacing: 18) {
                            
                            Text("メールアドレスまたは電話番号")
                                .font(.caption)
                                .foregroundColor(.cyan)
                            
                            HStack {
                                Image(systemName: "person")
                                    .foregroundColor(.gray)
                                
                                TextField(
                                    "メールアドレスを入力...",
                                    text: $email
                                )
                                .keyboardType(.emailAddress)
                                .textInputAutocapitalization(.never)
                                .textContentType(.emailAddress)
                                .autocorrectionDisabled()
                            }
                            .padding()
                            .background(Color(.secondarySystemBackground))
                            .cornerRadius(14)
                            
                            // パスワードは表示/非表示を切り替えられる。
                            Text("パスワード")
                                .font(.caption)
                                .foregroundColor(.cyan)
                            
                            HStack {
                                
                                Image(systemName: "lock")
                                    .foregroundColor(.gray)
                                
                                if isSecure {
                                    SecureField(
                                        "パスワードを入力...",
                                        text: $password
                                    )
                                    .textContentType(.password)
                                } else {
                                    TextField(
                                        "パスワードを入力...",
                                        text: $password
                                    )
                                    .textInputAutocapitalization(.never)
                                }
                                
                                Button {
                                    isSecure.toggle()
                                } label: {
                                    Image(systemName:
                                            isSecure
                                          ? "eye.slash"
                                          : "eye"
                                    )
                                }
                                .foregroundColor(.gray)
                            }
                            .padding()
                            .background(Color(.secondarySystemBackground))
                            .cornerRadius(14)

                            if let errorMessage {
                                Label(errorMessage, systemImage: "exclamationmark.triangle.fill")
                                    .font(.footnote)
                                    .foregroundStyle(.red)
                                    .fixedSize(horizontal: false, vertical: true)
                            }
                            
                            HStack {
                                Spacer()
                                
                                // パスワード再設定はまだ処理未接続。
                                Button("パスワードをお忘れですか？") {
                                    
                                }
                                .font(.footnote)
                            }
                            
                            Button {
                                Task {
                                    await login()
                                }
                            } label: {
                                
                                HStack(spacing: 10) {
                                    if isLoggingIn {
                                        ProgressView()
                                            .tint(.black)
                                    }

                                    Text(isLoggingIn ? "ログイン中..." : "ログイン")
                                }
                                    .font(.title3)
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 56)
                                    .background(
                                        Color(
                                            red: 0.46,
                                            green: 0.79,
                                            blue: 0.95
                                        )
                                    )
                                    .foregroundColor(.black)
                                    .cornerRadius(16)
                            }
                            .disabled(!canLogin || isLoggingIn)
                            .opacity(canLogin ? 1 : 0.55)
                        }
                        .padding()
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(24)
                        .overlay(
                            RoundedRectangle(cornerRadius: 24)
                                .stroke(
                                    colorScheme == .dark ? Color.white.opacity(0.08) : Color.clear,
                                    lineWidth: 1
                                )
                        )
                        .shadow(
                            color: colorScheme == .dark ? .black.opacity(0.35) : .black.opacity(0.08),
                            radius: 10
                        )
                        
                        // 通常ログインとGoogleログインの区切り。
                        HStack {
                            
                            Rectangle()
                                .fill(.gray.opacity(0.3))
                                .frame(height: 1)
                            
                            Text("または")
                                .foregroundColor(.secondary)
                            
                            Rectangle()
                                .fill(.gray.opacity(0.3))
                                .frame(height: 1)
                        }
                        
                        Button {
                            Task {
                                await loginWithGoogle()
                            }
                        } label: {
                            HStack(spacing: 10) {
                                Spacer()

                                if isLoggingInWithGoogle {
                                    ProgressView()
                                }

                                Image(systemName: "globe")

                                Text(isLoggingInWithGoogle ? "Googleログイン中..." : "Googleで続行")

                                Spacer()
                            }
                            .frame(height: 56)
                            .background(Color(.secondarySystemBackground))
                            .foregroundColor(Color(.label))
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(.gray.opacity(0.3))
                            )
                        }
                        .disabled(isLoggingIn || isLoggingInWithGoogle)
                        
                        // アカウント未作成の人を登録画面へ送る。
                        HStack(spacing: 4) {
                            Spacer()
                            
                            Text("アカウントをお持ちでないですか？")
                            
                            Button {
                                onShowRegistration()
                            } label: {
                                Text("アカウント作成")
                                    .foregroundColor(.blue)
                            }
                            
                            Spacer()
                        }
                        .font(.footnote)
                        .padding(.top, 4)
                    }
                    .padding()
                }
        }
    }

    private var canLogin: Bool {
        email.contains("@") && !password.isEmpty
    }

    @MainActor
    private func login() async {
        guard canLogin, !isLoggingIn, !isLoggingInWithGoogle else { return }

        isLoggingIn = true
        errorMessage = nil
        defer { isLoggingIn = false }

        do {
            try await authSession.login(
                email: email.trimmingCharacters(in: .whitespacesAndNewlines),
                password: password
            )
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    @MainActor
    private func loginWithGoogle() async {
        guard !isLoggingIn, !isLoggingInWithGoogle else { return }

        isLoggingInWithGoogle = true
        errorMessage = nil
        defer { isLoggingInWithGoogle = false }

        do {
            try await authSession.loginWithGoogle()
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

#Preview {
    NavigationStack {
        LoginView()
    }
    .environmentObject(AuthSession())
}
