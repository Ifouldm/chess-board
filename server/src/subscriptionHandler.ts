import { Request, Response } from 'express';
import crypto from 'crypto';
import webpush from 'web-push';
import monk from 'monk';
import { Move } from './chess';

const db = monk(process.env.MONGODBURI ?? '');

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
    const subscriptionRequest = req.body;
    const susbscriptionId = createHash(JSON.stringify(subscriptionRequest));
    subscriptions.insert(subscriptionRequest);
    res.status(201).json({ id: susbscriptionId });
}

function broadcastNotification(moveDetails: Move): void {
    const payload = JSON.stringify({
        title: 'New Move',
        text: `From: ${moveDetails.from}, To: ${moveDetails.to}`,
        tag: 'new-move',
        url: '/',
    });
    subscriptions.find({}).then((subs) => {
        for (const sub of subs) {
            webpush.sendNotification(sub, payload)
                .then()
                .catch((err) => console.error(err));
        }
    });
}

export { handlePushNotificationSubscription, broadcastNotification };
