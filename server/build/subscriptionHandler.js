"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastNotification = exports.handlePushNotificationSubscription = void 0;
const crypto_1 = __importDefault(require("crypto"));
const web_push_1 = __importDefault(require("web-push"));
const monk_1 = __importDefault(require("monk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = monk_1.default((_a = process.env.MONGODBURI) !== null && _a !== void 0 ? _a : 'localhost');
const subscriptions = db.get('subscriptions');
const vapidKeys = {
    privateKey: 'BrZNzaIIzDeUwroYPG9eoVFsyESeWatf5y9PWyzB2z0',
    publicKey: 'BL4eApB5vjociEAt6cIMFlIC0CUEl6l7JiNIzVrG1h4ReqhvY2zrmsjvDK7bWpr9ZCk5sJse7tSNaTtJK8QP2vE',
};
web_push_1.default.setVapidDetails('http://obidex.com', vapidKeys.publicKey, vapidKeys.privateKey);
function createHash(input) {
    const md5sum = crypto_1.default.createHash('md5');
    md5sum.update(Buffer.from(input));
    return md5sum.digest('hex');
}
function handlePushNotificationSubscription(req, res) {
    const subscriptionRequest = req.body;
    const susbscriptionId = createHash(JSON.stringify(subscriptionRequest));
    subscriptions.insert(subscriptionRequest);
    res.status(201).json({ id: susbscriptionId });
}
exports.handlePushNotificationSubscription = handlePushNotificationSubscription;
function broadcastNotification(moveDetails) {
    const payload = JSON.stringify({
        title: 'New Move',
        text: `From: ${moveDetails.from}, To: ${moveDetails.to}`,
        tag: 'new-move',
        url: '/',
    });
    subscriptions.find({}).then((subs) => {
        for (const sub of subs) {
            web_push_1.default.sendNotification(sub, payload)
                .then()
                .catch((err) => console.error(err));
        }
    });
}
exports.broadcastNotification = broadcastNotification;
