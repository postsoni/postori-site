// ぽすとそに工房 - Service Worker
// バージョン管理
const CACHE_VERSION = 'v1.1.0';
const CACHE_NAME = `postsoni-cache-${CACHE_VERSION}`;

// キャッシュするファイルのリスト
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/postsoni-icon.png',
    '/favicon.ico',
    '/favicon.svg',
    '/favicon-96x96.png',
    '/apple-touch-icon.png',
    '/site.webmanifest'
];

// 画像ファイル（積極的にキャッシュ）
const IMAGE_CACHE_URLS = [
    '/rc-plane-header.jpg',
    '/heli-car-image1.jpg',
    '/car-image2.jpg',
    '/plane-image3.jpg'
];

// インストール時の処理
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching static assets');
                // 静的ファイルを優先的にキャッシュ
                return cache.addAll(STATIC_CACHE_URLS)
                    .then(() => {
                        // 画像は失敗しても続行
                        return cache.addAll(IMAGE_CACHE_URLS).catch((err) => {
                            console.warn('[Service Worker] Some images failed to cache:', err);
                        });
                    });
            })
            .then(() => self.skipWaiting())
    );
});

// アクティベート時の処理（古いキャッシュを削除）
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // 古いバージョンのキャッシュを削除
                            return cacheName.startsWith('postsoni-cache-') && 
                                   cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// フェッチ時の処理（キャッシュ戦略）
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // 外部リソース（フォントなど）はネットワーク優先
    if (url.origin !== location.origin) {
        event.respondWith(
            fetch(request).catch(() => {
                return caches.match(request);
            })
        );
        return;
    }
    
    // HTML: ネットワーク優先、フォールバックでキャッシュ
    if (request.headers.get('Accept').includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // 成功したらキャッシュを更新
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // ネットワークエラー時はキャッシュから返す
                    return caches.match(request);
                })
        );
        return;
    }
    
    // CSS/JS/画像: キャッシュ優先、フォールバックでネットワーク
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // キャッシュがあれば即座に返す
                    // バックグラウンドで更新をチェック
                    fetch(request).then((response) => {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, response);
                        });
                    }).catch(() => {
                        // ネットワークエラーは無視
                    });
                    
                    return cachedResponse;
                }
                
                // キャッシュになければネットワークから取得
                return fetch(request).then((response) => {
                    // 成功したらキャッシュに保存
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                });
            })
    );
});

// メッセージハンドラ（キャッシュのクリアなど）
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data === 'clearCache') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});
