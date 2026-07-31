import Foundation

// TapTrip APIが返すログイン中ユーザー。
struct AuthUser: Codable, Equatable {
    let id: Int
    let displayName: String
    let email: String?
}
