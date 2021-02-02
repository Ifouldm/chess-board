import Board from './board.js';

const app = document.getElementById('app');

const chessBoard = new Board();

app.appendChild(chessBoard.element);
