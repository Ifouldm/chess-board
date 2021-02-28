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
exports.app = exports.io = exports.httpServer = void 0;
const socket_io_1 = require("socket.io");
const https_1 = require("https");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const chess_js_1 = require("./chess.js");
const subscriptionHandler_js_1 = require("./subscriptionHandler.js");
const matchFunctions_js_1 = __importDefault(require("./matchFunctions.js"));
const certOptions = {
    key: fs_1.default.readFileSync(path_1.default.resolve('server/build/cert/server.key')),
    cert: fs_1.default.readFileSync(path_1.default.resolve('server/build/cert/server.crt')),
};
const app = express_1.default();
exports.app = app;
const httpServer = https_1.createServer(certOptions, app);
exports.httpServer = httpServer;
const io = new socket_io_1.Server(httpServer);
exports.io = io;
io.on('connection', (socket) => {
    socket.on('command', (command) => {
        if (command.startsWith('create')) {
            const parts = command.split(' ');
            matchFunctions_js_1.default.createMatch(parts[1], parts[2]);
        }
        if (command.startsWith('reset')) {
            const parts = command.split(' ');
            matchFunctions_js_1.default.resetGame(parts[1]);
        }
        if (command.startsWith('scores')) {
            const parts = command.split(' ');
            matchFunctions_js_1.default.setScores(parts[1], Number(parts[2]), Number(parts[3]));
        }
        if (command.startsWith('delete')) {
            const parts = command.split(' ');
            matchFunctions_js_1.default.deleteMatch(parts[1]);
        }
    });
    socket.on('auth', (gameId, tokenId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!gameId) {
            const games = yield matchFunctions_js_1.default.getGames();
            games.forEach((game) => {
                delete game.player1.id;
                delete game.player2.id;
            });
            socket.emit('gameList', games);
        }
        else {
            const game = yield matchFunctions_js_1.default.getGame(gameId);
            if (!game) {
                console.error('Error: Unknown game');
            }
            else {
                let colour;
                if (game.player1.id === tokenId) {
                    colour = game.player1.colour;
                }
                else if (game.player2.id === tokenId) {
                    colour = game.player2.colour;
                }
                delete game.player1.id;
                delete game.player2.id;
                socket.emit('initialState', game, colour);
            }
        }
    }));
    socket.on('move', (gameId, tokenId, move) => __awaiter(void 0, void 0, void 0, function* () {
        const chess = new chess_js_1.Chess();
        const game = yield matchFunctions_js_1.default.getGame(gameId);
        if (!game) {
            console.error('Error: Unknown game');
        }
        else {
            let colour;
            if (game.player1.id === tokenId) {
                colour = game.player1.colour;
            }
            else if (game.player2.id === tokenId) {
                colour = game.player2.colour;
            }
            if (colour) {
                chess.load_pgn(game.pgn);
                chess.move(move);
                const pgn = chess.pgn();
                matchFunctions_js_1.default.updateGame(gameId, pgn);
                delete game.player1.id;
                delete game.player2.id;
                game.pgn = pgn;
                io.emit('update', game);
                subscriptionHandler_js_1.broadcastNotification(move);
            }
            else {
                console.error('unauthorised');
            }
        }
    }));
    socket.on('concede', (gameId, token) => __awaiter(void 0, void 0, void 0, function* () {
        const game = yield matchFunctions_js_1.default.getGame(gameId);
        if (!game) {
            console.error('Error: Unknown game');
        }
        else {
            let playerName;
            let playerColour;
            if (game.player1.id === token) {
                playerName = game.player1.name;
                playerColour = game.player1.colour;
                matchFunctions_js_1.default.setScores(gameId, game.player1.score, game.player2.score + 1);
            }
            if (game.player2.id === token) {
                playerName = game.player2.name;
                playerColour = game.player2.colour;
                matchFunctions_js_1.default.setScores(gameId, game.player1.score + 1, game.player2.score);
            }
            io.emit('concedeNotification', gameId, playerName, playerColour);
        }
    }));
    socket.on('offerDraw', (gameId, token) => __awaiter(void 0, void 0, void 0, function* () {
        let playerName = '';
        let colour = '';
        const game = yield matchFunctions_js_1.default.getGame(gameId);
        if (!game) {
            console.error('Error: Unknown game');
        }
        else {
            if (game.player1.id === token) {
                playerName = game.player1.name;
                colour = game.player1.colour;
            }
            if (game.player2.id === token) {
                playerName = game.player2.name;
                colour = game.player2.colour;
            }
            io.emit('drawOffer', gameId, playerName, colour);
        }
    }));
    socket.on('drawOfferReponse', (gameId, token, response) => __awaiter(void 0, void 0, void 0, function* () {
        const game = yield matchFunctions_js_1.default.getGame(gameId);
        if (!game) {
            console.error('Error: Unknown game');
        }
        else {
            let playerName;
            let playerColour;
            if (game.player1.id === token) {
                playerName = game.player1.name;
                playerColour = game.player1.colour;
            }
            if (game.player2.id === token) {
                playerName = game.player2.name;
                playerColour = game.player2.colour;
            }
            if (response && playerName && playerColour) {
                matchFunctions_js_1.default.setScores(gameId, game.player1.score + 0.5, game.player2.score + 0.5);
            }
            io.emit('drawNotification', gameId, response, playerColour, playerName);
        }
    }));
});
