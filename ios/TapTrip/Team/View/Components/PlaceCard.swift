import SwiftUI
import UIKit

// スポットの写真・名前・タグ・詳細ボタンを表示するカード。
struct SpotCard: View {
    
    @Environment(\.colorScheme) private var colorScheme
    @EnvironmentObject private var favoriteSpotStore: FavoriteSpotStore
    @EnvironmentObject private var visitedSpotStore: VisitedSpotStore
    
    let spot: Spot
    var showsMatchScore = true
    
    var body: some View {
        
        VStack(spacing: 0) {
            
            ZStack {
                
                // API画像または代替画像をカード上部に表示する。
                placeImage
                
                VStack {
                    HStack {
                        Spacer()

                        visitedButton

                        // 右上のハートで保存済みを切り替える。
                        favoriteButton
                    }
                    
                    Spacer()
                    
                    // 質問結果から来たマッチ度がある時だけ表示する。
                    if showsMatchScore, let matchRate = spot.matchScore {
                        HStack {
                            Label("\(matchRate)% マッチ", systemImage: "sparkles")
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(.white)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 8)
                                .background(Color(red: 0.04, green: 0.48, blue: 0.62))
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                                .overlay {
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(
                                            Color.white.opacity(colorScheme == .dark ? 0.3 : 0.16),
                                            lineWidth: 1
                                        )
                                }
                                .shadow(
                                    color: colorScheme == .dark
                                    ? Color.cyan.opacity(0.22)
                                    : Color.black.opacity(0.18),
                                    radius: 5,
                                    y: 2
                                )
                            
                            Spacer()
                        }
                    }
                }
                .padding(16)
            }
            
            VStack(alignment: .leading, spacing: 14) {
                
                // 場所名。
                Text(spot.sName)
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundStyle(.primary)
                    .lineLimit(2)
                
                VStack(alignment: .leading, spacing: 8) {
                    // 住所または距離として入っている文字を表示する。
                    if !spot.address.isEmpty {
                        Label(spot.address, systemImage: "location")
                            .lineLimit(2)
                    }
                    
                    HStack(spacing: 10) {
                        // 評価が取れている場合だけ星と数値を表示する。
                        if let rating = spot.rating {
                            Label(String(format: "%.1f", rating), systemImage: "star.fill")
                                .foregroundStyle(.orange)
                        }
                        
                        // 種類や金額など、カードに出す短い状態テキスト。
                        if !spot.statusText.isEmpty {
                            Text(spot.statusText)
                                .foregroundStyle(.cyan)
                        }
                    }
                }
                .font(.subheadline)
                .foregroundStyle(.secondary)
                
                // スポットの特徴タグを折り返して表示する。
                FlowLayout(spacing: 8) {
                    ForEach(spot.displayTags, id: \.self) { tag in
                        TagView(title: tag)
                    }
                }
                
                // 詳細画面へ遷移する。
                NavigationLink(value: spot) {
                    Text("詳細を見る")
                        .fontWeight(.semibold)
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(
                            colorScheme == .dark
                            ? Color(red: 0.12, green: 0.33, blue: 0.45)
                            : Color(red: 0.38, green: 0.73, blue: 0.90)
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .contentShape(RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)
                .accessibilityLabel("\(spot.sName)の詳細を見る")
            }
            .padding(20)
        }
        .background(
            colorScheme == .dark
            ? Color(.secondarySystemBackground)
            : Color(.systemBackground)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 28)
                .stroke(
                    colorScheme == .dark
                    ? Color.white.opacity(0.08)
                    : Color.clear,
                    lineWidth: 1
                )
        )
        .clipShape(RoundedRectangle(cornerRadius: 28))
        .shadow(
            color: colorScheme == .dark
            ? .black.opacity(0.45)
            : .black.opacity(0.08),
            radius: 12,
            y: 4
        )
        .padding(.horizontal)
    }
    
    @ViewBuilder
    private var placeImage: some View {
        // Google Placesのリダイレクト先から画像データを取得して表示する。
        RemotePlaceImage(url: spot.imageURL) {
            placeholderImage
        }
        .frame(maxWidth: .infinity)
        .frame(height: 260)
        .clipped()
    }
    
