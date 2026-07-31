import Foundation
import GoogleSignIn
import UIKit

enum GoogleSignInServiceError: LocalizedError {
    case missingClientID
    case presentationUnavailable

    var errorDescription: String? {
        switch self {
        case .missingClientID:
            return "GoogleログインのiOSクライアントIDが設定されていません。"
        case .presentationUnavailable:
            return "Googleログイン画面を表示できませんでした。もう一度お試しください。"
        }
    }
}

struct GoogleSignInCredentials {
    let accessToken: String
    let email: String?
    let profileImageURL: URL?
}

struct GoogleSignInProfile {
    let email: String?
    let imageURL: URL?
}

// Googleの認証画面を表示し、Laravelへ渡すOAuthアクセストークンを取得する。
@MainActor
final class GoogleSignInService {
    static let shared = GoogleSignInService()

    private init() {}

    func signIn() async throws -> GoogleSignInCredentials {
        try configure()

        guard let presentingViewController else {
            throw GoogleSignInServiceError.presentationUnavailable
        }

        let result = try await GIDSignIn.sharedInstance.signIn(
            withPresenting: presentingViewController
        )
        let refreshedUser = try await result.user.refreshTokensIfNeeded()
        return GoogleSignInCredentials(
            accessToken: refreshedUser.accessToken.tokenString,
            email: refreshedUser.profile?.email,
            profileImageURL: refreshedUser.profile?.imageURL(withDimension: 240)
        )
    }

    func restoreProfile() async -> GoogleSignInProfile? {
        do {
            try configure()
            let user = try await GIDSignIn.sharedInstance.restorePreviousSignIn()
            return GoogleSignInProfile(
                email: user.profile?.email,
                imageURL: user.profile?.imageURL(withDimension: 240)
            )
        } catch {
            return nil
        }
    }

    func handle(url: URL) -> Bool {
        GIDSignIn.sharedInstance.handle(url)
    }

    func signOut() {
        GIDSignIn.sharedInstance.signOut()
    }

    private func configure() throws {
        guard let clientID = Bundle.main.object(forInfoDictionaryKey: "GIDClientID") as? String,
              !clientID.isEmpty,
              !clientID.contains("YOUR_IOS_CLIENT_ID") else {
            throw GoogleSignInServiceError.missingClientID
        }

        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: clientID)
    }

    private var presentingViewController: UIViewController? {
        let activeScene = UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .first { $0.activationState == .foregroundActive }

        let rootViewController = activeScene?.windows
            .first(where: \.isKeyWindow)?
            .rootViewController
            ?? activeScene?.windows.first?.rootViewController

        return topViewController(from: rootViewController)
    }

    private func topViewController(from viewController: UIViewController?) -> UIViewController? {
        if let presented = viewController?.presentedViewController {
            return topViewController(from: presented)
        }

        if let navigationController = viewController as? UINavigationController {
            return topViewController(from: navigationController.visibleViewController)
        }

        if let tabBarController = viewController as? UITabBarController {
            return topViewController(from: tabBarController.selectedViewController)
        }

        return viewController
    }
}
