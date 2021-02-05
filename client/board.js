import Square from './square.js';

class Board {
    constructor(chess, updatefn) {
        this.promotion = 'q';
        this.updatefn = updatefn;
        this.chess = chess;
        this.element = document.createElement('div');
        this.element.classList.add('board');
        this.squares = new Map();
        this.generateSquares();
    }

    generateSquares() {
        const colRef = ['a','b','c','d','e','f','g','h'];
        for (let i = 0; i < 64; i++) {
            let rank = colRef[i % 8];
            let file = 7- Math.floor(i / 8) + 1;
            let pos = ''+rank+file;
            let piece = this.chess.get(pos);
            this.squares.set(pos, new Square(this.chess, this, piece, pos, this.chess.square_color(pos)));
            this.element.appendChild(this.squares.get(pos).element);
        }
    }

    changePromotion(promotion) {
        this.promotion = promotion;
    }

    highlight(pos) {
        let moves = this.chess.moves({ square: pos, verbose: true });
        moves.forEach((move) => this.squares.get(move.to).highlight());
    }

    clearHighlighting() {
        for (const square of this.squares) {
            square[1].clearHighlighting();
        }
    }

    update() {
        for (const square of this.squares) {
            let piece = this.chess.get(square[0]);
            square[1].update(piece);
        }
    }
}

export default Board;