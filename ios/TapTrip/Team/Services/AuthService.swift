import Foundation

// Laravel側の共通レスポンス形式。
private struct AuthAPIResponse<Data: Decodable>: Decodable {
    let success: Bool
    let message: String
    let data: Data
}

private struct AuthPayload: Decodable {
    let user: AuthUser
}

private struct LoginRequest: Encodable {
    let email: String
    let password: String
    let remember: Bool
}

private struct RegisterRequest: Encodable {
    let displayName: String
    let email: String
    let password: String
}

private struct GoogleLoginRequest: Encodable {
    let accessToken: String
}

private struct UpdateDisplayNameRequest: Encodable {
    let displayName: String
}

private struct EmptyAuthPayload: Decodable {}

private struct APIErrorResponse: Decodable {
    let message: String?
    let errors: [String: [String]]?
}

enum AuthServiceError: LocalizedError {
    case invalidResponse
    case network(message: String)
    case sessionExpired
    case server(message: String)

    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "サーバーから正しい応答を受け取れませんでした。"
        case .network(let message):
            return message
        case .sessionExpired:
            return "セッションを更新できませんでした。もう一度お試しください。"
        case .server(let message):
            return message
        }
    }
}

// TheManTapTripのSanctumセッション認証を呼び出すサービス。
final class AuthService {
    static let shared = AuthService()

    private let baseURL = APIConstants.baseURL
    private let session: URLSession
    private let decoder = JSONDecoder()
    private let encoder = JSONEncoder()

    init(session: URLSession = .shared) {
        // APIレスポンスのセッションCookieを確実に端末へ取り込む。
        HTTPCookieStorage.shared.cookieAcceptPolicy = .always
        self.session = session
    }

    func login(email: String, password: String) async throws -> AuthUser {
        return try await performLogin(
            email: email,
            password: password,
            retriesExpiredSession: true
        )
    }

    private func performLogin(
        email: String,
        password: String,
        retriesExpiredSession: Bool
    ) async throws -> AuthUser {
        let fallbackMessage = "ログインできませんでした。時間をおいてもう一度お試しください。"

        // Sanctumのセッション認証に必要なCSRF Cookieを先に取得する。
        try await prepareCSRFCookie(fallbackMessage: fallbackMessage)

        let body = LoginRequest(
            email: email,
            password: password,
            remember: true
        )
        let data: Data
        do {
            data = try await request(
                url: APIConstants.Auth.emailLoginURL,
                method: "POST",
                body: try encoder.encode(body),
                requiresCSRF: true,
                fallbackMessage: fallbackMessage
            )
        } catch AuthServiceError.sessionExpired where retriesExpiredSession {
            // 古いセッションとCSRF Cookieを両方破棄し、完全に新しいセッションで一度だけ再試行する。
            clearAuthenticationCookies()
            return try await performLogin(
                email: email,
                password: password,
                retriesExpiredSession: false
            )
        }

        let response = try decodeAuthResponse(data, fallbackMessage: fallbackMessage)
        return response.data.user
    }

    func register(
        displayName: String,
        email: String,
        password: String
    ) async throws -> AuthUser {
        let fallbackMessage = "アカウントを登録できませんでした。時間をおいてもう一度お試しください。"

        try await prepareCSRFCookie(fallbackMessage: fallbackMessage)

        let body = RegisterRequest(
            displayName: displayName,
            email: email,
            password: password
        )
        let data = try await request(
            url: APIConstants.Auth.registerURL,
            method: "POST",
            body: try encoder.encode(body),
            requiresCSRF: true,
            fallbackMessage: fallbackMessage
        )
        let response = try decodeAuthResponse(data, fallbackMessage: fallbackMessage)

        // 登録直後にもremember付きログインを行い、次回起動までセッションを維持する。
        // 再ログインが一時的に失敗しても、登録APIが確立したセッションはそのまま使う。
        return (try? await login(email: email, password: password)) ?? response.data.user
    }

    func loginWithGoogle(accessToken: String) async throws -> AuthUser {
        let fallbackMessage = "Googleでログインできませんでした。もう一度お試しください。"

        // Googleのアクセストークンを検証してもらい、認証後はHttpOnly Cookieでセッションを維持する。
        clearAuthenticationCookies()
        try await prepareCSRFCookie(fallbackMessage: fallbackMessage)

        let body = GoogleLoginRequest(accessToken: accessToken)
        let data = try await request(
            url: APIConstants.Auth.googleLoginURL,
            method: "POST",
            body: try encoder.encode(body),
            requiresCSRF: true,
            fallbackMessage: fallbackMessage
        )
        let response = try decodeAuthResponse(data, fallbackMessage: fallbackMessage)
        return response.data.user
    }

    func currentUser() async throws -> AuthUser {
        let fallbackMessage = "ログイン状態を確認できませんでした。"
        let data = try await request(
            url: APIConstants.Auth.currentUserURL,
            fallbackMessage: fallbackMessage
        )
        let response = try decodeAuthResponse(data, fallbackMessage: fallbackMessage)
        return response.data.user
    }

    func updateDisplayName(_ displayName: String) async throws {
        let fallbackMessage = "アカウント名を変更できませんでした。もう一度お試しください。"

        // Cookie認証の更新リクエストに必要なCSRF Cookieを準備する。
        try await prepareCSRFCookie(fallbackMessage: fallbackMessage)

        let body = UpdateDisplayNameRequest(displayName: displayName)
        let data = try await request(
            url: APIConstants.Auth.userURL,
            method: "PUT",
            body: try encoder.encode(body),
            requiresCSRF: true,
            fallbackMessage: fallbackMessage
        )
        // 更新APIは成功時に data: null を返すため、ユーザー情報を期待せずに解析する。
        do {
            let _: AuthAPIResponse<EmptyAuthPayload?> = try decoder.decode(
                AuthAPIResponse<EmptyAuthPayload?>.self,
                from: data
            )
        } catch {
            throw AuthServiceError.server(message: fallbackMessage)
        }
    }

