const pushServerPublicKey = 'BIN2Jc5Vmkmy-S3AUrcMlpKxJpLeVRAfu9WBqUbJ70SJOCWGCGXKY-Xzyh7HDr6KbRDGYHjqZ06OcS3BjD7uAm8';

/**
 * checks if Push notification and service workers are supported by your browser
 */
function isPushNotificationSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Get user consent
 */
function initializePushNotifications() {
    return Notification.requestPermission((result) => result);
}
/**
 * shows a notification
 */
function sendNotification() {
    const img = '/images/jason-leung-HM6TMmevbZQ-unsplash.jpg';
    const text = 'Take a look at this brand new t-shirt!';
    const title = 'New Product Available';
    const options = {
        body: text,
        icon: '/images/jason-leung-HM6TMmevbZQ-unsplash.jpg',
        vibrate: [200, 100, 200],
        tag: 'new-product',
        image: img,
        badge: 'https://spyna.it/icons/android-icon-192x192.png',
        actions: [{ action: 'Detail', title: 'View', icon: 'https://via.placeholder.com/128/ff0000' }],
    };
    navigator.serviceWorker.ready.then((serviceWorker) => {
        serviceWorker.showNotification(title, options);
    });
}

/**
 *
 */
function registerServiceWorker() {
    navigator.serviceWorker.register('/sw.js').then((swRegistration) => {
        // console.log(swRegistration);
    });
}

/**
 *
 * using the registered service worker creates a push notification subscription and returns it
 *
 */
function createNotificationSubscription() {
    // wait for service worker installation to be ready, and then
    return navigator.serviceWorker.ready.then((serviceWorker) => serviceWorker.pushManager
        .subscribe({
            userVisibleOnly: true,
            applicationServerKey: pushServerPublicKey,
        })
        .then((subscription) => {
            console.log('User is subscribed.', subscription);
            return subscription;
        }));
}

/**
 * returns the subscription if present or nothing
 */
function getUserSubscription() {
    // wait for service worker installation to be ready, and then
    return navigator.serviceWorker.ready
        .then((serviceWorker) => serviceWorker.pushManager.getSubscription())
        .then((pushSubscription) => pushSubscription);
}

export {
    isPushNotificationSupported,
    initializePushNotifications,
    registerServiceWorker,
    sendNotification,
    createNotificationSubscription,
    getUserSubscription,
};
