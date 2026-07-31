//
//  Spot.swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/07/03.
//

import Foundation

// 場所検索APIから返るスポット情報と、表示用の補助プロパティ。
struct SpotResponse: Codable {
    let success: Bool
    let message: String
    let data: [Spot]
    
    private enum CodingKeys: String, CodingKey {
        case success
        case message
        case data
    }
    
    init(success: Bool, message: String, data: [Spot]) {
        self.success = success
        self.message = message
        self.data = data
    }
    
    init(from decoder: Decoder) throws {
        // APIが配列だけ返す形にも、success/data付きで返す形にも対応する。
        if let spots = try? decoder.singleValueContainer().decode([Spot].self) {
            success = true
            message = ""
            data = spots
            return
        }
        
        let container = try decoder.container(keyedBy: CodingKeys.self)
        success = (try? container.decode(Bool.self, forKey: .success)) ?? true
        message = (try? container.decode(String.self, forKey: .message)) ?? ""
        data = (try? container.decode([Spot].self, forKey: .data)) ?? []
    }
}

struct Spot: Codable, Identifiable, Hashable {
    let spotId: String
    let sName: String
    let address: String
    let lat: Double
    let long: Double
    let rating: Double?
    let priceLevel: String?
    let primaryType: String?
    let types: [String]
    let goodForChildren: Bool?
    let menuForChildren: Bool?
    let hasParking: Bool?
    let summary: String?
    let photoReference: String?
    let photoUrl: String?
    let directionUrl: String?
    let matchScore: Int?
    
    var id: String {
        spotId
    }
    
    private enum CodingKeys: String, CodingKey {
        case spotId
        case sName
        case address
        case lat
        case long
        case rating
        case priceLevel
        case primaryType
        case types
        case goodForChildren
        case menuForChildren
        case hasParking
        case summary
        case photoReference
        case photoUrl
        case directionUrl
        case matchScore
    }
    
    init(
        spotId: String,
        sName: String,
        address: String,
        lat: Double,
        long: Double,
        rating: Double?,
        priceLevel: String?,
        primaryType: String?,
        types: [String],
        goodForChildren: Bool?,
        menuForChildren: Bool?,
        hasParking: Bool?,
        summary: String?,
        photoReference: String?,
        photoUrl: String? = nil,
        directionUrl: String?,
        matchScore: Int?
    ) {
        self.spotId = spotId
        self.sName = sName
        self.address = address
        self.lat = lat
        self.long = long
        self.rating = rating
        self.priceLevel = priceLevel
        self.primaryType = primaryType
        self.types = types
        self.goodForChildren = goodForChildren
        self.menuForChildren = menuForChildren
        self.hasParking = hasParking
        self.summary = summary
        self.photoReference = photoReference
        self.photoUrl = photoUrl
        self.directionUrl = directionUrl
        self.matchScore = matchScore
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        // APIの型ゆれで落ちないよう、文字列・数値・真偽値を柔らかく読む。
        spotId = container.string(for: .spotId) ?? UUID().uuidString
        sName = container.string(for: .sName) ?? "名称未設定"
        address = container.string(for: .address) ?? ""
        lat = container.double(for: .lat) ?? 0
        long = container.double(for: .long) ?? 0
        rating = container.double(for: .rating)
        priceLevel = container.string(for: .priceLevel)
        primaryType = container.string(for: .primaryType)
        types = container.stringArray(for: .types)
        goodForChildren = container.bool(for: .goodForChildren)
        menuForChildren = container.bool(for: .menuForChildren)
        hasParking = container.bool(for: .hasParking)
        summary = container.string(for: .summary)
        photoReference = container.string(for: .photoReference)
        photoUrl = container.string(for: .photoUrl)
        directionUrl = container.string(for: .directionUrl)
        matchScore = container.int(for: .matchScore)
    }
}

extension Spot {
    var imageURL: URL? {
        // バックエンドが返す表示用URLをそのまま利用する。
        guard let photoUrl,
              !photoUrl.isEmpty else {
            return nil
        }
        return URL(string: photoUrl)
    }
    
    var directionURL: URL? {
        guard let directionUrl else {
            return nil
        }
        
        return URL(string: directionUrl)
    }
    
    var statusText: String {
        // カードでは場所の種類を優先し、なければ金額表示を使う。
        if let primaryType, !primaryType.isEmpty {
            return primaryType
        }
        
        if let priceLevel, !priceLevel.isEmpty {
            return priceLevel
        }
        
        return ""
    }
    
    var displayTags: [String] {
        // APIのtypesに、子ども向けや駐車場の情報を足して表示する。
        var tags = Array(types.prefix(3))
        
        if goodForChildren == true {
            tags.append("子どもOK")
        }
        
        if menuForChildren == true {
            tags.append("子どもメニュー")
        }
        
        if hasParking == true {
            tags.append("駐車場あり")
        }
        
        return Array(tags.prefix(4))
    }
    
    var displaySummary: String {
        summary ?? ""
    }
    
    var isFree: Bool {
        // 金額の表現が文字列でも無料判定できるようにする。
        guard let priceLevel, !priceLevel.isEmpty else {
            return false
        }
        
        let normalized = priceLevel.lowercased()
        
        return normalized.contains("free")
        || priceLevel.contains("無料")
        || priceLevel == "0"
    }
}

private extension KeyedDecodingContainer {
    
    func string(for key: Key) -> String? {
        // 数値で返ってきた値も、表示用には文字列として受け取る。
        if let value = try? decode(String.self, forKey: key) {
            return value
        }
        
        if let value = try? decode(Int.self, forKey: key) {
            return String(value)
        }
        
        if let value = try? decode(Double.self, forKey: key) {
            return String(value)
        }
        
        return nil
    }
    
    func double(for key: Key) -> Double? {
        // 文字列や整数で返る緯度経度・評価もDoubleに変換する。
        if let value = try? decode(Double.self, forKey: key) {
            return value
        }
        
        if let value = try? decode(Int.self, forKey: key) {
            return Double(value)
        }
        
        if let value = try? decode(String.self, forKey: key) {
            return Double(value)
        }
        
        return nil
    }
    
    func int(for key: Key) -> Int? {
        // マッチ度が「96%」のような文字列でも数値に直す。
        if let value = try? decode(Int.self, forKey: key) {
            return value
        }
        
        if let value = try? decode(Double.self, forKey: key) {
            return Int(value)
        }
        
        if let value = try? decode(String.self, forKey: key) {
            return Int(value.replacingOccurrences(of: "%", with: ""))
        }
        
        return nil
    }
    
    func bool(for key: Key) -> Bool? {
        // true/false以外に、0/1や文字列でもBoolとして読めるようにする。
        if let value = try? decode(Bool.self, forKey: key) {
            return value
        }
        
        if let value = try? decode(Int.self, forKey: key) {
            return value != 0
        }
        
        if let value = try? decode(String.self, forKey: key) {
            switch value.lowercased() {
            case "true", "1", "yes":
                return true
            case "false", "0", "no":
                return false
            default:
                return nil
            }
        }
        
        return nil
    }
    
    func stringArray(for key: Key) -> [String] {
        // typesが配列でも単体文字列でも表示できるように配列へそろえる。
        if let value = try? decode([String].self, forKey: key) {
            return value
        }
        
        if let value = try? decode(String.self, forKey: key) {
            return value
                .split(separator: ",")
                .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
                .filter { !$0.isEmpty }
        }
        
        return []
    }
}
