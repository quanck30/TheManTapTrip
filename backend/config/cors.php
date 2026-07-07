<?php

return [
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
    ],

    'allowed_origins_patterns' => [],

    // 許可するヘッダー
    'allowed_headers' => ['*'],

    // ブラウザに公開するレスポンスヘッダー
    'exposed_headers' => [],

    // プリフライトリクエストのキャッシュ秒数
    'max_age' => 0,

    // Cookie送信の許可
    'supports_credentials' => true,
];
