const { Chess } = require('chess.js');
const express = require('express');
const uuid = require('uuid');
require('dotenv').config();
const db = require('monk')(process.env.MONGODBURI);

const matches = db.get('matches');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

function createMatch(player1, player2) {
    const player1Colour = Math.random() < 0.5 ? 'w' : 'b';
    const player2Colour = player1Colour === 'w' ? 'b' : 'w';
    const game = {
        player1: {
            id: uuid.v4(), name: player1, score: 0, colour: player1Colour,
        },
        player2: {
            id: uuid.v4(), name: player2, score: 0, colour: player2Colour,
        },
        pgn: '',
    };
    console.log(game);
    matches.insert(game, (err, insertedGame) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`/?gameId=${insertedGame._id}&token=${insertedGame.player1.id}`);
            console.log(`/?gameId=${insertedGame._id}&token=${insertedGame.player2.id}`);
            delete insertedGame.player1.id;
            delete insertedGame.player2.id;
            io.emit('update', insertedGame);
        }
    });
}

function deleteMatch(gameId) {
    matches.remove({ _id: gameId }, (err) => {
        if (err) {
            console.error(err);
        }
    });
}

function resetGame(gameId) {
    const chess = new Chess();
    matches.findOne({ _id: gameId }, (err, game) => {
        if (err) {
            console.error(`Error: ${err}`);
        } else {
            chess.load_pgn(game.pgn);
            chess.reset();
            game.pgn = chess.pgn();
            matches.update({ _id: gameId }, game, { replaceOne: true }, () => {
                delete game.player1.id;
                delete game.player2.id;
                io.emit('update', game);
            });
        }
    });
}

function setScores(gameId, p1Score, p2Score) {
    matches.findOne({ _id: gameId }, (err, game) => {
        if (err) {
            console.error(`Error: ${err}`);
        } else {
            game.player1.score = p1Score;
            game.player2.score = p2Score;
            matches.update({ _id: gameId }, game, { replaceOne: true }, () => {
                delete game.player1.id;
                delete game.player2.id;
                io.emit('update', game);
            });
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
        if (command.startsWith('reset')) {
            const parts = command.split(' ');
            resetGame(parts[1]);
        }
        if (command.startsWith('scores')) {
            const parts = command.split(' ');
            setScores(parts[1], Number(parts[2]), Number(parts[3]));
        }
        if (command.startsWith('delete')) {
            const parts = command.split(' ');
            deleteMatch(parts[1]);
        }
    });

    socket.on('auth', (gameId, tokenId) => {
        if (!gameId) {
            matches.find({}, {}, (err, res) => {
                if (err) {
                    console.error(`Error: ${err}`);
                } else {
                    const list = res.slice();
                    list.forEach((item) => {
                        delete item.player1.id;
                        delete item.player2.id;
                    });
                    socket.emit('gameList', list);
                }
            });
        } else {
            matches.findOne({ _id: gameId }, (err, game) => {
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
        matches.findOne({ _id: gameId }, (err, game) => {
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
                    matches.update({ _id: gameId },
                        { $set: { pgn } },
                        {},
                        (updateErr) => {
                            if (updateErr) {
                                console.error(`Error: ${updateErr}`);
                            } else {
                                delete game.player1.id;
                                delete game.player2.id;
                                game.pgn = pgn;
                                io.emit('update', game);
                            }
                        });
                } else {
                    console.error('unauthorised');
                }
            }
        });
    });

    socket.on('concede', (gameId, token) => {
        matches.findOne({ _id: gameId }, (err, game) => {
            if (err || !game) {
                console.error(`Error: ${err}`);
            } else {
                let playerName;
                let playerColour;
                if (game.player1.id === token) {
                    playerName = game.player1.name;
                    playerColour = game.player1.colour;
                    setScores(gameId, game.player1.score, game.player2.score + 1);
                }
                if (game.player2.id === token) {
                    playerName = game.player2.name;
                    playerColour = game.player2.colour;
                    setScores(gameId, game.player1.score + 1, game.player2.score);
                }
                io.emit('concedeNotification', gameId, playerName, playerColour);
            }
        });
    });

    socket.on('offerDraw', (gameId, token) => {
        let playerName = '';
        let colour = '';
        matches.findOne({ _id: gameId }, (err, game) => {
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

    socket.on('drawOfferReponse', (gameId, token, response) => {
        matches.findOne({ _id: gameId }, (err, game) => {
            if (err || !game) {
                console.error(`Error: ${err}`);
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
                    setScores(gameId, game.player1.score + 0.5, game.player2.score + 0.5);
                }
                io.emit('drawNotification', gameId, response, playerColour, playerName);
            }
        });
    });
});

// debug
matches.findOne({}, {}, (err, doc) => {
    if (err) {
        console.error(err);
    } else if (doc) {
        console.log(`/?gameId=${doc._id}&token=${doc.player1.id}`);
        console.log(`/?gameId=${doc._id}&token=${doc.player2.id}`);
    }
});

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
