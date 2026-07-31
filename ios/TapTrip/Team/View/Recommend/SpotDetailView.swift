import MapKit
import SwiftUI

// スポットの画像・住所・理由・地図を表示する詳細画面。
struct SpotDetailView: View {
    
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var favoriteSpotStore: FavoriteSpotStore
    @EnvironmentObject private var visitedSpotStore: VisitedSpotStore
    
    let spot: Spot
    
    @State private var mapPosition: MapCameraPosition
    
    init(spot: Spot) {
        self.spot = spot
        
        // 地図の初期位置をスポットの緯度経度に合わせる。
        let center = CLLocationCoordinate2D(latitude: spot.lat, longitude: spot.long)
        _mapPosition = State(
            initialValue: .region(
                MKCoordinateRegion(
                    center: center,
                    span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)
                )
            )
        )
    }
    
    var body: some View {
        ZStack(alignment: .topLeading) {
            // 画像から情報セクションまで縦にスクロールして見せる。
            ScrollView {
                VStack(spacing: 0) {
                    headerImage
                    
                    // 下側の白いパネルに詳細情報をまとめる。
                    VStack(alignment: .leading, spacing: 24) {
                        mainInfo
                        reasonSection
                        timeSection
                        mapSection
                    }
                    .padding(18)
                    .padding(.bottom, 20)
                    .background(Color(.systemBackground))
                    .clipShape(
                        UnevenRoundedRectangle(
                            topLeadingRadius: 24,
                            topTrailingRadius: 24
                        )
                    )
                    .offset(y: -28)
                }
            }
            
            // スクロール位置に関係なく、戻るボタンを画面上部へ固定する。
                circleButton(systemName: "chevron.left") {
                    dismiss()
                }
            .padding(.leading, 18)
            .padding(.top, 58)
        }
        .ignoresSafeArea(edges: .top)
        .background(Color(.systemBackground))
        .safeAreaInset(edge: .bottom, spacing: 0) {
            // 経路案内と重ならない位置まで内容をスクロールできるようにする。
            if spot.directionURL != nil {
                bottomActions
            }
        }
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
    }
    
    private var headerImage: some View {
        ZStack(alignment: .top) {
            Group {
                // API画像があれば表示し、なければプレースホルダーにする。
                RemotePlaceImage(url: spot.imageURL) {
                    imagePlaceholder
                }
            }
            .frame(height: 330)
            .clipped()
            
            // 画像上のボタンやバッジが読めるように薄く暗くする。
            LinearGradient(
                colors: [
                    .black.opacity(0.35),
                    .clear,
                    .black.opacity(0.18)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .frame(height: 330)
            
            HStack {
                Spacer()

                circleButton(
                    systemName: "shoeprints.fill",
                    color: visitedSpotStore.contains(spot) ? .mint : .white
                ) {
                    visitedSpotStore.toggle(spot)
                }
                .accessibilityLabel(
                    visitedSpotStore.contains(spot) ? "行き済みを解除" : "行き済みに登録"
                )

                // ハートで保存済みの追加・削除を切り替える。
                circleButton(
                    systemName: favoriteSpotStore.contains(spot) ? "heart.fill" : "heart",
                    color: .pink
                ) {
                    favoriteSpotStore.toggle(spot)
                }
                .accessibilityLabel(
                    favoriteSpotStore.contains(spot) ? "お気に入りを解除" : "お気に入りに登録"
                )
            }
            .padding(.horizontal, 18)
            .padding(.top, 58)
            
        }
    }
    
    private var imagePlaceholder: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color.teal.opacity(colorScheme == .dark ? 0.3 : 0.18),
                    Color.blue.opacity(colorScheme == .dark ? 0.25 : 0.12)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            
            Image(systemName: "photo")
                .font(.system(size: 46, weight: .medium))
                .foregroundStyle(.teal)
        }
    }
    
    private var mainInfo: some View {
        VStack(alignment: .leading, spacing: 14) {
            // 場所名を一番目立つ情報として表示する。
            Text(spot.sName)
                .font(.title3.weight(.semibold))
                .foregroundStyle(.primary)
                .fixedSize(horizontal: false, vertical: true)
            
            // 長い住所や種類も省略せず、それぞれ独立した行に表示する。
            VStack(alignment: .leading, spacing: 10) {
                if !spot.address.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                    Label {
                        Text(spot.address)
                            .fixedSize(horizontal: false, vertical: true)
                    } icon: {
                        Image(systemName: "location")
                    }
                }
                
                if !spot.statusText.isEmpty {
                    Label {
                        Text(spot.statusText)
                            .fixedSize(horizontal: false, vertical: true)
                    } icon: {
                        Image(systemName: "tag")
                    }
                    .foregroundStyle(.cyan)
                }
                
                if let priceLevel = spot.priceLevel,
                   !priceLevel.isEmpty,
                   priceLevel != spot.statusText {
                    Label {
                        Text(priceLevel)
                            .fixedSize(horizontal: false, vertical: true)
                    } icon: {
                        Image(systemName: "yensign.circle")
                    }
                }
            }
            .font(.subheadline)
            .foregroundStyle(.secondary)
            .frame(maxWidth: .infinity, alignment: .leading)
            
            // APIのtypesや子ども向け情報をタグとして並べる。
            FlowLayout(spacing: 8) {
                ForEach(spot.displayTags, id: \.self) { tag in
                    TagView(title: tag)
                }
            }
        }
    }
    
    private var reasonSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("おすすめの理由")
                .font(.headline)
            
            // summaryやスポット属性など、取れている情報から理由を作る。
            VStack(alignment: .leading, spacing: 12) {
                ForEach(reasons, id: \.self) { reason in
                    Label(reason, systemImage: "checkmark.circle.fill")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .symbolRenderingMode(.palette)
                        .foregroundStyle(.secondary, .mint)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
            .padding(16)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Color.blue.opacity(colorScheme == .dark ? 0.16 : 0.08))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }
    
    private var timeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("おすすめの時間帯")
                .font(.headline)
            
            // APIに時間帯データがないため、今は汎用のおすすめ時間を表示する。
            HStack(spacing: 12) {
                timeCard(icon: "sun.max", title: "日中", subtitle: "周辺を楽しみやすい時間")
                timeCard(icon: "moon", title: "夕方以降", subtitle: "落ち着いて過ごせます")
            }
        }
    }
    
    @ViewBuilder
    private var mapSection: some View {
        if hasCoordinate {
            VStack(alignment: .leading, spacing: 12) {
                Text("場所")
                    .font(.headline)
                
                ZStack(alignment: .bottomTrailing) {
                    // スポットの緯度経度をMap上にピン表示する。
                    Map(position: $mapPosition) {
                        Marker(
                            spot.sName,
                            coordinate: CLLocationCoordinate2D(latitude: spot.lat, longitude: spot.long)
                        )
                    }
                    .frame(height: 170)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                    
                    if let directionURL = spot.directionURL {
                        // 地図右下から外部の経路案内URLを開けるようにする。
                        Link(destination: directionURL) {
                            Image(systemName: "arrow.up.right.square")
                                .font(.title3)
                                .foregroundStyle(.blue)
                                .frame(width: 44, height: 44)
                                .background(Color(.systemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .shadow(color: .black.opacity(0.14), radius: 6, y: 3)
                        }
                        .padding(12)
                    }
                }
            }
        }
    }
    
    private var bottomActions: some View {
        VStack(spacing: 12) {
            if let directionURL = spot.directionURL {
                // APIから経路URLがある場合だけ経路案内ボタンを出す。
                Link(destination: directionURL) {
                    Label("経路案内", systemImage: "location.north.fill")
                        .font(.headline)
                        .foregroundStyle(.primary)
                        .frame(maxWidth: .infinity)
                        .frame(height: 58)
                        .background(Color(red: 0.45, green: 0.78, blue: 0.96))
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                }
            }
        }
        .padding(.horizontal, 18)
        .padding(.top, 14)
        .padding(.bottom, 20)
        .background(.ultraThinMaterial)
        .overlay(alignment: .top) {
            Divider()
        }
    }
    
    private var reasons: [String] {
        var items: [String] = []
        
        // APIのsummaryがあれば説明文として表示する。
        if let summary = spot.summary,
           !summary.isEmpty,
           summary != "説明はありません。" {
            items.append(summary)
        }
        
        // primaryTypeや属性から追加の理由を作る。
        if let primaryType = spot.primaryType, !primaryType.isEmpty {
            items.append("\(primaryType)として条件に合っています")
        }
        
        if spot.goodForChildren == true {
            items.append("子ども連れでも利用しやすいスポット")
        }
        
        if spot.hasParking == true {
            items.append("駐車場があります")
        }
        
        if let rating = spot.rating, rating >= 4 {
            items.append("評価が高いスポットです")
        }
        
        if items.isEmpty {
            items.append("質問の回答に合う候補として見つかりました")
        }
        
        // 理由が多すぎると読みづらいので最大4件にする。
        return Array(items.prefix(4))
    }
    
    private var hasCoordinate: Bool {
        // 緯度経度がどちらも0なら地図を出さない。
        spot.lat != 0 || spot.long != 0
    }
    
    private func timeCard(icon: String, title: String, subtitle: String) -> some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundStyle(.cyan)
            
            Text(title)
                .font(.headline)
            
            Text(subtitle)
                .font(.caption)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity)
        .frame(minHeight: 104)
        .padding(.vertical, 8)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay {
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color.blue.opacity(0.18), lineWidth: 1)
        }
    }
    
    private func circleButton(
        systemName: String,
        color: Color = .white,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            Image(systemName: systemName)
                .font(.headline)
                .foregroundStyle(color)
                .frame(width: 44, height: 44)
                .background(.black.opacity(0.36))
                .clipShape(Circle())
        }
    }
}
