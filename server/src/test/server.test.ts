import { assert } from 'chai';

before(async () => {
    // console.log('Setting up env');
});

after(async () => {
    // console.log('removing env');
});

describe('Set scores function', () => {
    it('Test 1', async () => {
        assert.equal(5, 2 + 3, '2 + 3 = 5');
    });
    it('Test 1', async () => {
        assert.equal('2 + 3', '2 + 3', '\'2 + 3\' = \'2 + 3\'');
    });
});
