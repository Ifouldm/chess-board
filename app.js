import Board from './board.js';
import Moves from './moves.js';
import {Chess} from './lib/chess.js';

const app = document.getElementById('app');

var chess = new Chess();
const chessBoard = new Board(chess);

const moves = new Moves(chess);

chess.move(moves[0]);

chessBoard.update();

app.appendChild(chessBoard.element);
