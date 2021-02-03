import Board from './board.js';
import Moves from './moves.js';
import {Chess} from './lib/chess.js';

const app = document.getElementById('app');

var chess = new Chess();
const chessBoard = new Board(chess);
app.appendChild(chessBoard.element);
const moves = new Moves(chess);

moves.update();
console.log(chess);

const timer = setInterval(playMove, 1000);

function playMove() {    
    if (chess.turn() === 'b') {
        chess.move(chess.moves()[0]);
        chessBoard.update();
    }
    if (chess.game_over()) {
        clearInterval(timer);
        console.log('Game Over');
    }
}


//clearInterval(timer);

