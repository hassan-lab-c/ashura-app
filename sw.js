// اسم النسخة (غيّر الرقم كلما عدلت شيئاً في الموقع ليحس المستخدم بالتحديث)
const CACHE_NAME = 'kanz-v10-ultra-speed';

// قائمة الملفات التي سيتم حفظها في بطن الهاتف لتعمل بدون نت
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './image_1.jpeg',
    './ziyarat.mp3', // الصوت سيحفظ بالكامل
    // صور المعرض (تأكد أن الأسماء مطابقة تماماً)
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
    // الخطوط والأيقونات الخارجية (سنحاول حفظها أيضاً)
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;700&display=swap'
];

// 1. مرحلة التثبيت: تحميل كل الملفات وحفظها
self.addEventListener('install', (event) => {
    self.skipWaiting(); // تفعيل التحديث فوراً
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('جاري تحميل كنز الوجاهة في ذاكرة الهاتف...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. مرحلة التفعيل: تنظيف النسخ القديمة لتوفير المساحة
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('حذف النسخة القديمة:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

// 3. مرحلة الاستخدام: السرعة القصوى (Cache First)
// أي طلب يأتي، نعطيه الملف من الهاتف فوراً. إذا لم نجد، نطلبه من النت.
self.addEventListener('fetch', (event) => {
    // استثناء خاص لملفات الصوت الكبيرة لضمان عمل شريط التقدم (Seeking)
    if (event.request.url.includes('.mp3')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // إذا الملف موجود في الهاتف، سلمه فوراً (سرعة صاروخية)
            if (cachedResponse) {
                return cachedResponse;
            }
            // إذا غير موجود، حمله من النت
            return fetch(event.request);
        })
    );
});
