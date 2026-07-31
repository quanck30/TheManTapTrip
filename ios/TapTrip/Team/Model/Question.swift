//
//  Question.swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/07/03.
//

import Foundation

// 質問APIのレスポンスと、画面に出す質問・回答項目の形。
struct QuestionResponse: Codable {
    // API全体の成功状態。
    let success: Bool
    // APIからの説明メッセージ。
    let message: String
    // 質問一覧本体。
    let data: QuestionData
}

struct QuestionData: Codable {
    // 画面に表示する質問配列。
    let questions: [Question]
}

struct Question: Codable, Identifiable {
    // 回答送信時に使う質問ID。
    let id: Int
    // 画面に表示する質問文。
    let title: String
    // 選択肢一覧。
    let queryItems: [QueryItem]
}

struct QueryItem: Codable, Identifiable {
    // SwiftUIのForEachで使う識別子。
    var id: String { itemId }
    
    // APIへ送る回答ID。
    let itemId: String
    // ボタンに表示する回答文。
    let title: String
    // API側で使う検索種別。空の場合もある。
    let searchType: String?
}
