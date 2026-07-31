import Foundation
import Security

enum AuthTokenStoreError: LocalizedError {
    case saveFailed

    var errorDescription: String? {
        "ログイン情報を端末へ保存できませんでした。もう一度お試しください。"
    }
}

// Googleログイン後にLaravelが発行するSanctum BearerトークンをKeychainへ保存する。
final class AuthTokenStore {
    private let keychainService = "com.take.Team.auth-session"
    private let keychainAccount = "sanctum-bearer-token"

    func save(_ token: String) throws {
        guard let data = token.data(using: .utf8) else {
            throw AuthTokenStoreError.saveFailed
        }

        clear()

        var item = keychainQuery
        item[kSecValueData as String] = data
        item[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly

        guard SecItemAdd(item as CFDictionary, nil) == errSecSuccess else {
            throw AuthTokenStoreError.saveFailed
        }
    }

    func load() -> String? {
        var query = keychainQuery
        query[kSecReturnData as String] = true
        query[kSecMatchLimit as String] = kSecMatchLimitOne

        var result: CFTypeRef?
        guard SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess,
              let data = result as? Data else {
            return nil
        }

        return String(data: data, encoding: .utf8)
    }

    func clear() {
        SecItemDelete(keychainQuery as CFDictionary)
    }

    private var keychainQuery: [String: Any] {
        [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: keychainAccount
        ]
    }
}
