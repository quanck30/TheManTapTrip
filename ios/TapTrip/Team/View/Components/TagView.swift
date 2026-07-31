import SwiftUI

// スポットの特徴タグを小さなラベルで表示する部品。
struct TagView: View {
    
    @Environment(\.colorScheme) private var colorScheme
    
    let title: String
    
    var body: some View {
        // ダークモードでは背景と文字色を少し強めて読みやすくする。
        Text(title)
            .font(.subheadline)
            .foregroundStyle(colorScheme == .dark ? .teal : .primary)
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(
                colorScheme == .dark
                ? Color.teal.opacity(0.18)
                : Color(.secondarySystemBackground)
            )
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(
                        colorScheme == .dark
                        ? Color.teal.opacity(0.35)
                        : Color.gray.opacity(0.25)
                    )
            )
    }
}
