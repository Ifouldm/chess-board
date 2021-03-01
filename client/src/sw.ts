function receivePushNotification(event: Event) {
    console.log('[Service Worker] Push Received.');

    const {
        tag, url, title, text,
    } = event.data.json();

    const options = {
        data: url,
        body: text,
        icon: 'favicon.ico',
        vibrate: [200, 100, 200],
        tag,
        requireInteraction: true,
        badge: 'favicon.ico',
        actions: [{ action: 'Detail', title: 'Go to Game', icon: 'favicon.ico' }],
    };
    event.waitUntil(self.registration.showNotification(title, options));
}

function openPushNotification(event: Event) {
    console.log('[Service Worker] Notification click Received.', event.notification.data);

    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener('push', receivePushNotification);
self.addEventListener('notificationclick', openPushNotification);
