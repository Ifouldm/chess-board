import Square from './square.js';

class Board {
    constructor(chess, moveFn) {
        this.moveFn = moveFn;
        this.chess = chess;
        this.element = document.createElement('div');
        this.element.classList.add('board');
        this.squares = new Map();
        this.generateSquares('w');
    }

    generateSquares(colour) {
        this.element.innerHTML = '';
        const colRef = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        for (let i = 0; i < 64; i += 1) {
            const rank = colour === 'w' ? colRef[i % 8] : colRef[7 - (i % 8)];
            const file = colour === 'w' ? 7 - Math.floor(i / 8) + 1 : Math.floor(i / 8) + 1;
            const pos = `${rank}${file}`;
            const piece = this.chess.get(pos);
            this.squares.set(pos, new Square(
                this.chess,
                this, piece,
                pos,
                this.chess.square_color(pos),
            ));
            this.element.appendChild(this.squares.get(pos).element);
        }
    }

    highlight(pos) {
        const moves = this.chess.moves({ square: pos, verbose: true });
        moves.forEach((move) => this.squares.get(move.to).highlight());
    }

    clearHighlighting() {
        for (const square of this.squares) {
            square[1].clearHighlighting();
        }
    }

    update() {
        for (const square of this.squares) {
            const piece = this.chess.get(square[0]);
            square[1].update(piece);
        }
    }
}

export default Board;
