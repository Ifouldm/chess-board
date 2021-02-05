import Board from './board.js';
import { Chess } from './lib/chess.js';

const app = document.getElementById('app');
const statusText = document.getElementById('status');
const turn = document.getElementById('turn');
const history = document.getElementById('history');
const computer = document.getElementById('computer');
const promotion = document.getElementById('promotion');
let chess = new Chess();

const socket = io();

let timer;

function move(moveObj) {
    if (chess.move(moveObj)) {
        socket.emit('move', moveObj);
    }
}

const chessBoard = new Board(chess, move);
app.appendChild(chessBoard.element);
// const moves = new Moves(chess);

// Change the default choice for promotion
promotion.addEventListener('change', (event) => {
    chessBoard.changePromotion(event.target.value);
});

// moves.update();
// console.log(chess);

// Update after move
function update() {
    chessBoard.update();
    statusText.value = '';
    if (chess.game_over()) statusText.value += 'Game Over ';
    if (chess.in_checkmate()) statusText.value += 'Checkmate ';
    if (!chess.in_checkmate() && chess.in_check()) statusText.value += 'Check ';
    if (chess.in_draw()) statusText.value += 'Draw ';
    if (chess.insufficient_material()) statusText.value += 'Insufficient Material ';
    if (chess.in_threefold_repetition()) statusText.value += 'Threefold Repetition';

    history.innerHTML = '';
    chess.history().reverse().forEach((move, index) => {
        const historyElement = document.createElement('li');
        const historyLink = document.createElement('a');
        historyLink.href = '#';
        historyLink.textContent = move;
        historyElement.className = index % 2 === 0 ? 'darkMove' : 'lightMove';
        historyElement.append(historyLink);
        history.append(historyElement);
    });

    turn.className = chess.turn() === 'w' ? 'turn light' : 'turn dark';
}

function playMove() {
    if (computer.checked && chess.turn() === 'b') {
        chess.move(chess.moves()[0]);
        update();
    }
    if (chess.game_over()) {
        clearInterval(timer);
    }
}

computer.addEventListener('change', (event) => {
    if (event.target.checked) {
        timer = setInterval(playMove, 1000);
    } else {
        clearInterval(timer);
    }
});

// Toolbar
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
    if (confirm('Are you sure?')) {
        socket.emit('reset', 'reset');
        update();
    }
});
const concedeButton = document.getElementById('concedeButton');
concedeButton.addEventListener('click', () => {
    if (confirm('Are you sure?')) {
        socket.emit('concede', 'concede');
        update();
    }
});
const offerDrawButton = document.getElementById('offerDrawButton');
offerDrawButton.addEventListener('click', () => {
    if (confirm('Are you sure?')) {
        socket.emit('offerDraw', 'offerDraw');
        console.log('Player offers draw');
        update();
    }
});

socket.on('update', (chessState) => {
    chess = chessState;
    update();
});
