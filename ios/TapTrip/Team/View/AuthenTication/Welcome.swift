import SwiftUI

// 初回表示用の案内と開始ボタンを見せる画面。
struct WelcomeView: View {
    
    @Environment(\.colorScheme) private var colorScheme
    
    var body: some View {
        ZStack {
            // 初回画面全体の背景。
            LinearGradient(
                colors: [
                    colorScheme == .dark
                    ? Color(.systemBackground)
                    : Color(red: 0.95, green: 0.98, blue: 1.0),
                    colorScheme == .dark
                    ? Color(.secondarySystemBackground)
                    : Color(red: 0.89, green: 0.96, blue: 0.95)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 24) {
                    
                    // アプリ名ロゴ。
                    HStack(spacing: 8) {
                        Circle()
                            .fill(Color.primary)
                            .frame(width: 18, height: 18)
                        
                        Text("TapTrip")
                            .font(.title3)
                            .fontWeight(.bold)
                    }
                    .padding(.top, 16)
                    
                    // 何をするアプリかを短く説明するタイトル。
                    VStack(spacing: 12) {
                        Text("今日はどこへ行く？")
                            .font(.system(size: 30, weight: .medium))
                            .foregroundColor(Color.blue.opacity(0.9))
                        
                        Text("いくつかの質問に答えるだけで、TapTripが\n今の気分にぴったりの場所を提案します。")
                            .font(.footnote)
                            .multilineTextAlignment(.center)
                            .foregroundColor(.secondary)
                    }
                    
                    // アプリの特徴を小さなタグで見せる。
                    VStack(spacing: 10) {
                        
                        HStack(spacing: 10) {
                            ChipView(
                                icon: "figure.walk",
                                title: "メンモーデ"
                            )
                            
                            ChipView(
                                icon: "mappin.and.ellipse",
                                title: "周辺スポット"
                            )
                        }
                        
                        ChipView(
                            icon: "face.smiling",
                            title: "気分にフィット"
                        )
                    }
                    
                    // 旅の雰囲気を出すイラストカード。
                    IllustrationCard()
                    
                    // 開始・登録・ログインへ進む入口。
                    VStack(spacing: 14) {
                        
                        NavigationLink {
                            QuestionView()
                        } label: {
                            // すぐ質問画面から探索を始める。
                            HStack {
                                Spacer()
                                Text("探索をはじめる")
                                    .fontWeight(.medium)
                                Image(systemName: "arrow.right")
                                Spacer()
                            }
                            .frame(height: 56)
                            .background(
                                Color(red: 0.45, green: 0.78, blue: 0.96)
                            )
                            .foregroundColor(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                        
                        Button {
                            
                        } label: {
                            // 新規登録ボタン。現在は遷移処理未接続。
                            HStack {
                                Spacer()
                                Text("新規登録")
                                    .fontWeight(.medium)
                                Image(systemName: "arrow.right")
                                Spacer()
                            }
                            .frame(height: 56)
                            .background(
                                Color(red: 0.45, green: 0.78, blue: 0.96)
                            )
                            .foregroundColor(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                        
                        Button("すでにアカウントをお持ちの方") {
                            
                        }
                        .font(.caption)
                        .foregroundColor(.secondary)
                    }
                    .padding(.horizontal)
                }
                .padding()
            }
        }
    }
}

// MARK: - Chip

struct ChipView: View {
    
    let icon: String
    let title: String
    
    var body: some View {
        // アイコンと短い言葉をカプセル型で表示する。
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.caption)
            
            Text(title)
                .font(.caption)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .background(Color(.secondarySystemBackground))
        .clipShape(Capsule())
        .overlay(
            Capsule()
                .stroke(Color.primary.opacity(0.08), lineWidth: 1)
        )
        .shadow(color: .black.opacity(0.06),
                radius: 4,
                y: 2)
    }
}

// MARK: - Illustration

struct IllustrationCard: View {
    
    var body: some View {
        ZStack {
            
            // イラスト全体の背景カード。
            RoundedRectangle(cornerRadius: 24)
                .fill(
                    LinearGradient(
                        colors: [
                            Color(red: 0.76, green: 0.95, blue: 0.91),
                            Color(red: 0.67, green: 0.89, blue: 0.96)
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
            
            VStack {
                Spacer()
                
                // 山のシルエット。
                HStack(spacing: 0) {
                    Mountain()
                    Mountain()
                        .offset(x: -30)
                    Mountain()
                        .offset(x: -60)
                }
                .offset(y: -40)
                
                Spacer()
                
                // 画面奥へ伸びる道。
                Path { path in
                    path.move(to: CGPoint(x: 160, y: 300))
                    path.addCurve(
                        to: CGPoint(x: 120, y: 0),
                        control1: CGPoint(x: 20, y: 220),
                        control2: CGPoint(x: 280, y: 100)
                    )
                }
                .stroke(
                    Color.white.opacity(0.9),
                    style: StrokeStyle(
                        lineWidth: 22,
                        lineCap: .round
                    )
                )
                .frame(height: 260)
            }
            
            // カフェ・公園・散歩を表す浮きアイコン。
            VStack {
                HStack {
                    FloatingIcon(
                        symbol: "cup.and.saucer",
                        color: .pink
                    )
                    
                    Spacer()
                    
                    FloatingIcon(
                        symbol: "tree.fill",
                        color: .blue
                    )
                }
                
                Spacer()
                
                HStack {
                    Spacer()
                    
                    FloatingIcon(
                        symbol: "figure.walk",
                        color: .blue
                    )
                    
                    Spacer()
                }
            }
            .padding(28)
        }
        .frame(height: 360)
        .shadow(
            color: .black.opacity(0.12),
            radius: 10,
            y: 6
        )
    }
}

struct FloatingIcon: View {
    
    @Environment(\.colorScheme) private var colorScheme
    
    let symbol: String
    let color: Color
    
    var body: some View {
        // 丸い背景にSF Symbolsを乗せる。
        ZStack {
            Circle()
                .fill(Color(.secondarySystemBackground))
            
            Image(systemName: symbol)
                .foregroundColor(color)
        }
        .frame(width: 44, height: 44)
        .shadow(color: .black.opacity(0.08),
                radius: 6,
                y: 3)
    }
}

struct Mountain: View {
    var body: some View {
        // 三角形を山として使う。
        Triangle()
            .fill(Color.cyan.opacity(0.5))
            .frame(width: 100, height: 60)
    }
}

struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        // 上頂点と左右下を結ぶ三角形を描く。
        var path = Path()
        
        path.move(to: CGPoint(x: rect.midX, y: 0))
        path.addLine(to: CGPoint(x: 0, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.closeSubpath()
        
        return path
    }
}

#Preview {
    WelcomeView()
}
