import uuid from 'uuid';
import monk from 'monk';
import { Chess } from './chess.js';
import { io } from './socketEvents';

const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

console.log(mongoURI);

const db = monk(mongoURI || 'localhost');

const matches = db.get('matches');

type player = {id?: string, name: string, score: number, colour: 'b' | 'w'}
type gameModel = {_id: string, player1: player, player2: player, pgn: string};

async function getGame(gameId: string): Promise<gameModel> {
    return matches.findOne({ _id: gameId });
}

async function getGames(): Promise<gameModel[]> {
    return matches.find({});
}

async function updateGame(gameId: string, pgn: string): Promise<void> {
    matches.update({ _id: gameId }, { $set: { pgn } });
}

async function createMatch(player1: string, player2: string): Promise<void> {
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
    const insertedGame: gameModel = await matches.insert(game);
    if (insertedGame) {
        console.log(`http://localhost:3000?gameId=${insertedGame._id}&token=${insertedGame.player1.id}`);
        console.log(`http://localhost:3000?gameId=${insertedGame._id}&token=${insertedGame.player2.id}`);
        delete insertedGame.player1.id;
        delete insertedGame.player2.id;
        io.emit('update', insertedGame);
    }
}

async function deleteMatch(gameId: string): Promise<void> {
    matches.remove({ _id: gameId });
}

async function resetGame(gameId: string): Promise<void> {
    const chess = new Chess();
    const game: gameModel = await matches.findOne({ _id: gameId });
    chess.load_pgn(game.pgn);
    chess.reset();
    game.pgn = chess.pgn();
    matches.update({ _id: gameId }, game, { replace: true });
    delete game.player1.id;
    delete game.player2.id;
    io.emit('update', game);
}

async function setScores(gameId: string, p1Score: number, p2Score: number): Promise<void> {
    const game = await getGame(gameId);
    if (!game) {
        console.error('Error: Unknown game');
    } else {
        game.player1.score = p1Score;
        game.player2.score = p2Score;
        matches.update({ _id: gameId }, {
            $set: { player1: { score: p1Score } },
            player2: { score: p2Score },
        });
        delete game.player1.id;
        delete game.player2.id;
        io.emit('update', game);
    }
}

export default {
    setScores, resetGame, deleteMatch, createMatch, getGame, getGames, updateGame,
};
