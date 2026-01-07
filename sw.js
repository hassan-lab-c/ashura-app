const CACHE_NAME = 'ashura-app-v4'; // تحديث الإصدار إلى 4
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './image_1.jpeg',
    './ziyarat.mp3', // ملف الصوت
    // صور المعرض
    './distribute_1.jpg',
    './distribute_2.jpg',
    './distribute_3.jpg',
    './distribute_4.jpg',
    './distribute_5.jpg',
    './distribute_6.jpg',
    './distribute_7.jpg',
    './distribute_8.jpg',
    './distribute_9.jpg',
    './distribute_10.jpg',
    './distribute_11.jpg',
    './distribute_12.jpg',
    './distribute_13.jpg',
    './distribute_14.jpg',
    // الروابط الخارجية
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;700&display=swap'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('جاري حفظ الملفات (v4)...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('تنظيف الكاش القديم:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // معالجة خاصة لملفات الصوت (Range Requests)
    if (url.pathname.endsWith('.mp3')) {
        event.respondWith(handleRangeRequest(event.request));
    } else {
        // الملفات العادية
        event.respondWith(
            caches.match(event.request)
                .then((response) => response || fetch(event.request))
        );
    }
});

// دالة ذكية لتقطيع ملف الصوت وتقديمه للهاتف
async function handleRangeRequest(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request.url);

    if (cachedResponse) {
        const buffer = await cachedResponse.arrayBuffer();
        const range = request.headers.get('range');

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : buffer.byteLength - 1;
            const chunksize = (end - start) + 1;
            const slicedBuffer = buffer.slice(start, end + 1);

            const headers = new Headers(cachedResponse.headers);
            headers.set('Content-Range', `bytes ${start}-${end}/${buffer.byteLength}`);
            headers.set('Content-Length', chunksize);

            return new Response(slicedBuffer, {
                status: 206,
                statusText: 'Partial Content',
                headers: headers
            });
        } else {
            return cachedResponse;
        }
    } else {
        return fetch(request);
    }
}
