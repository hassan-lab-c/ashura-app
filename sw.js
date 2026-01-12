// اسم النسخة - غيرنا الرقم ليقوم بالتحديث
const CACHE_NAME = 'kanz-offline-v1';

// قائمة الملفات التي سيتم حفظها في بطن الهاتف لتعمل بدون نت
// لاحظ: وضعنا الروابط الكاملة للملفات الخارجية
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './image_1.jpeg',
    // رابط الصوت الخارجي (مهم جداً للحفظ)
    'https://hassan-lab-c.github.io/ashura-app/ziyarat.mp3',
    // روابط الصور الخارجية
    'https://hassan-lab-c.github.io/ashura-app/distribute_1.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_2.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_3.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_4.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_5.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_6.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_7.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_8.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_9.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_10.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_11.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_12.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_13.jpg',
    'https://hassan-lab-c.github.io/ashura-app/distribute_14.jpg',
    // الخطوط والأيقونات
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;700&display=swap'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('جاري تحميل وحفظ ملفات كنز الوجاهة...');
            // هنا سيقوم بتحميل الصوت والصور من الانترنت وحفظها في الهاتف
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // إذا الملف محفوظ (حتى لو كان رابط خارجي)، شغله من الهاتف فوراً
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});
