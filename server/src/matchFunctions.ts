import { v4 as uuid } from 'uuid';
import monk from 'monk';
import { io } from './socketEvents';

// Database Connection
let mongoURI = 'localhost';
if (process.env.MONGO_HOST
&& process.env.MONGO_DB) {
    mongoURI = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`;
}
const db = monk(mongoURI, { useNewUrlParser: true });
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

async function createMatch(player1: string, player2: string): Promise<gameModel | null> {
    const player1Colour = Math.random() < 0.5 ? 'w' : 'b';
    const player2Colour = player1Colour === 'w' ? 'b' : 'w';
    const game = {
        player1: {
            id: uuid(), name: player1, score: 0, colour: player1Colour,
        },
        player2: {
            id: uuid(), name: player2, score: 0, colour: player2Colour,
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
        return insertedGame;
    }
    return null;
}

async function deleteMatch(gameId: string): Promise<void> {
    matches.remove({ _id: gameId });
}

async function resetGame(gameId: string): Promise<void> {
    // Colour selection
    const player1Colour = Math.random() < 0.5 ? 'w' : 'b';
    const player2Colour = player1Colour === 'w' ? 'b' : 'w';
    await matches.update({ _id: gameId }, {
        $set: {
            pgn: '',
            'player1.colour': player1Colour,
            'player2.colour': player2Colour,
        },
    });
    const game: gameModel = await matches.findOne({ _id: gameId });
    if (game) {
        delete game.player1.id;
        delete game.player2.id;
        io.emit('update', game);
    }
}

async function setScores(gameId: string, p1Score: number, p2Score: number): Promise<void> {
    const game = await getGame(gameId);
    if (!game) {
        console.error('Error: Unknown game');
    } else {
        game.player1.score = p1Score;
        game.player2.score = p2Score;
        matches.update({ _id: gameId }, {
            $set: {
                'player1.score': p1Score,
                'player2.score': p2Score,
            },
        });
        delete game.player1.id;
        delete game.player2.id;
        io.emit('update', game);
    }
}

export default {
    setScores, resetGame, deleteMatch, createMatch, getGame, getGames, updateGame,
};
