import express from 'express';
import dotenv from 'dotenv';
import monk from 'monk';
import { handlePushNotificationSubscription } from './subscriptionHandler.js';
import { app, httpServer } from './socketEvents.js';

// Socket events
import './socketEvents';

dotenv.config();

// Database Connection
let mongoURI = 'localhost';
if (process.env.MONGO_HOST
&& process.env.MONGO_DB) {
    mongoURI = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`;
}
const db = monk(mongoURI, { useNewUrlParser: true });
const matches = db.get('matches');
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
// Routes
app.use('/', express.static('client/public'));
app.post('/subscription', handlePushNotificationSubscription);

// Debug
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
