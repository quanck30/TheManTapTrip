# Team System

**React（Vite）** + **Laravel（PHP-FPM）** + **MySQL** のモノレポを **Docker Compose** で起動します。本書ではリポジトリで使っている Docker の技術と、GitHub から取得したあとの起動手順・各フォルダの役割をまとめます。

---

## ディレクトリ構成

| ディレクトリ / ファイル | 役割 |
|------------------------|------|
| `docker-compose.yml` | サービス `nginx` / `client` / `backend` / `mysql`、ネットワーク `app-network`、ボリューム `mysql_data` の定義。 |
| `.env` | **MySQL** 用の環境変数（Compose はリポジトリルートの `.env` を読みます）。`.env.example` から作成。 |
| `nginx/` | Nginx 設定（リバースプロキシ、`/api` → Laravel の `public/index.php`）。 |
| `backend/` | Laravel：`Dockerfile`、`docker/php/opcache.ini`、ソース、`.env`。 |
| `client/` | React + Vite：`Dockerfile.dev`、`vite.config.js`（`/api` のプロキシ）。 |

---

## 使っている Docker の技術

### 1. マルチサービス Compose

- **`nginx`**: イメージ `nginx:stable-alpine`、`8080:80` で公開。設定とバックエンドソースをマウント。
- **`client`**: `./client` を `Dockerfile.dev` でビルドし、Node で `npm run dev` を実行。
- **`backend`**: `./backend` をビルド（PHP 8.4-FPM）。`9000:9000` は **PHP-FPM** 用であり、ここにブラウザで HTTP API を直接叩く想定ではありません。
- **`mysql`**: `mysql:8.4`、名前付きボリューム `mysql_data` でデータを永続化。**healthcheck** により DB が準備できてから `backend` が依存関係として起動。

### 2. バインドマウント（ホストとコンテナでコードを同期）

- `./backend:/var/www/html` — ホストで Laravel を編集するとコンテナに即反映。
- `./client:/app` — ホストで React を編集すると Vite の HMR が効く。
- `./nginx/default.conf:/etc/nginx/conf.d/default.conf` — プロキシ設定を変えても Nginx イメージの再ビルドは不要。

### 3. 匿名ボリューム（上書き・不整合の防止）

- **`/app/node_modules`**（`client`）: コンテナ内で `npm install` した `node_modules` が、ホスト側の空や別 OS のディレクトリで上書きされないようにする。
- **`/var/www/html/vendor`** および **`/var/www/html/storage/framework`**（`backend`）: イメージ内の `composer install` 結果を保持し、ホストマウントで `vendor` が消えたり依存がズレたりするのを防ぐ。

### 4. ブリッジネットワーク

- サービス間は Compose の**サービス名**で通信：`backend`、`nginx`、`mysql`（例：`DB_HOST=mysql`、Vite のプロキシ先 `http://nginx:80`）。

### 5. Nginx + PHP-FPM（FastCGI）

- プレフィックス **`/api/`** → Laravel の `public` を `root` に `try_files` → `index.php`。
- **`location = /index.php`**: `try_files` 後の内部リダイレクトで URI が `/index.php` になったときも PHP-FPM に渡す（`location /` に落ちて Nginx の静的ページだけ返るのを防ぐ）。

### 6. バックエンドイメージ

- ベース **`php:8.4-fpm`**、**`pdo_mysql`** / **`opcache`**、設定 **`backend/docker/php/opcache.ini`**（Windows + バインドマウント時の PHP ファイル読み込み負荷の軽減を意図）。
- **マルチステージ**: `composer:latest` から `composer` バイナリをコピー。
- ビルド時に **`composer install --optimize-autoloader`**。

### 7. Docker 内の Vite 開発サーバー

- **`server.host: 0.0.0.0`**: すべてのインターフェースで待ち受け、ホストから `http://localhost:5173` でアクセス可能に。
- **`watch.usePolling: true`**: Windows / macOS からコードをマウントしたときのファイル監視を安定化。
- **`/api` のプロキシ**: ブラウザは同一オリジンで `http://localhost:5173/api/...` を叩き、Vite が `nginx` に転送（UI から API を試すときの CORS を回避）。`VITE_API_ORIGIN` で上書き可能（後述）。

---

## GitHub から clone したあと — Docker で動かす

### 前提

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)（または Docker Engine + Compose プラグイン）
- ポート **8080** / **5173** / **9000** が空いていること（競合する場合は `docker-compose.yml` を編集）

### 手順 1: MySQL 用の環境変数（リポジトリルート）

```bash
cp .env.example .env
```

必要に応じて `MYSQL_ROOT_PASSWORD`、`MYSQL_DATABASE`、`MYSQL_USER`、`MYSQL_PASSWORD` を編集。Compose が読むのは **`team_system/` 直下の `.env`** です。

### 手順 2: Laravel の `backend/.env`

```bash
cd backend
cp .env.example .env
php artisan key:generate   # ホストに PHP があればここで。なければ手順 3 のあと docker exec で実行
```

`backend/.env` の DB 設定は Compose の MySQL と一致させます。例：

- `DB_CONNECTION=mysql`
- `DB_HOST=mysql`
- `DB_PORT=3306`
- `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` はルート `.env` の `MYSQL_DATABASE` / `MYSQL_USER` / `MYSQL_PASSWORD` と**同じ値**にする。

### 手順 3: ビルドと起動

`team_system/` で：

```bash
docker compose build
docker compose up -d
```

`mysql` が **healthy** になったら、初回のみマイグレーション：

```bash
docker exec -it laravel_backend php artisan migrate
```

コンテナ名は `docker-compose.yml` の `container_name` に依存します。異なる場合は `docker compose ps` で実名を確認してください。

### 手順 4: アクセス

| 用途 | URL / メモ |
|------|-------------|
| React（開発） | http://localhost:5173 |
| Nginx 経由の API | http://localhost:8080/api/...（例: `http://localhost:8080/api/user/getAll`） |
| PHP-FPM | `localhost:9000` — **HTTP API をここに直接出す想定ではない** |

### 任意: `client` を Docker 外で `npm run dev` するとき

`client/.env` に次を置きます。

```env
VITE_API_ORIGIN=http://127.0.0.1:8080
```

ホストで `npm run dev` を実行すると、`/api` へのリクエストがホスト上の Nginx にプロキシされます。

### よく使うコマンド

```bash
docker compose logs -f nginx backend   # ログ確認
docker compose restart client          # vite.config.js 変更後など
docker compose down                    # スタック停止（mysql_data は残る）
docker compose down -v                 # ボリュームも削除（DB データ消失）
```

---

## メモ

- **Windows + バインドマウント**: Laravel の初回リクエストが遅くなりがちです。`backend` イメージで OPcache を有効にして改善を図っています。
- `.env` には秘密情報が入るため **コミットしない**でください。`.env.example` のみコミットする運用を推奨します。