    func logout() async throws {
        let fallbackMessage = "ログアウトできませんでした。"

        try await prepareCSRFCookie(fallbackMessage: fallbackMessage)
        _ = try await request(
            url: APIConstants.Auth.logoutURL,
            method: "POST",
            requiresCSRF: true,
            fallbackMessage: fallbackMessage
        )
    }

    func clearLocalCredentials() {
        clearAuthenticationCookies()
    }

    private func prepareCSRFCookie(fallbackMessage: String) async throws {
        // 公開環境では /sanctum/csrf-cookie がフロント画面へ転送されるため、
        // 未認証時にもCSRF Cookieを発行する /api/me をセッション初期化に使う。
        var request = URLRequest(url: APIConstants.Auth.currentUserURL)
        request.httpMethod = "GET"
        addCommonHeaders(to: &request)

        let response: URLResponse
        do {
            (_, response) = try await session.data(for: request)
        } catch {
            throw localizedNetworkError(from: error, fallbackMessage: fallbackMessage)
        }

        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode)
                || httpResponse.statusCode == 401,
              csrfToken() != nil else {
            throw AuthServiceError.server(message: fallbackMessage)
        }
    }

    private func request(
        url: URL,
        method: String = "GET",
        body: Data? = nil,
        requiresCSRF: Bool = false,
        usesSessionHeaders: Bool = true,
        fallbackMessage: String
    ) async throws -> Data {
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.httpBody = body
        addCommonHeaders(to: &request, usesSessionHeaders: usesSessionHeaders)

        if body != nil {
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }

        if requiresCSRF,
           let token = csrfToken() {
            request.setValue(token, forHTTPHeaderField: "X-XSRF-TOKEN")
        }

        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await session.data(for: request)
        } catch {
            throw localizedNetworkError(from: error, fallbackMessage: fallbackMessage)
        }

        guard let httpResponse = response as? HTTPURLResponse else {
            throw AuthServiceError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw makeError(
                from: data,
                statusCode: httpResponse.statusCode,
                fallbackMessage: fallbackMessage
            )
        }

        return data
    }

    private func addCommonHeaders(
        to request: inout URLRequest,
        usesSessionHeaders: Bool = true
    ) {
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        guard usesSessionHeaders else { return }

        // Sanctumに同一サイトのSPAリクエストとして扱わせ、セッションを有効にする。
        request.setValue(baseURL.absoluteString, forHTTPHeaderField: "Origin")
        request.setValue(baseURL.absoluteString + "/", forHTTPHeaderField: "Referer")
    }

    private func csrfToken() -> String? {
        HTTPCookieStorage.shared.cookies(for: baseURL)?
            .first(where: { $0.name == "XSRF-TOKEN" })?
            .value
            .removingPercentEncoding
    }

    private func clearAuthenticationCookies() {
        HTTPCookieStorage.shared.cookies(for: baseURL)?
            .forEach(HTTPCookieStorage.shared.deleteCookie)
    }

    private func decodeAuthResponse(
        _ data: Data,
        fallbackMessage: String
    ) throws -> AuthAPIResponse<AuthPayload> {
        do {
            return try decoder.decode(AuthAPIResponse<AuthPayload>.self, from: data)
        } catch {
            throw AuthServiceError.server(message: fallbackMessage)
        }
    }

    private func makeError(
        from data: Data,
        statusCode: Int,
        fallbackMessage: String
    ) -> Error {
        if let response = try? decoder.decode(APIErrorResponse.self, from: data) {
            if let message = response.message,
               containsJapaneseText(message),
               statusCode != 422 {
                return AuthServiceError.server(message: message)
            }

            let validationMessage = response.errors?
                .sorted(by: { $0.key < $1.key })
                .compactMap(\.value.first)
                .first

            if let message = validationMessage,
               containsJapaneseText(message) {
                return AuthServiceError.server(message: message)
            }
        }

        switch statusCode {
        case 401:
            return AuthServiceError.server(
                message: "メールアドレスまたはパスワードが正しくありません。"
            )
        case 404:
            return AuthServiceError.server(
                message: "現在この機能を利用できません。時間をおいてもう一度お試しください。"
            )
        case 419:
            return AuthServiceError.sessionExpired
        case 429:
            return AuthServiceError.server(
                message: "操作回数が多すぎます。しばらく時間をおいてからお試しください。"
            )
        default:
            return AuthServiceError.server(message: fallbackMessage)
        }
    }

    private func localizedNetworkError(
        from error: Error,
        fallbackMessage: String
    ) -> Error {
        guard let urlError = error as? URLError else {
            return AuthServiceError.network(message: fallbackMessage)
        }

        switch urlError.code {
        case .notConnectedToInternet:
            return AuthServiceError.network(
                message: "インターネットに接続されていません。通信環境を確認してください。"
            )
        case .timedOut:
            return AuthServiceError.network(
                message: "サーバーからの応答に時間がかかっています。もう一度お試しください。"
            )
        case .cannotFindHost, .cannotConnectToHost, .dnsLookupFailed:
            return AuthServiceError.network(
                message: "サーバーに接続できませんでした。時間をおいてもう一度お試しください。"
            )
        default:
            return AuthServiceError.network(message: fallbackMessage)
        }
    }

    private func containsJapaneseText(_ text: String) -> Bool {
        text.unicodeScalars.contains { scalar in
            let value = scalar.value
            return (0x3040...0x30FF).contains(value)
                || (0x3400...0x9FFF).contains(value)
        }
    }
}
