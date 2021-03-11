"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const monk_1 = __importDefault(require("monk"));
const subscriptionHandler_js_1 = require("./subscriptionHandler.js");
const socketEvents_js_1 = require("./socketEvents.js");
// Socket events
require("./socketEvents");
dotenv_1.default.config();
const db = monk_1.default(process.env.MONGODBURI || 'localhost');
const matches = db.get('matches');
const port = process.env.PORT || 443;
// Middleware
socketEvents_js_1.app.use(express_1.default.json());
// Routes
socketEvents_js_1.app.use('/', express_1.default.static('client/public'));
socketEvents_js_1.app.post('/subscription', subscriptionHandler_js_1.handlePushNotificationSubscription);
// Debug
matches.findOne({}, {}, (err, doc) => {
    if (err) {
        console.error(err);
    }
    else if (doc) {
        console.log(`https://localhost?gameId=${doc._id}&token=${doc.player1.id}`);
        console.log(`https://localhost?gameId=${doc._id}&token=${doc.player2.id}`);
    }
});
socketEvents_js_1.httpsServer.listen(port, () => {
    console.log(`Listening on https://localhost:${port}`);
});
