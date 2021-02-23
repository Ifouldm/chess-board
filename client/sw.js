function receivePushNotification(event) {
    console.log('[Service Worker] Push Received.');

    const {
        image, tag, url, title, text,
    } = event.data.json();

    const options = {
        data: url,
        body: text,
        icon: '/assets/favicon.ico',
        vibrate: [200, 100, 200],
        tag,
        requireInteraction: true,
        badge: '/assets/favicon.ico',
        actions: [{ action: 'Detail', title: 'Goto Game', icon: 'assets/favicon.ico' }],
    };
    event.waitUntil(self.registration.showNotification(title, options));
}

function openPushNotification(event) {
    console.log('[Service Worker] Notification click Received.', event.notification.data);

    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener('push', receivePushNotification);
self.addEventListener('notificationclick', openPushNotification);
