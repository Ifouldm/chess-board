import Square from './square.js';
import { Chess, Move } from './lib/chess.js';

class Board {
    element: HTMLDivElement;

    squares: Map<string, Square>;

    selected = '';

    constructor(private chess: Chess, private moveFn: (move: Move) => void) {
        this.moveFn = moveFn;
        this.chess = chess;
        this.element = document.createElement('div');
        this.element.classList.add('board');
        this.squares = new Map();
        this.generateSquares('w');
    }

    generateSquares(colour: string): void {
        this.element.innerHTML = '';
        const colRef = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        for (let i = 0; i < 64; i += 1) {
            const rank = colour === 'w' ? colRef[i % 8] : colRef[7 - (i % 8)];
            const file = colour === 'w' ? 7 - Math.floor(i / 8) + 1 : Math.floor(i / 8) + 1;
            const pos = `${rank}${file}`;
            const piece = this.chess.get(pos);
            this.squares.set(pos, new Square(
                this,
                piece,
                pos,
                this.chess.square_color(pos),
            ));
            this.element.appendChild(this.squares.get(pos)!.element);
        }
    }

    highlight(pos: string): void {
        const moves = this.chess.moves({ square: pos, verbose: true }) as Move[];
        moves.forEach((move: Move) => {
            this.squares.get(move.to)?.highlight();
        });
    }

    clearHighlighting(): void {
        this.squares.forEach((square) => square.clearHighlighting());
    }

    update(): void {
        this.squares.forEach((square, pos) => {
            square.update(this.chess.get(pos));
        });
    }

    move(move: Move): void {
        this.moveFn(move);
    }
}

export default Board;
