import SwiftUI

// 新しいアカウントを作成する入力画面。
struct RegisterView: View {
    
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var authSession: AuthSession

    var onRegistrationSuccess: (() -> Void)?
    var onShowLogin: (() -> Void)?
    
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var isSecure = true
    @State private var isRegistering = false
    @State private var isRegisteringWithGoogle = false
    @State private var errorMessage: String?

    init(
        onRegistrationSuccess: (() -> Void)? = nil,
        onShowLogin: (() -> Void)? = nil
    ) {
        self.onRegistrationSuccess = onRegistrationSuccess
        self.onShowLogin = onShowLogin
    }
    
    var body: some View {
        ZStack {
                // ログイン画面と同じ淡い背景を使う。
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
                        // タイトル、入力カード、外部ログイン、ログインリンクの順に並べる。
                        header
                        formCard
                        separator
                        googleButton
                        loginLink
                    }
                    .padding()
                }
        }
    }
    
    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            // ブランド名を小さく表示する。
            HStack(spacing: 8) {
                Image(systemName: "sparkles")
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.cyan)
                
                Text("TapTrip")
                    .font(.title3)
                    .fontWeight(.bold)
            }
            .padding(.top, 8)
            
            Spacer()
                .frame(height: 28)
            
            // 画面の目的を大きく伝える。
            Text("アカウント作成")
                .font(.system(size: 40, weight: .medium))
                .foregroundStyle(.primary)
            
            Text("保存した場所やおすすめを、いつでも見返せるようにしましょう。")
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
    
    private var formCard: some View {
        VStack(alignment: .leading, spacing: 18) {
            // 名前入力。
            Text("氏名")
                .font(.caption)
                .foregroundStyle(.cyan)
            
            registerField(
                icon: "person",
                placeholder: "名前を入力...",
                text: $name
            )
            
            // メール入力。
            Text("メールアドレス")
                .font(.caption)
                .foregroundStyle(.cyan)
            
            registerField(
                icon: "envelope",
                placeholder: "メールアドレスを入力...",
                text: $email,
                isEmail: true
            )
            
            // パスワード入力。
            Text("パスワード")
                .font(.caption)
                .foregroundStyle(.cyan)
            
            passwordField

            if let errorMessage {
                Label(errorMessage, systemImage: "exclamationmark.triangle.fill")
                    .font(.footnote)
                    .foregroundStyle(.red)
                    .fixedSize(horizontal: false, vertical: true)
            }
            
            Button {
                Task {
                        await register()
                }
            } label: {
                // 入力が足りない時は薄くして押せない状態にする。
                HStack(spacing: 10) {
                    if isRegistering {
                        ProgressView()
                            .tint(.black)
                    }

                    Text(isRegistering ? "登録中..." : "登録する")
                }
                    .font(.title3)
                    .fontWeight(.semibold)
                    .frame(maxWidth: .infinity)
                    .frame(height: 56)
                    .background(
                        Color(red: 0.46, green: 0.79, blue: 0.95)
                            .opacity(canRegister ? 1 : 0.55)
                    )
                    .foregroundStyle(.black)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
            }
            .disabled(!canRegister || isRegistering)
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
    }
    
    private var passwordField: some View {
        HStack {
            Image(systemName: "lock")
                .foregroundStyle(.gray)
            
            // 目のボタンでSecureFieldとTextFieldを切り替える。
            if isSecure {
                SecureField("8文字以上で入力...", text: $password)
                    .textContentType(.newPassword)
            } else {
                TextField("8文字以上で入力...", text: $password)
                    .textInputAutocapitalization(.never)
            }
            
            Button {
                isSecure.toggle()
            } label: {
                Image(systemName: isSecure ? "eye.slash" : "eye")
                    .foregroundStyle(.gray)
            }
        }
        .padding()
        .background(Color(.tertiarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
    
    private var separator: some View {
        // 通常登録とGoogle登録を分ける線。
        HStack {
            Rectangle()
                .fill(.gray.opacity(0.3))
                .frame(height: 1)
            
            Text("または")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            
            Rectangle()
                .fill(.gray.opacity(0.3))
                .frame(height: 1)
        }
    }
    
    private var googleButton: some View {
        Button {
            Task {
                await registerWithGoogle()
            }
        } label: {
            HStack(spacing: 10) {
                Spacer()

                if isRegisteringWithGoogle {
                    ProgressView()
                }

                Image(systemName: "globe")

                Text(isRegisteringWithGoogle ? "Googleログイン中..." : "Googleで続行")
                    .fontWeight(.medium)

                Spacer()
            }
            .frame(height: 56)
            .background(Color(.secondarySystemBackground))
            .foregroundStyle(Color(.label))
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.gray.opacity(0.3))
            )
        }
        .disabled(isRegistering || isRegisteringWithGoogle)
    }
    
    private var loginLink: some View {
        // すでにアカウントがある人はログイン画面へ移動する。
        HStack(spacing: 4) {
            Spacer()
            
            Text("すでにアカウントをお持ちですか？")
                .foregroundStyle(.secondary)
            
            Button {
                if let onShowLogin {
                    onShowLogin()
                } else {
                    dismiss()
                }
            } label: {
                Text("ログイン")
                    .foregroundStyle(.blue)
            }
            
            Spacer()
        }
        .font(.footnote)
        .padding(.top, 4)
    }
    
    private var canRegister: Bool {
        // 最低限の入力がそろうまで登録ボタンを無効化する。
        !name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        && email.contains("@")
        && password.count >= 8
    }

    @MainActor
    private func register() async {
        guard canRegister, !isRegistering, !isRegisteringWithGoogle else { return }

        isRegistering = true
        errorMessage = nil
        defer { isRegistering = false }

        do {
            try await authSession.register(
                displayName: name.trimmingCharacters(in: .whitespacesAndNewlines),
                email: email.trimmingCharacters(in: .whitespacesAndNewlines),
                password: password
            )

            if let onRegistrationSuccess {
                onRegistrationSuccess()
            } else {
                dismiss()
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    @MainActor
    private func registerWithGoogle() async {
        guard !isRegistering, !isRegisteringWithGoogle else { return }

        isRegisteringWithGoogle = true
        errorMessage = nil
        defer { isRegisteringWithGoogle = false }

        do {
            // Laravel側が初回Googleログイン時にユーザーを作成するため、登録とログインは同じAPIを使う。
            try await authSession.loginWithGoogle()

            if let onRegistrationSuccess {
                onRegistrationSuccess()
            } else {
                dismiss()
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    private func registerField(
        icon: String,
        placeholder: String,
        text: Binding<String>,
        isEmail: Bool = false
    ) -> some View {
        HStack {
            Image(systemName: icon)
                .foregroundStyle(.gray)
            
            // 名前やメールなど、通常の1行入力欄を共通化する。
            TextField(placeholder, text: text)
                .keyboardType(isEmail ? .emailAddress : .default)
                .textInputAutocapitalization(isEmail ? .never : .words)
                .textContentType(isEmail ? .emailAddress : .name)
                .autocorrectionDisabled(isEmail)
        }
        .padding()
        .background(Color(.tertiarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

#Preview {
    NavigationStack {
        RegisterView()
    }
    .environmentObject(AuthSession())
}
