import SwiftUI

// ホームで探索カテゴリや空状態を表示する画面。
struct ExploreView: View {
    
    @State private var selected = "すべて"
    
    let filters = ["すべて","週末","カフェ","散歩"]
    
    var body: some View {
        
        NavigationStack {
            
            VStack(alignment: .leading) {
                
                // 上部のメニュー・ロゴ・検索アイコン。
                header
                
                Text("行きたい場所")
                    .font(.largeTitle)
                
                // 横スクロールのカテゴリボタン。
                filterBar
                
                Spacer()
                
                // 現在は候補カードを置くための仮エリア。
                VStack(spacing: 16) {
                    
//                    Image(systemName: "location.magnifyingglass")
//                        .font(.system(size: 60))
//                        .foregroundColor(.gray.opacity(0.5))
//                    
//                    Text("まだおすすめがありません")
//                        .font(.headline)
//                    
//                    Text("条件を選択すると\nおすすめスポットが表示されます")
//                        .multilineTextAlignment(.center)
//                        .foregroundColor(.secondary)
                    LazyVStack{
//                        SpotCard(spot: spot)
                    }
                    
                }
                .frame(maxWidth: .infinity)
                
                Spacer()
                
                /*collectionButton*/
                
            }
            .padding(.horizontal)
        }
    }
    
    var header: some View {
        HStack {
            // 左メニュー。
            Image(systemName: "line.3.horizontal")
            
            Text("TapTrip")
                .font(.title3.bold())
            
            Spacer()
            
            // 保存済み・検索・アカウントへの入口表示。
            Text("保存済み")
            
            Image(systemName: "magnifyingglass")
            
            Image(systemName: "person.crop.circle.fill")
        }
        .foregroundColor(.cyan)
    }
    
    var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(filters, id: \.self) { filter in
                    Button {
                        // 選択中のカテゴリを切り替える。
                        selected = filter
                    } label: {
                        Text(filter)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(
                                selected == filter
                                ? Color.cyan.opacity(0.2)
                                : Color(.secondarySystemBackground)
                            )
                            .clipShape(Capsule())
                    }
                }
            }
        }
    }
    
    var collectionButton: some View {
        // 将来コレクション作成を追加するための点線カード。
        RoundedRectangle(cornerRadius: 16)
            .stroke(style: StrokeStyle(lineWidth: 1, dash: [4]))
            .fill(.gray.opacity(0.5))
            .frame(height: 140)
            .overlay {
                VStack {
                    Circle()
                        .fill(.cyan)
                        .frame(width: 48,height: 48)
                        .overlay {
                            Image(systemName: "plus")
                                .foregroundColor(.white)
                        }
                    
                    Text("コレクションを作成する")
                }
            }
    }
}

#Preview {
    ExploreView()
}
