import Foundation
import Combine

// アプリ全体で共有するログイン状態。
@MainActor
final class AuthSession: ObservableObject {
    @Published private(set) var user: AuthUser?
    @Published private(set) var googleProfileImageURL: URL?
    @Published private(set) var isRestoring = true
    // 認証成功後にアカウントタブへ移動し、ログイン画面を閉じるためのイベント。
    @Published private(set) var accountNavigationID: UUID?

    var isAuthenticated: Bool {
        user != nil
    }

    private let service: AuthService
    private let cookieStore: AuthCookieStore
    private let emailStore: AuthEmailStore
    private let googleSignInService: GoogleSignInService

    init(
        service: AuthService? = nil,
        cookieStore: AuthCookieStore? = nil,
        emailStore: AuthEmailStore? = nil,
        googleSignInService: GoogleSignInService? = nil
    ) {
        self.service = service ?? AuthService.shared
        self.cookieStore = cookieStore ?? AuthCookieStore()
        self.emailStore = emailStore ?? AuthEmailStore()
        self.googleSignInService = googleSignInService ?? .shared
    }

    func restore() async {
        defer { isRestoring = false }
        cookieStore.restore()

        do {
            let restoredUser = try await service.currentUser()
            let googleProfile = await googleSignInService.restoreProfile()
            var restoredEmail = restoredUser.email ?? emailStore.load()
            if restoredEmail == nil {
                restoredEmail = googleProfile?.email
            }

            user = addingEmail(restoredEmail, to: restoredUser)
            googleProfileImageURL = googleProfile?.imageURL
            if let restoredEmail {
                emailStore.save(restoredEmail)
            }
            cookieStore.save()
        } catch {
            service.clearLocalCredentials()
            cookieStore.clear()
            emailStore.clear()
            googleProfileImageURL = nil
            user = nil
        }
    }

    func login(email: String, password: String) async throws {
        // 明示的な再ログインでは、端末に残った古いセッションを先に破棄する。
        cookieStore.clear()
        emailStore.clear()
        googleSignInService.signOut()
        googleProfileImageURL = nil

        let authenticatedUser = try await service.login(email: email, password: password)
        user = addingEmail(email, to: authenticatedUser)
        emailStore.save(email)
        cookieStore.save()
        accountNavigationID = UUID()
    }

    func loginWithGoogle() async throws {
        let googleCredentials = try await googleSignInService.signIn()

        // 以前のセッションを破棄し、Google認証後に発行されるHttpOnly Cookieへ入れ替える。
        cookieStore.clear()
        emailStore.clear()

        let authenticatedUser = try await service.loginWithGoogle(
            accessToken: googleCredentials.accessToken
        )
        user = addingEmail(googleCredentials.email, to: authenticatedUser)
        googleProfileImageURL = googleCredentials.profileImageURL
        if let email = googleCredentials.email {
            emailStore.save(email)
        }
        cookieStore.save()
        accountNavigationID = UUID()
    }

    func register(
        displayName: String,
        email: String,
        password: String
    ) async throws {
        emailStore.clear()
        googleSignInService.signOut()
        googleProfileImageURL = nil

        let registeredUser = try await service.register(
            displayName: displayName,
            email: email,
            password: password
        )
        user = addingEmail(email, to: registeredUser)
        emailStore.save(email)
        cookieStore.save()
        accountNavigationID = UUID()
    }

    func updateDisplayName(_ displayName: String) async throws {
        try await service.updateDisplayName(displayName)

        guard let currentUser = user else {
            throw AuthServiceError.invalidResponse
        }

        user = AuthUser(
            id: currentUser.id,
            displayName: displayName,
            email: currentUser.email
        )
        cookieStore.save()
    }

    func logout() async {
        do {
            try await service.logout()
        } catch {
            // サーバー側のセッションが既に切れていても端末側はログアウトする。
        }

        cookieStore.clear()
        emailStore.clear()
        service.clearLocalCredentials()
        googleSignInService.signOut()
        googleProfileImageURL = nil
        user = nil
    }

    private func addingEmail(_ email: String?, to user: AuthUser) -> AuthUser {
        AuthUser(
            id: user.id,
            displayName: user.displayName,
            email: user.email ?? email
        )
    }
}
