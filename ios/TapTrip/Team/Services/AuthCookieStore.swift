import Foundation
import Security

// 認証CookieをKeychainへ保存し、アプリ再起動後に復元する。
final class AuthCookieStore {
    private struct StoredCookie: Codable {
        let name: String
        let value: String
        let domain: String
        let path: String
        let expiresDate: Date?
        let isSecure: Bool

        init(cookie: HTTPCookie) {
            name = cookie.name
            value = cookie.value
            domain = cookie.domain
            path = cookie.path
            expiresDate = cookie.expiresDate
            isSecure = cookie.isSecure
        }

        var cookie: HTTPCookie? {
            if let expiresDate, expiresDate <= Date() {
                return nil
            }

            var properties: [HTTPCookiePropertyKey: Any] = [
                .name: name,
                .value: value,
                .domain: domain,
                .path: path,
                .version: "0"
            ]

            if let expiresDate {
                properties[.expires] = expiresDate
            }

            if isSecure {
                properties[.secure] = "TRUE"
            }

            return HTTPCookie(properties: properties)
        }
    }

    private let cookieStorage: HTTPCookieStorage
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()
    private let authURL = APIConstants.baseURL
    private let keychainService = "com.take.Team.auth-session"
    private let keychainAccount = "sanctum-cookies"

    init(cookieStorage: HTTPCookieStorage = .shared) {
        self.cookieStorage = cookieStorage
    }

    func save() {
        let cookies = cookieStorage.cookies(for: authURL)?
            .map(StoredCookie.init(cookie:)) ?? []

        guard !cookies.isEmpty,
              let data = try? encoder.encode(cookies) else {
            clearSavedCookies()
            return
        }

        let query = keychainQuery
        let attributes: [String: Any] = [
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        ]

        if SecItemUpdate(query as CFDictionary, attributes as CFDictionary) == errSecItemNotFound {
            var item = query
            attributes.forEach { item[$0.key] = $0.value }
            SecItemAdd(item as CFDictionary, nil)
        }
    }

    func restore() {
        var query = keychainQuery
        query[kSecReturnData as String] = true
        query[kSecMatchLimit as String] = kSecMatchLimitOne

        var result: CFTypeRef?
        guard SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess,
              let data = result as? Data,
              let cookies = try? decoder.decode([StoredCookie].self, from: data) else {
            return
        }

        cookies.compactMap(\.cookie).forEach(cookieStorage.setCookie)
    }

    func clear() {
        cookieStorage.cookies(for: authURL)?
            .forEach(cookieStorage.deleteCookie)
        clearSavedCookies()
    }

    private var keychainQuery: [String: Any] {
        [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: keychainService,
            kSecAttrAccount as String: keychainAccount
        ]
    }

    private func clearSavedCookies() {
        SecItemDelete(keychainQuery as CFDictionary)
    }
}
