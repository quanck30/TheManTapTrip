import Foundation

enum APIConstants {
    static let baseURL = URL(string: "https://taptrip-api.qnwnp.com/api/v1/")!
    static let googlePlacesBaseURL = URL(string: "https://places.googleapis.com")!
    static let guestQuestionsURL = baseURL.appendingPathComponent("questions/guest")
    static let placeSearchURL = baseURL.appendingPathComponent("placeSearch")

    enum Auth {
        static let emailLoginURL = baseURL.appendingPathComponent("auth/email")
        static let registerURL = baseURL.appendingPathComponent("auth/register")
        static let googleLoginURL = baseURL.appendingPathComponent("auth/google")
        static let currentUserURL = baseURL.appendingPathComponent("me")
        static let userURL = baseURL.appendingPathComponent("user")
        static let logoutURL = baseURL.appendingPathComponent("auth/logout")
    }
}
