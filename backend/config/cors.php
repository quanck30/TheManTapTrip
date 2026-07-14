<?php

return [
<<<<<<< HEAD

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:51734',   // ローカルVite（あなたのポート変更に合わせた値）
        // 'https://xxx.pages.dev', // Pagesデプロイ後に追加
=======
    // CORS対象パス
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
    ],

    // 許可するHTTPメソッド
    'allowed_methods' => ['*'],

    // 許可するフロントエンドのOrigin
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:51734'),
>>>>>>> 2fa557a2218b9a62b15419d7c0f4f93dd3248607
    ],

    'allowed_origins_patterns' => [],

<<<<<<< HEAD
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

=======
    // 許可するヘッダー
    'allowed_headers' => ['*'],

    // ブラウザに公開するレスポンスヘッダー
    'exposed_headers' => [],

    // プリフライトリクエストのキャッシュ秒数
    'max_age' => 0,

    // Cookie送信の許可
    'supports_credentials' => true,
>>>>>>> 2fa557a2218b9a62b15419d7c0f4f93dd3248607
];
