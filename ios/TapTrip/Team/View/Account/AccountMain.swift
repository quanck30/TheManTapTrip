import CoreLocation
import SwiftUI
import UIKit

// ユーザーのプロフィール情報を表示・編集する画面。
struct AccountView: View {
    
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.openURL) private var openURL
    @EnvironmentObject private var authSession: AuthSession

    @StateObject private var locationService = LocationService()
    
    @State private var displayName = ""
    @State private var isSaving = false
    @State private var saveMessage = ""
    @State private var isShowingSaveMessage = false

    private var normalizedDisplayName: String {
        displayName.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private var isDisplayNameTooLong: Bool {
        normalizedDisplayName.count > 20
    }

    private var isSaveDisabled: Bool {
        isSaving
            || normalizedDisplayName.isEmpty
            || isDisplayNameTooLong
            || normalizedDisplayName == authSession.user?.displayName
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                
                // プロフィール画像・名前・一言を表示する。
                VStack(spacing: 12) {
                    
                    profileImage
                        .frame(width: 90, height: 90)
                        .clipShape(Circle())
                        .overlay {
                            Circle()
                                .stroke(Color.white.opacity(colorScheme == .dark ? 0.18 : 0.8), lineWidth: 2)
                        }
                        .shadow(color: .black.opacity(colorScheme == .dark ? 0.35 : 0.12), radius: 6, y: 2)
                    
                    Text(authSession.user?.displayName ?? "TapTripユーザー")
                        .font(.title3)
                        .bold()
                    
                    Text(authSession.user?.email ?? "")
                        .foregroundColor(.gray)
                        .font(.subheadline)
                }
                
                // アカウント名だけを編集し、メールアドレスは確認用に表示するカード。
                VStack(alignment: .leading, spacing: 16) {
                    
                    Text("個人情報")
                        .foregroundColor(.blue)
                        .font(.headline)
                    
                    Group {
                        // アカウント名は入力欄、メールアドレスは読み取り専用で表示する。
                        InputField(title: "アカウント名",
                                   text: $displayName)

                        HStack {
                            if isDisplayNameTooLong {
                                Text("アカウント名は20文字以内にしてください")
                                    .foregroundStyle(.red)
                            }

                            Spacer()

                            Text("\(normalizedDisplayName.count) / 20")
                                .foregroundStyle(isDisplayNameTooLong ? .red : .secondary)
                        }
                        .font(.caption)
                        
                        ReadOnlyField(
                            title: "メールアドレス",
                            value: authSession.user?.email ?? "未設定"
                        )
                    }
                    
                }
                .padding()
                .background(Color(.secondarySystemBackground))
                .cornerRadius(18)
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(
                            colorScheme == .dark ? Color.white.opacity(0.08) : Color.clear,
                            lineWidth: 1
                        )
                )
                .shadow(color: colorScheme == .dark ? .black.opacity(0.35) : .black.opacity(0.05), radius: 8)
                
                // 設定メニュー。各行はMenuRowで共通表示する。
                VStack(spacing: 0) {
                    
                    MenuRow(icon: "lock.fill",
                            title: "パスワード変更")
                    
                    Divider()
                    
                    NavigationLink {
                        NotificationSettingsView()
                    } label: {
                        MenuRow(icon: "bell",
                                title: "通知設定")
                    }
                    .buttonStyle(.plain)
                    
                    Divider()
                    
                    Button {
                        openLocationPermission()
                    } label: {
                        MenuRow(icon: "location",
                                title: "位置情報の権限")
                    }
                    .buttonStyle(.plain)
                }
                .background(Color(.secondarySystemBackground))
                .cornerRadius(18)
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(
                            colorScheme == .dark ? Color.white.opacity(0.08) : Color.clear,
                            lineWidth: 1
                        )
                )
                .shadow(color: colorScheme == .dark ? .black.opacity(0.35) : .black.opacity(0.05), radius: 8)
                
                // アカウント名に変更がある時だけ保存できる。
                Button {
                    saveDisplayName()
                } label: {
                    HStack(spacing: 8) {
                        if isSaving {
                            ProgressView()
                                .tint(.white)
                        }

                        Text(isSaving ? "保存中..." : "アカウント名を保存")
                            .font(.headline)
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue.opacity(isSaveDisabled ? 0.4 : 1))
                    .cornerRadius(16)
                }
                .disabled(isSaveDisabled)
                
                Button("ログアウト") {
                    Task {
                        await authSession.logout()
                    }
                }
                .foregroundColor(.red)
                .padding(.bottom)
            }
            .padding()
        }
        .navigationTitle("アカウント")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            displayName = authSession.user?.displayName ?? ""
        }
        .alert("アカウント", isPresented: $isShowingSaveMessage) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(saveMessage)
        }
    }

    @ViewBuilder
    private var profileImage: some View {
        if let imageURL = authSession.googleProfileImageURL {
            AsyncImage(url: imageURL) { phase in
                if let image = phase.image {
                    image
                        .resizable()
                        .scaledToFill()
                } else {
                    defaultProfileImage
                }
            }
        } else {
            defaultProfileImage
        }
    }

    private var defaultProfileImage: some View {
        Image(systemName: "person.crop.circle.fill")
            .resizable()
            .scaledToFit()
            .foregroundStyle(.secondary)
            .background(Color(.secondarySystemBackground))
    }

    private func saveDisplayName() {
        guard !isSaveDisabled else { return }

        isSaving = true
        Task {
            defer { isSaving = false }

            do {
                try await authSession.updateDisplayName(normalizedDisplayName)
                displayName = authSession.user?.displayName ?? normalizedDisplayName
                saveMessage = "アカウント名を変更しました。"
            } catch {
                saveMessage = error.localizedDescription
            }

            isShowingSaveMessage = true
        }
    }

    private func openLocationPermission() {
        if locationService.authorizationStatus == .notDetermined {
            // 初回はiOS標準の位置情報許可ダイアログを表示する。
            locationService.requestLocation()
            return
        }

        // 一度回答した後は、許可内容を変更できるアプリ設定画面を開く。
        guard let settingsURL = URL(string: UIApplication.openSettingsURLString) else {
            return
        }
        openURL(settingsURL)
    }
}

struct InputField: View {
    
    let title: String
    @Binding var text: String
    
    var body: some View {
        
        VStack(alignment: .leading, spacing: 6) {
            
            // 入力項目のラベル。
            Text(title)
                .font(.caption)
                .foregroundColor(.gray)
            
            // 実際の編集欄。
            TextField("", text: $text)
                .padding()
                .background(Color(.tertiarySystemBackground))
                .cornerRadius(12)
        }
    }
}

struct ReadOnlyField: View {

    let title: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(title)
                    .font(.caption)
                    .foregroundColor(.gray)

                Spacer()

                Label("変更不可", systemImage: "lock.fill")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }

            Text(value)
                .foregroundStyle(.secondary)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(Color(.systemGray5).opacity(0.55))
                .cornerRadius(12)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("メールアドレス、\(value)、変更できません")
    }
}

struct MenuRow: View {
    
    let icon: String
    let title: String
    
    var body: some View {
        
        HStack {
            
            // 左側のメニューアイコン。
            Image(systemName: icon)
                .frame(width: 25)
            
            Text(title)
            
            Spacer()
            
            // タップできる行だと分かる右向き矢印。
            Image(systemName: "chevron.right")
                .foregroundColor(.gray)
        }
        .padding()
    }
}

#Preview {
    NavigationStack {
        AccountView()
    }
    .environmentObject(AuthSession())
}
