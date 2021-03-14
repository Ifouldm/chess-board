import express from 'express';
import { handlePushNotificationSubscription } from './subscriptionHandler.js';
import { app, httpServer } from './socketEvents.js';
import { matches } from './database.js';

// Socket events
import './socketEvents';

const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
// Routes
app.use('/', express.static('client/public'));
app.post('/subscription', handlePushNotificationSubscription);

// Print 1st available match to console
matches.findOne({}, {}, (err, doc) => {
    if (err) {
        console.error(err);
    } else if (doc) {
        console.log(`http://localhost:${port}?gameId=${doc._id}&token=${doc.player1.id}`);
        console.log(`http://localhost:${port}?gameId=${doc._id}&token=${doc.player2.id}`);
    }
});

httpServer.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
