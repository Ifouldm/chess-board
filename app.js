import Board from './board.js';
import Moves from './moves.js';
import {Chess} from './lib/chess.js';

const app = document.getElementById('app');
const statusText = document.getElementById('status');
const turn = document.getElementById('turn');
const history = document.getElementById('history');
const computer = document.getElementById('computer');
const promotion = document.getElementById('promotion');

var chess = new Chess();
const chessBoard = new Board(chess, update);
app.appendChild(chessBoard.element);
const moves = new Moves(chess);

// Change the default choice for promotion
promotion.addEventListener('change', (event) => {
    chessBoard.changePromotion(event.target.value);
});

//moves.update();
console.log(chess);

// computer clock
const timer = setInterval(playMove, 1000);

function playMove() {
    if (computer.checked && chess.turn() === 'b') {
        chess.move(chess.moves()[0]);
        update();
    }
    if (chess.game_over()) {
        clearInterval(timer);
    }
}

// Update after move
function update() {
    chessBoard.update();
    statusText.value = '';
    if (chess.game_over()) statusText.value += 'Game Over ';
    if (chess.in_checkmate()) statusText.value += 'Checkmate ';
    if (!chess.in_checkmate() && chess.in_check()) statusText.value += 'Check ';
    if (chess.in_draw()) statusText.value += 'Draw ';
    if (chess.in_threefold_repetition()) statusText.value += 'Threefold Repetition';

    history.innerHTML = '';
    chess.history().reverse().forEach((move, index) => {
        const historyElement = document.createElement('li');
        historyElement.className = index % 2 === 0 ? 'darkMove' : 'lightMove';
        historyElement.textContent = move;
        history.append(historyElement);
    });
    
    turn.className = chess.turn() === 'w' ? 'light' : 'dark';
}

// Toolbar
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
    if (confirm('Are you sure?')) {
        chess.reset();
        update();
    }
});
concedeButton.addEventListener('click', () => {
    if (confirm('Are you sure?')) {
        chess.;
        update();
    }
});
offerDrawButton.addEventListener('click', () => {
    if (confirm('Are you sure?')) {
        chess.reset();
        update();
    }
});

