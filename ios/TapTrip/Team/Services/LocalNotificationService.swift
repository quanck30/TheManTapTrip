//
//  LocalNotificationService.swift
//  TapTrip
//
//  Created by 竹原昊生 on 2026/07/07.
//
import Foundation
import Combine
import UserNotifications

// iPhone本体だけで動くローカル通知を管理するサービス。
@MainActor
final class LocalNotificationService: NSObject, ObservableObject, UNUserNotificationCenterDelegate {

    // アプリ内のどの画面からでも同じ通知設定を使えるように共有インスタンスにしている。
    static let shared = LocalNotificationService()

    // 画面側が通知許可の状態を表示できるように、現在の許可状態を保持する。
    @Published
    private(set) var authorizationStatus: UNAuthorizationStatus = .notDetermined

    private let center = UNUserNotificationCenter.current()

    // 毎日通知は同じIDで予約し直すことで、通知が重複して増えないようにする。
    private let dailyReminderIdentifier = "dailyRecommendationReminder"

    private override init() {
        super.init()
        center.delegate = self

        Task {
            await refreshAuthorizationStatus()
        }
    }

    // アプリを開いたままでもテスト通知のバナーを表示できるようにする。
    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification
    ) async -> UNNotificationPresentationOptions {
        [.banner, .sound, .badge]
    }

    func refreshAuthorizationStatus() async {
        // 現在の通知許可状態を画面に反映する。
        let setting = await center.notificationSettings()
        authorizationStatus = setting.authorizationStatus
    }

    func requestAuthorization() async {
        // 初回だけiOS標準の通知許可ダイアログを出す。
        do {
            _ = try await center.requestAuthorization(options: [.alert, .sound, .badge])
            await refreshAuthorizationStatus()
        } catch {
            print("通知許可の取得に失敗しました: \(error)")
        }
    }

    @discardableResult
    func scheduleTestNotification() async -> Bool {
        // 通知機能が動いているかをすぐ確認できるよう、動作確認用に5秒後の通知を予約する。
        if authorizationStatus == .notDetermined {
            await requestAuthorization()
        } else {
            await refreshAuthorizationStatus()
        }

        guard canScheduleNotification else {
            return false
        }

        let content = UNMutableNotificationContent()
        content.title = "TapTrip"
        content.body = "スポットを探しませんか？(test)"
        content.sound = .default

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 5, repeats: false)
        let request = UNNotificationRequest(
            identifier: "testNotification-\(UUID().uuidString)",
            content: content,
            trigger: trigger
        )

        do {
            try await center.add(request)
            return true
        } catch {
            print("通知の予約に失敗しました: \(error)")
            return false
        }
    }

    func scheduleDailyRecommendationReminder() async {
        // 通知設定がオンになった時に、毎朝9時のおすすめ通知を1件だけ予約する。
        if authorizationStatus == .notDetermined {
            await requestAuthorization()
        } else {
            await refreshAuthorizationStatus()
        }

        guard canScheduleNotification else {
            return
        }

        cancelDailyRecommendationReminder()

        let content = UNMutableNotificationContent()
        content.title = "TapTrip"
        content.body = "お出かけ先に悩んでいますか？ 新しい出会いを見つけよう！！"
        content.sound = .default

        // 時刻指定機能は使わず、毎日9:00に固定して通知する。
        var dateComponents = DateComponents()
        dateComponents.hour = 9
        dateComponents.minute = 0

        let trigger = UNCalendarNotificationTrigger(
            dateMatching: dateComponents,
            repeats: true
        )

        let request = UNNotificationRequest(
            identifier: dailyReminderIdentifier,
            content: content,
            trigger: trigger
        )

        do {
            try await center.add(request)
        } catch {
            print("毎日通知予約に失敗しました: \(error)")
        }
    }

    func cancelDailyRecommendationReminder() {
        // 毎日のおすすめ通知だけを取り消す。
        center.removePendingNotificationRequests(withIdentifiers: [dailyReminderIdentifier])
    }

    private var canScheduleNotification: Bool {
        // 許可済み、仮許可、App Clip用許可なら通知予約できる。
        switch authorizationStatus {
        case .authorized, .provisional, .ephemeral:
            return true
        case .notDetermined, .denied:
            return false
        @unknown default:
            return false
        }
    }
}
