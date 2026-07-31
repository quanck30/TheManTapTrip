//
//  NotificationSettingsView.swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/07/07.
//

import SwiftUI
import UserNotifications

struct NotificationSettingsView: View {

    // 通知許可の状態や予約処理はLocalNotificationServiceにまとめている。
    @StateObject private var notificationService = LocalNotificationService.shared

    // ユーザーが通知をオンにしたかどうかを、アプリを閉じても残す。
    @AppStorage("isDailyRecommendationReminderEnabled")
    private var isDailyReminderEnabled = false

    @State private var message = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                statusCard

                VStack(alignment: .leading, spacing: 14) {
                    // オンにすると毎朝9時の通知を予約し、オフにすると予約を取り消す。
                    Toggle("通知を受信しますか", isOn: $isDailyReminderEnabled)
                        .font(.headline)

                    Text("毎朝9時に、TapTripでおすすめを探す通知を出します。")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                .padding()
                .background(Color(.secondarySystemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 18))

                Button {
                    Task {
                        // 実機で通知が出るか確認するため、5秒後のテスト通知を予約する。
                        let didSchedule = await notificationService.scheduleTestNotification()
                        await notificationService.refreshAuthorizationStatus()
                        if didSchedule {
                            message = "5秒後のテスト通知を予約しました"
                        } else if notificationService.authorizationStatus == .denied {
                            message = "設定アプリで通知を許可してください"
                        } else {
                            message = "通知を許可してからもう一度試してください"
                        }
                    }
                } label: {
                    Label("テスト通知を送る", systemImage: "bell.badge")
                        .font(.headline)
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                }

                if !message.isEmpty {
                    Text(message)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity, alignment: .center)
                }
            }
            .padding()
        }
        .navigationTitle("通知設定")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            // 画面を開いた時点の通知許可状態を表示へ反映する。
            Task {
                await notificationService.refreshAuthorizationStatus()
            }
        }
        .onChange(of: isDailyReminderEnabled) { _, isEnabled in
            updateDailyReminder(isEnabled: isEnabled)
        }
    }

    private var statusCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 10) {
                Image(systemName: statusIcon)
                    .foregroundStyle(statusColor)

                Text("通知の状態")
                    .font(.headline)
            }

            Text(statusText)
                .font(.subheadline)
                .foregroundStyle(.secondary)

            if notificationService.authorizationStatus == .notDetermined {
                Button {
                    Task {
                        await notificationService.requestAuthorization()
                    }
                } label: {
                    Text("通知を許可する")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue.opacity(0.12))
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                }
            }
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 18))
    }

    private var statusText: String {
        switch notificationService.authorizationStatus {
        case .notDetermined:
            return "まだ通知の許可を確認していません。"
        case .denied:
            return "通知がオフです。iPhoneの設定アプリから許可してください。"
        case .authorized, .provisional, .ephemeral:
            return "通知を送れる状態です。"
        @unknown default:
            return "通知状態を確認できませんでした。"
        }
    }

    private var statusIcon: String {
        switch notificationService.authorizationStatus {
        case .authorized, .provisional, .ephemeral:
            return "checkmark.circle.fill"
        case .denied:
            return "xmark.circle.fill"
        default:
            return "bell"
        }
    }

    private var statusColor: Color {
        switch notificationService.authorizationStatus {
        case .authorized, .provisional, .ephemeral:
            return .green
        case .denied:
            return .red
        default:
            return .blue
        }
    }

    private func updateDailyReminder(isEnabled: Bool) {
        if isEnabled {
            Task {
                // 通知がオンになったら、時刻指定なしで毎朝9時の通知を予約する。
                await notificationService.scheduleDailyRecommendationReminder()
                await notificationService.refreshAuthorizationStatus()
            }
        } else {
            // 通知がオフになったら、毎朝9時の通知予約だけを取り消す。
            notificationService.cancelDailyRecommendationReminder()
        }
    }
}

#Preview {
    NavigationStack {
        NotificationSettingsView()
    }
}
