declare let self: ServiceWorkerGlobalScope;
function receivePushNotification(event: PushEvent): void {
    console.log('[Service Worker] Push Received.');

    const { tag, gameId, title, text } = event.data?.json();

    const options = {
        data: gameId,
        body: text,
        icon: 'favicon.ico',
        vibrate: [200, 100, 200],
        tag,
        requireInteraction: true,
        badge: 'favicon.ico',
        actions: [
            { action: 'Detail', title: 'Go to Game', icon: 'favicon.ico' },
        ],
    };
    event.waitUntil(self.registration.showNotification(title, options));
}

function openPushNotification(event: NotificationEvent): void {
    const { gameId } = event.notification.data;
    console.log('[Service Worker] Notification click Received.', gameId);
    console.log(self.clients);
    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((genClientArr) => {
            const clientsArr = genClientArr as WindowClient[];
            // If a Window tab matching the targeted URL already exists, focus that;
            const hadWindowToFocus = clientsArr.some((windCli) =>
                windCli.url.includes(gameId) ? (windCli.focus(), true) : false
            );
            // Otherwise, open a new tab to the applicable URL and focus it.
            if (!hadWindowToFocus) {
                self.clients
                    .openWindow(`/?gameId=${gameId}`)
                    .then((windCli) => {
                        console.log(windCli);
                        windCli?.focus();
                    });
            }
        })
    );
    event.notification.close();
}

self.addEventListener('push', receivePushNotification);
self.addEventListener('notificationclick', openPushNotification);

export {};
