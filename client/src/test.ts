const debugElement = document.getElementById('debug')!;

function notifyMe() {
    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
        debugElement.textContent = 'This browser does not support desktop notification';
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
        const notification = new Notification('Hi there!');
        debugElement.textContent = 'Granted';
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === 'granted') {
                debugElement.textContent = 'Granted after request';
                const notification = new Notification('Hi there!');
            }
        });
    } else {
        debugElement.textContent = 'Denied';
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}

notifyMe();
