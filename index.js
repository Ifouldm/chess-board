const Datastore = require('nedb');
const { Chess } = require('chess.js');
const express = require('express');
const uuid = require('uuid');

const db = new Datastore({ filename: 'data/db.json', autoload: true });

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;

function createMatch(player1, player2) {
    const chess = new Chess();
    const player1Colour = Math.random() < 0.5 ? 'light' : 'dark';
    const player2Colour = player1Colour === 'light' ? 'dark' : 'light';
    chess.header(player1Colour, player1);
    chess.header(player2Colour, player2);
    const player1Id = uuid.v4();
    const player2Id = uuid.v4();
    const game = {
        player1: { id: player1Id, score: 0, colour: player1Colour },
        player2: { id: player2Id, score: 0, colour: player2Colour },
        pgn: chess.pgn().toString(),
    };
    db.insert(game, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

app.use('/', express.static('client'));

io.on('connection', (socket) => {
    socket.on('command', (command) => {
        if (command.startsWith('create')) {
            const parts = command.split(' ');
            console.log(parts);
            createMatch(parts[1], parts[2]);
        }
    });
    socket.on('auth', (gameId, tokenId) => {
        db.findOne({ _id: gameId }, (err, game) => {
            let colour;
            if (err) {
                console.error(`Error: ${err}`);
            } else {
                if (game.player1.id === tokenId) {
                    colour = game.player1.colour;
                } else if (game.player2.id === tokenId) {
                    colour = game.player2.colour;
                }
                socket.emit('initialState', game, colour);
            }
        });
    });
    socket.on('move', (gameId, tokenId, move) => {
        const chess = new Chess();
        db.findOne(({ _id: gameId }), (err, game) => {
            if (err) {
                console.error(`Error: ${err}`);
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
                    db.update({ _id: gameId }, { $set: { pgn } }, (updateErr) => {
                        if (updateErr) console.error(`Error: ${updateErr}`);
                    });
                    io.emit('update', pgn);
                } else {
                    console.error('unauthorised');
                }
            }
        });
    });
    socket.on('reset', (details) => {
        console.log(`reset ${details}`);
    });
    socket.on('concede', (details) => {
        console.log(`concede ${details}`);
    });
    socket.on('offerDraw', (details) => {
        console.log(`draw offer ${details}`);
    });
    console.log('user connected');
});

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
