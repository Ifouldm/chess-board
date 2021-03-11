const pushServerPublicKey = 'BL4eApB5vjociEAt6cIMFlIC0CUEl6l7JiNIzVrG1h4ReqhvY2zrmsjvDK7bWpr9ZCk5sJse7tSNaTtJK8QP2vE';

/**
 * checks if Push notification and service workers are supported by your browser
 */
function isPushNotificationSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Get user consent
 */
function initializePushNotifications(): Promise<NotificationPermission> {
    return Notification.requestPermission((result) => result);
}

/**
 *
 */
function registerServiceWorker():void {
    navigator.serviceWorker.register('/sw.js').then((swRegistration) => {
        console.log('registered:', swRegistration);
    });
}

/**
 *
 * using the registered service worker creates a push notification subscription and returns it
 *
 */
function createNotificationSubscription(): Promise<ServiceWorkerRegistration | PushSubscription> {
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
function getUserSubscription(): Promise<ServiceWorkerRegistration | PushSubscription | null> {
    // wait for service worker installation to be ready, and then
    return navigator.serviceWorker.ready
        .then((serviceWorker) => serviceWorker.pushManager.getSubscription())
        .then((pushSubscription) => pushSubscription);
}

export {
    isPushNotificationSupported,
    initializePushNotifications,
    registerServiceWorker,
    createNotificationSubscription,
    getUserSubscription,
};