    private var placeholderImage: some View {
        ZStack {
            // 画像がない時もカードの高さが崩れないよう代替背景を出す。
            LinearGradient(
                colors: [
                    colorScheme == .dark
                    ? Color.teal.opacity(0.28)
                    : Color.teal.opacity(0.18),
                    colorScheme == .dark
                    ? Color.blue.opacity(0.22)
                    : Color.blue.opacity(0.12)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            
            Image(systemName: "photo")
                .font(.system(size: 44, weight: .medium))
                .foregroundStyle(.teal)
        }
        .frame(height: 260)
        .clipped()
    }
    
    private var favoriteButton: some View {
        Button {
            // 保存済みなら解除、未保存なら保存する。
            favoriteSpotStore.toggle(spot)
        } label: {
            Image(systemName: favoriteSpotStore.contains(spot) ? "heart.fill" : "heart")
                .font(.title3)
                .foregroundStyle(.pink)
                .frame(width: 52, height: 52)
                .background(
                    colorScheme == .dark
                    ? Color(.tertiarySystemBackground)
                    : Color(.systemBackground)
                )
                .clipShape(Circle())
                .shadow(
                    color: .black.opacity(0.2),
                    radius: 4
                )
        }
        .accessibilityLabel(
            favoriteSpotStore.contains(spot) ? "お気に入りを解除" : "お気に入りに登録"
        )
    }

    private var visitedButton: some View {
        Button {
            visitedSpotStore.toggle(spot)
        } label: {
            Image(systemName: "shoeprints.fill")
            .font(.title3)
            .foregroundStyle(
                visitedSpotStore.contains(spot) ? Color.mint : Color.secondary
            )
            .frame(width: 52, height: 52)
            .background(
                colorScheme == .dark
                ? Color(.tertiarySystemBackground)
                : Color(.systemBackground)
            )
            .clipShape(Circle())
            .shadow(
                color: .black.opacity(0.2),
                radius: 4
            )
        }
        .accessibilityLabel(
            visitedSpotStore.contains(spot) ? "行き済みを解除" : "行き済みに登録"
        )
    }
}

// バックエンドから受け取った画像URLを読み込み、カードで表示できるUIImageへ変換する。
struct RemotePlaceImage<Placeholder: View>: View {
    let url: URL?
    let placeholder: Placeholder

    @State private var image: UIImage?
    @State private var isLoading = false

    init(
        url: URL?,
        @ViewBuilder placeholder: () -> Placeholder
    ) {
        self.url = url
        self.placeholder = placeholder()
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                if let image {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFill()
                        .frame(
                            width: geometry.size.width,
                            height: geometry.size.height
                        )
                        .clipped()
                } else {
                    placeholder
                        .frame(
                            width: geometry.size.width,
                            height: geometry.size.height
                        )
                        .clipped()

                    if isLoading, url != nil {
                        ProgressView()
                    }
                }
            }
            .frame(
                width: geometry.size.width,
                height: geometry.size.height
            )
            .clipped()
        }
        .task(id: url) {
            await loadImage()
        }
    }

    @MainActor
    private func loadImage() async {
        image = nil
        guard let url else {
            isLoading = false
            return
        }

        isLoading = true
        defer { isLoading = false }

        var request = URLRequest(
            url: url,
            cachePolicy: .reloadIgnoringLocalAndRemoteCacheData,
            timeoutInterval: 30
        )
        request.setValue("image/*", forHTTPHeaderField: "Accept")

        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard !Task.isCancelled else {
                return
            }

            guard let httpResponse = response as? HTTPURLResponse,
                  (200...299).contains(httpResponse.statusCode) else {
#if DEBUG
                let statusCode = (response as? HTTPURLResponse)?.statusCode ?? -1
                print("スポット画像取得失敗: HTTP \(statusCode)")
#endif
                return
            }

            guard let loadedImage = UIImage(data: data) else {
#if DEBUG
                print("スポット画像のデコードに失敗しました")
#endif
                return
            }

            image = loadedImage
        } catch {
#if DEBUG
            print("スポット画像通信失敗: \(error.localizedDescription)")
#endif
        }
    }
}

struct FlowLayout: Layout {
    var spacing: CGFloat = 8
    
    func sizeThatFits(
        proposal: ProposedViewSize,
        subviews: Subviews,
        cache: inout ()
    ) -> CGSize {
        let maxWidth = proposal.width ?? 0
        var currentX: CGFloat = 0
        var currentY: CGFloat = 0
        var rowHeight: CGFloat = 0
        
        for subview in subviews {
            // 子要素の幅を測り、入りきらなければ次の行へ送る。
            let size = subview.sizeThatFits(.unspecified)
            
            if currentX + size.width > maxWidth, currentX > 0 {
                currentX = 0
                currentY += rowHeight + spacing
                rowHeight = 0
            }
            
            currentX += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
        
        return CGSize(width: maxWidth, height: currentY + rowHeight)
    }
    
    func placeSubviews(
        in bounds: CGRect,
        proposal: ProposedViewSize,
        subviews: Subviews,
        cache: inout ()
    ) {
        var currentX = bounds.minX
        var currentY = bounds.minY
        var rowHeight: CGFloat = 0
        
        for subview in subviews {
            // 計算した行位置にタグを実際に配置する。
            let size = subview.sizeThatFits(.unspecified)
            
            if currentX + size.width > bounds.maxX, currentX > bounds.minX {
                currentX = bounds.minX
                currentY += rowHeight + spacing
                rowHeight = 0
            }
            
            subview.place(
                at: CGPoint(x: currentX, y: currentY),
                proposal: ProposedViewSize(size)
            )
            
            currentX += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
    }
}
