import express from 'express';
import dotenv from 'dotenv';
import monk from 'monk';
import { handlePushNotificationSubscription } from './subscriptionHandler.js';

dotenv.config();
const db = monk(process.env.MONGODBURI ?? '');

const matches = db.get('matches');

const app = express();

const port = process.env.PORT || 3000;

// Routes
app.use(express.json());
app.use('/', express.static('client/public'));
app.post('/subscription', handlePushNotificationSubscription);

// Socket events

// debug
matches.findOne({}, {}, (err, doc) => {
    if (err) {
        console.error(err);
    } else if (doc) {
        console.log(`http://localhost:3000?gameId=${doc._id}&token=${doc.player1.id}`);
        console.log(`http://localhost:3000?gameId=${doc._id}&token=${doc.player2.id}`);
    }
});

httpServer.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
