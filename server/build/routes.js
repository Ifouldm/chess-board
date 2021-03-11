"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
app.use(express_1.default.json());
app.use('/', express_1.default.static('client/public'));
app.post('/subscription', subscriptionHandler.handlePushNotificationSubscription);
