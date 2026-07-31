import Foundation

// 質問の回答と現在地をAPIへ送り、旅行先の候補を取得するサービス。
class PlaceSearchService {
    
    func searchPlaces(with answers: [QuestionAnswer], location: PlaceSearchLocation) async throws -> [Spot] {
        // 検索APIの送信先を作る。
        let url = APIConstants.placeSearchURL
        
        // 画面で選んだ回答を、APIが受け取る形式へ変換する。
        let placeSearchAnswers = PlaceSearchAnswers(answers: answers)
        
        // 現在地・検索範囲・回答内容をJSONとしてPOSTする。
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.httpBody = try JSONEncoder().encode(
            PlaceSearchRequest(
                latitude: location.latitude,
                longitude: location.longitude,
                radius: placeSearchAnswers.radius,
                answers: placeSearchAnswers
            )
        )
        
        // サーバーへ送信し、通信結果を受け取る。
        let (data, response) = try await URLSession.shared.data(for: request)
        
        // HTTPレスポンスでなければ、アプリ側で扱いやすいエラーにする。
        guard let httpResponse = response as? HTTPURLResponse else {
            throw PlaceSearchError.message("サーバーから正しい応答がありませんでした。")
        }
        
        // 失敗時はサーバーのmessageがあれば優先して表示する。
        guard 200..<300 ~= httpResponse.statusCode else {
            let message = try? JSONDecoder().decode(PlaceSearchErrorResponse.self, from: data).message
            throw PlaceSearchError.message(message ?? "場所の検索に失敗しました。HTTP \(httpResponse.statusCode)")
        }

        // 成功時はSpotResponseのdataだけを画面へ返す。
        return try JSONDecoder().decode(SpotResponse.self, from: data).data
    }
}

private enum PlaceSearchError: LocalizedError {
    case message(String)
    
    var errorDescription: String? {
        switch self {
        case .message(let message):
            return message
        }
    }
}

private struct PlaceSearchErrorResponse: Decodable {
    let message: String
}

struct PlaceSearchLocation {
    let latitude: Double
    let longitude: Double
}

struct QuestionAnswer {
    let questionId: Int
    let itemId: String
}

private struct PlaceSearchRequest: Encodable {
    let latitude: Double
    let longitude: Double
    let radius: Double
    let answers: PlaceSearchAnswers
}

private struct PlaceSearchAnswers: Encodable {
    let withChildren: Bool
    let travelMode: String
    let locationType: String
    let purpose: String
    let priceLevel: String
    
    var radius: Double {
        switch travelMode {
        case "bicycle":
            return 2_000
        case "drive":
            return 5_000
        default:
            return 1_000
        }
    }
    
    init(answers: [QuestionAnswer]) {
        // questionIdをキーにして、どの質問で何を選んだか引けるようにする。
        let answerMap = Dictionary(
            uniqueKeysWithValues: answers.map { ($0.questionId, $0.itemId) }
        )
        
        // API側の検索条件名へ変換してまとめる。
        withChildren = Self.withChildrenValue(from: answerMap[1])
        travelMode = Self.travelModeValue(from: answerMap[2])
        locationType = Self.locationTypeValue(from: answerMap[3])
        purpose = Self.purposeValue(from: answerMap[4])
        priceLevel = Self.priceLevelValue(from: answerMap[5])
    }
    
    private static func withChildrenValue(from itemId: String?) -> Bool {
        itemId == "1"
    }
    
    private static func travelModeValue(from itemId: String?) -> String {
        switch itemId {
        case "1":
            return "walk"
        case "2":
            return "bicycle"
        case "3":
            return "drive"
        case "4":
            return ""
        default:
            return "walk"
        }
    }
    
    private static func locationTypeValue(from itemId: String?) -> String {
        switch itemId {
        case "1":
            return "indoor"
        case "2":
            return "outdoor"
        case "3":
            return "any"
        default:
            return "any"
        }
    }
    
    private static func purposeValue(from itemId: String?) -> String {
        switch itemId {
        case "1":
            return "eat"
        case "2":
            return "play"
        case "3":
            return "sightsee"
        case "4":
            return "shop"
        case "5":
            return "relax"
        default:
            return "play"
        }
    }
    
    private static func priceLevelValue(from itemId: String?) -> String {
        switch itemId {
        case "1":
            return "1"
        case "2":
            return "1"
        case "3":
            return "2"
        case "4":
            return "3"
        default:
            return "1"
        }
    }
}
