//
//  QuestionService.swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/07/03.
//

import Foundation

// APIから質問一覧を取得するサービス。
class QuestionService {
    
    func fetchQuestions() async throws -> [Question] {
        // ゲスト用の質問一覧APIを呼び出す。
        let url = APIConstants.guestQuestionsURL

        // サーバーからJSONを取得する。
        let (data, _) = try await URLSession.shared.data(from: url)
        
        // 画面で使いやすいQuestion配列に変換して返す。
        let response = try JSONDecoder().decode(
            QuestionResponse.self,
            from: data
        )
        
        return response.data.questions
    }
    
}
