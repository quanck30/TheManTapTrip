import Foundation
import Security

// ログイン方法にかかわらず、マイページへ表示するメールアドレスをKeychainへ保存する。
final class AuthEmailStore {
    private let keychainService = "com.take.Team.auth-session"
    private let keychainAccount = "profile-email"

    func save(_ email: String) {
        guard let data = email.data(using: .utf8) else { return }

        clear()

        var item = keychainQuery
        item[kSecValueData as String] = data
        item[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        SecItemAdd(item as CFDictionary, nil)
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
