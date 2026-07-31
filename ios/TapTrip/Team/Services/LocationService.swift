import Combine
import CoreLocation
import Foundation

// 現在地を取得し、検索に使う緯度経度を用意するサービス。
class LocationService: NSObject, ObservableObject, CLLocationManagerDelegate {
    
    @Published var currentLocation: PlaceSearchLocation?

    // 画面側で、初回の許可確認と設定画面への案内を切り替えるために公開する。
    var authorizationStatus: CLAuthorizationStatus {
        manager.authorizationStatus
    }
    
    private let manager = CLLocationManager()
    private var locationContinuation: CheckedContinuation<PlaceSearchLocation, Never>?
    private var fallbackTask: Task<Void, Never>?
    
    override init() {
        super.init()
        
        // iPhoneの位置情報更新をこのクラスで受け取る。
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
        manager.distanceFilter = 10
    }
    
    func requestLocation() {
        // 権限の状態に合わせて、許可確認・位置取得・代替位置のどれかを行う。
        switch manager.authorizationStatus {
        case .notDetermined:
            manager.requestWhenInUseAuthorization()
        case .authorizedAlways, .authorizedWhenInUse:
            manager.requestLocation()
        case .denied, .restricted:
            finishLocationRequest(with: fallbackLocation)
        default:
            break
        }
    }
    
    func currentLocationForSearch() async -> PlaceSearchLocation {
        // すでに実際の現在地が取れていれば、それをそのまま使う。
        if let currentLocation,
           !currentLocation.isAppleSimulatorDefaultLocation {
            return currentLocation
        }
        
        // 権限がない場合は検索を止めず、大阪駅付近の代替位置を使う。
        switch manager.authorizationStatus {
        case .denied, .restricted:
            return fallbackLocation
        default:
            break
        }
        
        // 位置情報のコールバックをasyncで待てる形に変換する。
        return await withCheckedContinuation { continuation in
            locationContinuation = continuation
            requestLocation()
            
            // 位置情報が返らない時は15秒で代替位置に切り替える。
            fallbackTask?.cancel()
            fallbackTask = Task { [weak self] in
                try? await Task.sleep(for: .seconds(15))
                
                await MainActor.run {
                    guard let self, self.locationContinuation != nil else {
                        return
                    }
                    
                    self.finishLocationRequest(with: self.fallbackLocation)
                }
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        // 取得できた位置の中から、正常で一番新しいものを使う。
        guard let location = locations
            .filter({ $0.horizontalAccuracy >= 0 })
            .sorted(by: { $0.timestamp > $1.timestamp })
            .first else {
            return
        }
        
        DispatchQueue.main.async {
            let location = PlaceSearchLocation(
                latitude: location.coordinate.latitude,
                longitude: location.coordinate.longitude
            )
            
            // シミュレータの初期位置Apple Parkは実用位置ではないため代替する。
            if location.isAppleSimulatorDefaultLocation {
                self.finishLocationRequest(with: self.fallbackLocation)
            } else {
                self.finishLocationRequest(with: location)
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        finishLocationRequest(with: fallbackLocation)
    }
    
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        switch manager.authorizationStatus {
        case .authorizedAlways, .authorizedWhenInUse:
            manager.requestLocation()
        case .denied, .restricted:
            finishLocationRequest(with: fallbackLocation)
        default:
            break
        }
    }
    
    private func finishLocationRequest(with location: PlaceSearchLocation) {
        // 待機中の処理を終わらせ、画面から参照できる現在地として保存する。
        fallbackTask?.cancel()
        fallbackTask = nil
        currentLocation = location
        locationContinuation?.resume(returning: location)
        locationContinuation = nil
    }
    
    private var fallbackLocation: PlaceSearchLocation {
        // 現在地が取れない場合に使う大阪駅付近の位置。
        PlaceSearchLocation(
            latitude: 34.702485,
            longitude: 135.495951
        )
    }
}

private extension PlaceSearchLocation {
    
    var isAppleSimulatorDefaultLocation: Bool {
        // iOSシミュレータが返しがちなApple Park周辺かどうかを判定する。
        let location = CLLocation(latitude: latitude, longitude: longitude)
        let applePark = CLLocation(latitude: 37.3349, longitude: -122.0090)
        
        return location.distance(from: applePark) < 5_000
    }
}
