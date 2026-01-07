// قمنا بتغيير v2 إلى v3 لنجبر المتصفح على تحديث الملفات
const CACHE_NAME = 'ashura-app-v3'; 
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './image_1.jpeg',
    './ziyarat.mp3',
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
    self.skipWaiting(); // أمر فوري بتثبيت التحديث الجديد
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('جاري حفظ ملفات التطبيق الإصدار 3...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('حذف النسخة القديمة من الكاش', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim(); // تفعيل التحديث فوراً
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // إذا وجد الملف في الكاش يرجعه، وإلا يطلبه من النت
                return response || fetch(event.request);
            })
    );
});
