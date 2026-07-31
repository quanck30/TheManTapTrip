//
//  QuestionView.swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/07/03.
//
import SwiftUI

// 質問回答の進行と、回答後の場所検索を行う画面。
struct QuestionView: View {
    
    var onSearchFinished: () -> Void = {}
    
    @EnvironmentObject
    private var searchResultStore: SearchResultStore
    
    @StateObject
    private var viewModel = QuestionViewModel()
    
    @StateObject
    private var locationService = LocationService()
    
    @State private var currentQuestionIndex = 0
    @State private var selectedAnswers: [QuestionAnswer] = []
    @State private var isCompleted = false
    
    private let maxQuestionCount = 5
    
    private var questions: [Question] {
        // APIから来た質問のうち、画面では最大5問だけ使う。
        Array(viewModel.questions.prefix(maxQuestionCount))
    }
    
    var body: some View {
        
        NavigationStack {
            
            Group {
                
                // 質問取得中はローディングだけ表示する。
                if viewModel.isLoading {
                    
                    ProgressView()
                    
                // 質問APIで失敗した時のエラー表示。
                } else if !viewModel.errorMessage.isEmpty {
                    
                    ContentUnavailableView(
                        "質問を読み込めませんでした",
                        systemImage: "exclamationmark.triangle",
                        description: Text(viewModel.errorMessage)
                    )
                    
                // APIは成功したが質問が空だった時の表示。
                } else if questions.isEmpty {
                    
                    ContentUnavailableView(
                        "質問がありません",
                        systemImage: "questionmark.circle"
                    )
                    
                // 5問回答し終わった後は検索結果の状態を表示する。
                } else if isCompleted {
                    
                    completedView
                    
                // まだ回答中なら、現在の1問だけをカードで表示する。
                } else {
                    
                    QuestionCardView(
                        question: questions[currentQuestionIndex],
                        currentQuestion: currentQuestionIndex + 1,
                        totalQuestion: questions.count,
                        selectedItemId: selectedItemId,
                        onAnswer: answer,
                        onBack: back
                    )
                    
                }
                
            }
            
            .navigationTitle("質問")
            
        }
        
        .onAppear {
            
            // 画面を開いたら質問と現在地の準備を始める。
            viewModel.fetchQuestions()
            locationService.requestLocation()
            
        }
        
    }
    
    @ViewBuilder
    private var completedView: some View {
        // 検索中は結果画面へ移る前の待機表示にする。
        if viewModel.isSearching {
            VStack(spacing: 16) {
                ProgressView()
                
                Text("旅行先を探しています")
                    .font(.title2)
                    .bold()
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        // 検索APIに失敗した時は再検索できるようにする。
        } else if !viewModel.searchErrorMessage.isEmpty {
            VStack(spacing: 20) {
                ContentUnavailableView(
                    "旅行先を探せませんでした",
                    systemImage: "exclamationmark.triangle",
                    description: Text(viewModel.searchErrorMessage)
                )
                
                Button {
                    performSearch()
                } label: {
                    Text("もう一度検索する")
                        .font(.headline)
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 56)
                        .background(Color.blue)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                }
            }
            .padding(24)
        // 検索は成功したが候補が0件だった時の表示。
        } else if viewModel.places.isEmpty {
            VStack(spacing: 20) {
                ContentUnavailableView(
                    "条件に合う場所がありません",
                    systemImage: "magnifyingglass"
                )
                
                resetButton
            }
            .padding(24)
        // 取得した候補はおすすめタブへ保存しているので、その案内を出す。
        } else {
            VStack(spacing: 20) {
                ContentUnavailableView(
                    "おすすめに表示しました",
                    systemImage: "sparkles",
                    description: Text("検索結果はおすすめタブで確認できます。")
                )
                
                resetButton
            }
            .padding(24)
        }
    }
    
    private var resetButton: some View {
        Button {
            reset()
        } label: {
            Text("もう一度回答する")
                .font(.headline)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(Color.blue)
                .clipShape(RoundedRectangle(cornerRadius: 16))
        }
    }

    private var selectedItemId: String? {
        guard selectedAnswers.indices.contains(currentQuestionIndex) else {
            return nil
        }

        return selectedAnswers[currentQuestionIndex].itemId
    }
    
    private func answer(_ item: QueryItem) {
        // 戻って回答し直した場合、今より先の古い回答を捨てる。
        if selectedAnswers.count > currentQuestionIndex {
            selectedAnswers = Array(selectedAnswers.prefix(currentQuestionIndex))
        }
        
        // 今の質問IDと選んだ回答IDを検索用に保存する。
        selectedAnswers.append(
            QuestionAnswer(
                questionId: questions[currentQuestionIndex].id,
                itemId: item.itemId
            )
        )
        
        // 次の質問へ進み、最後の質問なら検索を開始する。
        if currentQuestionIndex < questions.count - 1 {
            currentQuestionIndex += 1
        } else {
            isCompleted = true
            performSearch()
        }
    }
    
    private func back() {
        // 前の質問へ戻る。回答の削除は次に選び直した時に行う。
        if currentQuestionIndex > 0 {
            currentQuestionIndex -= 1
        }
    }
    
    private func reset() {
        // 最初の質問からやり直せる状態に戻す。
        currentQuestionIndex = 0
        selectedAnswers.removeAll()
        isCompleted = false
        viewModel.clearSearchResults()
    }
    
    private func performSearch() {
        Task {
            // 位置情報を待ってから、回答と一緒に検索APIへ送る。
            let location = await locationService.currentLocationForSearch()
            
            await viewModel.searchPlaces(
                with: selectedAnswers,
                location: location
            )

            // 成功した検索結果をおすすめタブに保存し、タブ移動を依頼する。
            if viewModel.searchErrorMessage.isEmpty {
                searchResultStore.update(with: viewModel.places)
                onSearchFinished()
            }
        }
    }
    
}
