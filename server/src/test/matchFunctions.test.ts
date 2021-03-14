import { assert } from 'chai';
import match from '../matchFunctions.js';

let gameId = '';

before(async () => {
    const game = await match.createMatch('Test Agent 1', 'Test Agent 2');
    if (game) {
        gameId = game._id;
    }
});

describe('Set scores function', () => {
    it('Set score to 0-0', async () => {
        await match.setScores(gameId, 0, 0);
        const result = await match.getGame(gameId);
        assert.equal(result.player1.score, 0);
        assert.equal(result.player2.score, 0);
    });
    it('Set score to 1-1', async () => {
        await match.setScores(gameId, 1, 1);
        const result = await match.getGame(gameId);
        assert.equal(result.player1.score, 1);
        assert.equal(result.player2.score, 1);
    });
    it('Set score to 5-3', async () => {
        await match.setScores(gameId, 5, 3);
        const result = await match.getGame(gameId);
        assert.equal(result.player1.score, 5);
        assert.equal(result.player2.score, 3);
    });
});

after(() => {
    match.deleteMatch(gameId);
});
