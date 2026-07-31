import SwiftUI

// 1問ずつ質問と回答ボタンを表示するカード。
struct QuestionCardView: View {
    
    @Environment(\.colorScheme) private var colorScheme
    
    let question: Question
    let currentQuestion: Int
    let totalQuestion: Int
    let selectedItemId: String?
    
    var onAnswer: (QueryItem) -> Void
    var onBack: () -> Void
    
    var body: some View {
        
        VStack(alignment: .leading, spacing: 28) {
            
            ScrollView{
                
                // 現在何問目かと進捗バー。
                VStack(alignment: .leading, spacing: 12) {
                    
                    Text("質問 \(currentQuestion) / \(totalQuestion)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    
                    ProgressView(
                        value: Double(currentQuestion),
                        total: Double(totalQuestion)
                    )
                    .tint(.blue)
                    .scaleEffect(y: 2)
                }
                
                // 説明文と質問タイトル。
                VStack(alignment: .leading, spacing: 10) {
                    
                    Text("あなたに合った旅行先をご提案するため、いくつか質問します。")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    
                    Text(question.title)
                        .font(.system(size: 32, weight: .bold))
                }
                
                // 回答候補をボタンとして縦に並べる。
                VStack(spacing: 16) {
                    
                    ForEach(question.queryItems) { item in
                        
                        Button {
                            onAnswer(item)
                        } label: {
                            answerButton(
                                text: item.title,
                                isSelected: item.itemId == selectedItemId
                            )
                        }
                        
                    }
                }
                
                // 2問目以降だけ戻るボタンを出す。
                if currentQuestion > 1 {
                    Button {
                        onBack()
                        
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "chevron.left")
                            Text("戻る")
                        }
                        .font(.headline)
                        .foregroundStyle(.blue)
                        .frame(maxWidth: .infinity)
                    }
                    .padding(18)
                }
                
                Spacer()
            }
            .padding(24)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(
                LinearGradient(
                    colors: [
                        Color.blue.opacity(0.06),
                        Color(.systemBackground)
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
        }
    }
    
    @ViewBuilder
    func answerButton(text: String, isSelected: Bool) -> some View {
        
        HStack {
            
            // 回答文。
            Text(text)
                .font(.headline)
                .foregroundStyle(isSelected ? .white : .primary)
            
            Spacer()
            
            // 次へ進むことを示す矢印。
            Image(systemName: isSelected ? "checkmark.circle.fill" : "chevron.right")
                .foregroundStyle(isSelected ? .white : .gray)
            
        }
        .padding()
        .frame(height: 64)
        .background(isSelected ? Color.blue : Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 18))
        .overlay {
            RoundedRectangle(cornerRadius: 18)
                .stroke(
                    isSelected
                    ? Color.blue
                    : colorScheme == .dark
                        ? Color.white.opacity(0.08)
                        : Color.gray.opacity(0.15),
                    lineWidth: isSelected ? 2 : 1
                )
        }
        .shadow(
            color: colorScheme == .dark ? .black.opacity(0.25) : .black.opacity(0.04),
            radius: 10,
            y: 5
        )
    }
}
    

#Preview {
    
    let sample = Question(
        id: 1,
        title: "子供と一緒に行きますか？",
        queryItems: [
            QueryItem(itemId: "1", title: "はい", searchType: ""),
            QueryItem(itemId: "2", title: "いいえ", searchType: "")
        ]
    )
    
    QuestionCardView(
        question: sample,
        currentQuestion: 1,
        totalQuestion: 5,
        selectedItemId: "1",
        onAnswer: { _ in },
        onBack: {}
    )
}
