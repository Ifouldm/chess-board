import Square from './square.js';

class Board {
    constructor(chess) {
        this.chess = chess;
        this.element = document.createElement('div');
        this.element.classList.add('board');
        this.squares = [];
        this.generateSquares();
    }

    generateSquares() {
        const colRef = ['a','b','c','d','e','f','g','h'];
        for (let i = 0; i < 64; i++) {
            let rank = colRef[i % 8];
            let file = 7- Math.floor(i / 8) + 1;
            let pos = ''+rank+file;
            let piece = this.chess.get(pos);
            this.squares[i] = new Square(piece, pos, this.chess.square_color(pos));
            this.element.appendChild(this.squares[i].element);
        }
    }

    update() {
        for (const square of this.squares) {
            let piece = this.chess.get(square.pos);
            square.update(piece);
        }
    }
}

export default Board;