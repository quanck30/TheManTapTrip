//
//  QuestionViewModel.swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/07/03.
//

import Foundation
import Combine


// 質問の取得、回答の保持、場所検索の実行をまとめて管理する場所。
@MainActor
class QuestionViewModel: ObservableObject {
    
    @Published var questions: [Question] = []
    
    @Published var isLoading = false
    
    @Published var isSearching = false
    
    @Published var errorMessage = ""
    
    @Published var searchErrorMessage = ""
    
    @Published var places: [Spot] = []
    
    private let service = QuestionService()
    
    private let placeSearchService = PlaceSearchService()
    
    func fetchQuestions() {
        
        Task {
            
            // 質問画面を読み込み状態にする。
            isLoading = true
            
            do {
                
                // APIから質問を取得して画面へ反映する。
                questions = try await service.fetchQuestions()
                
            } catch {
                
                // システム由来の英語エラーをそのまま見せず、日本語で案内する。
                errorMessage = "サーバーに接続できませんでした。通信状況を確認して、もう一度お試しください。"
                
            }
            
            // 読み込み表示を終了する。
            isLoading = false
            
        }
        
    }
    
    func searchPlaces(with answers: [QuestionAnswer], location: PlaceSearchLocation) async {
        // 検索開始時は前回の結果とエラー表示をリセットする。
        isSearching = true
        searchErrorMessage = ""
        places = []
        
        do {
            // 回答と現在地を使って、APIからおすすめスポットを取得する。
            places = try await placeSearchService.searchPlaces(with: answers, location: location)
        } catch {
            // 検索失敗時も、利用者向けの日本語メッセージを表示する。
            searchErrorMessage = "旅行先を検索できませんでした。通信状況を確認して、もう一度お試しください。"
        }
        
        // 検索中表示を終了する。
        isSearching = false
    }
    
    func clearSearchResults() {
        // 画面遷移後などに一時的な検索結果を空に戻す。
        places = []
        searchErrorMessage = ""
    }
    
}
