"use strict";
const uuid = require('uuid');
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
    matches.insert(game, (err, insertedGame) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(`http://localhost:3000?gameId=${insertedGame._id}&token=${insertedGame.player1.id}`);
            console.log(`http://localhost:3000?gameId=${insertedGame._id}&token=${insertedGame.player2.id}`);
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
        }
        else {
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
        }
        else {
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
