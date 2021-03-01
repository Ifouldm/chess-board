import { Server, Socket } from 'socket.io';
import { createServer } from 'https';
import fs from 'fs';
import path from 'path';
import express from 'express';
import { Chess, Move } from './chess.js';
import { broadcastNotification } from './subscriptionHandler.js';
import match from './matchFunctions.js';

const certOptions = {
    key: fs.readFileSync(path.resolve('server/build/cert/server.key')),
    cert: fs.readFileSync(path.resolve('server/build/cert/server.crt')),
};

const app = express();
const httpsServer = createServer(certOptions, app);
const io = new Server(httpsServer);

io.on('connection', (socket: Socket) => {
    socket.on('command', (command: string) => {
        if (command.startsWith('create')) {
            const parts = command.split(' ');
            match.createMatch(parts[1], parts[2]);
        }
        if (command.startsWith('reset')) {
            const parts = command.split(' ');
            match.resetGame(parts[1]);
        }
        if (command.startsWith('scores')) {
            const parts = command.split(' ');
            match.setScores(parts[1], Number(parts[2]), Number(parts[3]));
        }
        if (command.startsWith('delete')) {
            const parts = command.split(' ');
            match.deleteMatch(parts[1]);
        }
    });

    socket.on('auth', async (gameId: string, tokenId?: string) => {
        if (!gameId) {
            const games = await match.getGames();
            games.forEach((game) => {
                delete game.player1.id;
                delete game.player2.id;
            });
            socket.emit('gameList', games);
        } else {
            const game = await match.getGame(gameId);
            if (!game) {
                console.error('Error: Unknown game');
            } else {
                let colour;
                if (game.player1.id === tokenId) {
                    colour = game.player1.colour;
                } else if (game.player2.id === tokenId) {
                    colour = game.player2.colour;
                }
                delete game.player1.id;
                delete game.player2.id;
                socket.emit('initialState', game, colour);
            }
        }
    });

    socket.on('move', async (gameId: string, tokenId: string, move: Move) => {
        const chess = new Chess();
        const game = await match.getGame(gameId);
        if (!game) {
            console.error('Error: Unknown game');
        } else {
            let colour;
            if (game.player1.id === tokenId) {
                colour = game.player1.colour;
            } else if (game.player2.id === tokenId) {
                colour = game.player2.colour;
            }
            if (colour) {
                chess.load_pgn(game.pgn);
                chess.move(move);
                const pgn = chess.pgn();
                match.updateGame(gameId, pgn);
                delete game.player1.id;
                delete game.player2.id;
                game.pgn = pgn;
                io.emit('update', game);
                broadcastNotification(move);
            } else {
                console.error('unauthorised');
            }
        }
    });

    socket.on('concede', async (gameId: string, token: string) => {
        const game = await match.getGame(gameId);
        if (!game) {
            console.error('Error: Unknown game');
        } else {
            let playerName;
            let playerColour;
            if (game.player1.id === token) {
                playerName = game.player1.name;
                playerColour = game.player1.colour;
                match.setScores(gameId, game.player1.score, game.player2.score + 1);
            }
            if (game.player2.id === token) {
                playerName = game.player2.name;
                playerColour = game.player2.colour;
                match.setScores(gameId, game.player1.score + 1, game.player2.score);
            }
            io.emit('concedeNotification', gameId, playerName, playerColour);
        }
    });

    socket.on('offerDraw', async (gameId: string, token: string) => {
        let playerName = '';
        let colour = '';
        const game = await match.getGame(gameId);
        if (!game) {
            console.error('Error: Unknown game');
        } else {
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
    });

    socket.on('drawOfferReponse', async (gameId: string, token: string, response: boolean) => {
        const game = await match.getGame(gameId);
        if (!game) {
            console.error('Error: Unknown game');
        } else {
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
                match.setScores(gameId, game.player1.score + 0.5, game.player2.score + 0.5);
            }
            io.emit('drawNotification', gameId, response, playerColour, playerName);
        }
    });
});

export { httpsServer, io, app };
