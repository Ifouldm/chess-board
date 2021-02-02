import Square from './square.js';

class Board {
    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('board');
        this.squares = [];
        this.generateSquares();
    }

    generateSquares() {
        const colRef = ['A','B','C','D','E','F','G','H'];
        for (let i = 0; i < 64; i++) {
            let col = i % 8;
            let row = 8 - Math.floor(i / 8);
            const isBlack = !(col % 2 === row % 2);
            this.squares[i] = new Square(''+colRef[col]+row, isBlack);
            this.element.appendChild(this.squares[i].element);
        }
    }
}

export default Board;