"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const matchFunctions_js_1 = __importDefault(require("../matchFunctions.js"));
let gameId = '';
before(() => __awaiter(void 0, void 0, void 0, function* () {
    const game = yield matchFunctions_js_1.default.createMatch('Test Agent 1', 'Test Agent 2');
    if (game) {
        gameId = game._id;
    }
}));
after(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('after!');
    matchFunctions_js_1.default.deleteMatch(gameId);
    matchFunctions_js_1.default.closeConnections();
}));
describe('Set scores function', () => {
    it('Set score to 0-0', () => __awaiter(void 0, void 0, void 0, function* () {
        yield matchFunctions_js_1.default.setScores(gameId, 0, 0);
        const result = yield matchFunctions_js_1.default.getGame(gameId);
        chai_1.assert.equal(result.player1.score, 0);
        chai_1.assert.equal(result.player2.score, 0);
    }));
    it('Set score to 1-1', () => __awaiter(void 0, void 0, void 0, function* () {
        yield matchFunctions_js_1.default.setScores(gameId, 1, 1);
        const result = yield matchFunctions_js_1.default.getGame(gameId);
        chai_1.assert.equal(result.player1.score, 1);
        chai_1.assert.equal(result.player2.score, 1);
    }));
    it('Set score to 5-3', () => __awaiter(void 0, void 0, void 0, function* () {
        yield matchFunctions_js_1.default.setScores(gameId, 5, 3);
        const result = yield matchFunctions_js_1.default.getGame(gameId);
        chai_1.assert.equal(result.player1.score, 5);
        chai_1.assert.equal(result.player2.score, 3);
    }));
});
