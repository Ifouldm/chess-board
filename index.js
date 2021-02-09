const Datastore = require('nedb');
const { Chess } = require('chess.js');
const express = require('express');
const uuid = require('uuid');

const db = new Datastore({ filename: 'data/db.json', autoload: true });

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

function createMatch(player1, player2) {
    const chess = new Chess();
    const player1Colour = Math.random() < 0.5 ? 'w' : 'b';
    const player2Colour = player1Colour === 'w' ? 'b' : 'w';
    const game = {
        player1: {
            id: uuid.v4(), name: player1, score: 0, colour: player1Colour,
        },
        player2: {
            id: uuid.v4(), name: player2, score: 0, colour: player2Colour,
        },
        pgn: chess.pgn().toString(),
    };
    db.insert(game, (err, insertedGame) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`http://localhost:3000?gameId=${insertedGame._id}&token=${insertedGame.player1.id}`);
            console.log(`http://localhost:3000?gameId=${insertedGame._id}&token=${insertedGame.player2.id}`);
        }
    });
}

app.use('/', express.static('client'));

io.on('connection', (socket) => {
    socket.on('command', (command) => {
        if (command.startsWith('create')) {
            const parts = command.split(' ');
            createMatch(parts[1], parts[2]);
        }
    });
    socket.on('auth', (gameId, tokenId) => {
        if (!gameId) {
            db.find({}, {}, (err, res) => {
                if (err) {
                    console.error(`Error: ${err}`);
                } else {
                    const list = res.slice();
                    list.forEach((item) => {
                        delete item.player1.id;
                        delete item.player2.id;
                    });
                    console.log(list);
                    socket.emit('gameList', list);
                }
            });
        } else {
            db.findOne({ _id: gameId }, (err, game) => {
                let colour;
                if (err || !game) {
                    console.error(`Error: ${err}`);
                } else {
                    if (game.player1.id === tokenId) {
                        colour = game.player1.colour;
                    } else if (game.player2.id === tokenId) {
                        colour = game.player2.colour;
                    }
                    delete game.player1.id;
                    delete game.player2.id;
                    socket.emit('initialState', game, colour);
                }
            });
        }
    });
    socket.on('move', (gameId, tokenId, move) => {
        const chess = new Chess();
        db.findOne({ _id: gameId }, (err, game) => {
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
    socket.on('concede', (gameId, token) => {
        let playerName = '';
        const chess = new Chess();
        db.findOne({ _id: gameId }, (err, game) => {
            if (err || !game) {
                console.error(`Error: ${err}`);
            } else {
                if (game.player1.id === token) {
                    playerName = game.player1.name;
                    game.player2.score += 1;
                }
                if (game.player2.id === token) {
                    playerName = game.player2.name;
                    game.player1.score += 1;
                }
                chess.load_pgn(game.pgn);
                chess.reset();
                game.pgn = chess.pgn();
                db.update({ _id: gameId }, game);
            }
        });
        io.emit('concede', gameId, playerName);
        io.emit('update', chess.pgn());
    });
    socket.on('offerDraw', (gameId, token) => {
        let playerName = '';
        let colour = '';
        db.findOne({ _id: gameId }, (err, game) => {
            if (err || !game) {
                console.error(`Error: ${err}`);
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
    });
    console.log('user connected');
});

// debug
db.findOne({}, {}, (err, doc) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`/?gameId=${doc._id}&token=${doc.player1.id}`);
        console.log(`/?gameId=${doc._id}&token=${doc.player2.id}`);
    }
});

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
