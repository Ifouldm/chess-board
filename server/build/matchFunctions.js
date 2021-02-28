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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __importDefault(require("uuid"));
const monk_1 = __importDefault(require("monk"));
const chess_js_1 = require("./chess.js");
const socketEvents_1 = require("./socketEvents");
const db = monk_1.default((_a = process.env.MONGODBURI) !== null && _a !== void 0 ? _a : '');
const matches = db.get('matches');
function getGame(gameId) {
    return __awaiter(this, void 0, void 0, function* () {
        return matches.findOne({ _id: gameId });
    });
}
function getGames() {
    return __awaiter(this, void 0, void 0, function* () {
        return matches.find({});
    });
}
function updateGame(gameId, pgn) {
    return __awaiter(this, void 0, void 0, function* () {
        matches.update({ _id: gameId }, { $set: { pgn } });
    });
}
function createMatch(player1, player2) {
    return __awaiter(this, void 0, void 0, function* () {
        const player1Colour = Math.random() < 0.5 ? 'w' : 'b';
        const player2Colour = player1Colour === 'w' ? 'b' : 'w';
        const game = {
            player1: {
                id: uuid_1.default.v4(), name: player1, score: 0, colour: player1Colour,
            },
            player2: {
                id: uuid_1.default.v4(), name: player2, score: 0, colour: player2Colour,
            },
            pgn: '',
        };
        const insertedGame = yield matches.insert(game);
        if (insertedGame) {
            console.log(`http://localhost:3000?gameId=${insertedGame._id}&token=${insertedGame.player1.id}`);
            console.log(`http://localhost:3000?gameId=${insertedGame._id}&token=${insertedGame.player2.id}`);
            delete insertedGame.player1.id;
            delete insertedGame.player2.id;
            socketEvents_1.io.emit('update', insertedGame);
        }
    });
}
function deleteMatch(gameId) {
    return __awaiter(this, void 0, void 0, function* () {
        matches.remove({ _id: gameId });
    });
}
function resetGame(gameId) {
    return __awaiter(this, void 0, void 0, function* () {
        const chess = new chess_js_1.Chess();
        const game = yield matches.findOne({ _id: gameId });
        chess.load_pgn(game.pgn);
        chess.reset();
        game.pgn = chess.pgn();
        matches.update({ _id: gameId }, game, { replace: true });
        delete game.player1.id;
        delete game.player2.id;
        socketEvents_1.io.emit('update', game);
    });
}
function setScores(gameId, p1Score, p2Score) {
    return __awaiter(this, void 0, void 0, function* () {
        const game = yield getGame(gameId);
        if (!game) {
            console.error('Error: Unknown game');
        }
        else {
            game.player1.score = p1Score;
            game.player2.score = p2Score;
            matches.update({ _id: gameId }, {
                $set: { player1: { score: p1Score } },
                player2: { score: p2Score },
            });
            delete game.player1.id;
            delete game.player2.id;
            socketEvents_1.io.emit('update', game);
        }
    });
}
exports.default = {
    setScores, resetGame, deleteMatch, createMatch, getGame, getGames, updateGame,
};
