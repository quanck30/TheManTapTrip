import SwiftUI

// ログインしていない時に、ログイン画面へ進ませる案内画面。
struct LoginRequiredView: View {
    
    var loginAction: () -> Void
    
    var body: some View {
        VStack(spacing: 24) {
            
            Spacer()
            
            // ログインが必要なことを示すアイコン。
            Image(systemName: "lock.fill")
                .font(.system(size: 60))
                .foregroundStyle(.blue)
            
            // ログインが必要な理由の説明。
            VStack(spacing: 12) {
                Text("ログインが必要です")
                    .font(.title2)
                    .fontWeight(.bold)
                
                Text("スポットの保存機能や、マイアカウントの確認・編集を行うにはログインが必要です。")
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.gray)
                    .padding(.horizontal, 32)
            }
            
            Button {
                // 親画面にログイン画面へ進むよう伝える。
                loginAction()
            } label: {
                Text("ログイン画面へ進む")
                    .foregroundStyle(.white)
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .frame(height: 56)
                    .background(
                        LinearGradient(
                            colors: [.cyan, .blue],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .clipShape(Capsule())
            }
            .padding(.horizontal)
            
            Spacer()
        }
    }
}
