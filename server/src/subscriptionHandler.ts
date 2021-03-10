import { Request, Response } from 'express';
import crypto from 'crypto';
import webpush from 'web-push';
import monk from 'monk';
import dotenv from 'dotenv';
import { Move } from './lib/chess.js';

dotenv.config();

const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

const db = monk(mongoURI || 'localhost');

const subscriptions = db.get('subscriptions');

const vapidKeys = {
    privateKey: 'BrZNzaIIzDeUwroYPG9eoVFsyESeWatf5y9PWyzB2z0',
    publicKey: 'BL4eApB5vjociEAt6cIMFlIC0CUEl6l7JiNIzVrG1h4ReqhvY2zrmsjvDK7bWpr9ZCk5sJse7tSNaTtJK8QP2vE',
};

webpush.setVapidDetails('http://obidex.com', vapidKeys.publicKey, vapidKeys.privateKey);

function createHash(input: string) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(Buffer.from(input));
    return md5sum.digest('hex');
}

function handlePushNotificationSubscription(req: Request, res: Response): void {
    const { gameId, colour, sub } = req.body;
    const susbscriptionId = createHash(JSON.stringify(sub));
    subscriptions.insert({ gameId, colour, sub });
    res.status(201).json({ id: susbscriptionId });
}

function broadcastNotification(gameId: string, moveDetails: Move, colour: 'w' | 'b'): void {
    const payload = JSON.stringify({
        title: 'New Move',
        data: { gameId },
        text: `${colour === 'w' ? 'White' : 'Black'} Moved \n From: ${moveDetails.from}, To: ${moveDetails.to}`,
        tag: 'new-move',
        url: `/?gameId=${gameId}`,
    });
    const opponent = colour === 'w' ? 'b' : 'w';
    subscriptions.findOne({ gameId, colour: opponent }).then((document) => {
        if (document) {
            webpush.sendNotification(document.sub, payload)
                .then()
                .catch((err) => console.error(err));
        }
    });
}

export { handlePushNotificationSubscription, broadcastNotification };
