import Board from './board.js';
import { Chess } from './lib/chess.js';

const app = document.getElementById('app');
const statusText = document.getElementById('status');
const turn = document.getElementById('turn');
const history = document.getElementById('history');
const promotion = document.getElementById('promotion');
const playerName = document.getElementById('playerName');

const chess = new Chess();

const socket = io();

let chessBoard;
let colour;

// Get game details using query params
function getParameterByName(name, url = window.location.href) {
    const sanName = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${sanName}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
const gameId = getParameterByName('gameId');
const token = getParameterByName('token');
socket.emit('auth', gameId, token);

// Change the default choice for promotion
promotion.addEventListener('change', (event) => {
    chessBoard.changePromotion(event.target.value);
});

// Update after each move
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
    const turnColour = chess.turn();
    turn.className = turnColour === 'w' ? 'turn light' : 'turn dark';
    const header = chess.header();
    const player = turnColour === 'w' ? header.White : header.Black;

    playerName.textContent = player;
}

// Toolbar
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
    if (confirm('Are you sure?')) {
        socket.emit('reset', 'reset');
    }
});
const concedeButton = document.getElementById('concedeButton');
concedeButton.addEventListener('click', () => {
    if (confirm('Are you sure?')) {
        socket.emit('concede', 'concede');
    }
});
const offerDrawButton = document.getElementById('offerDrawButton');
offerDrawButton.addEventListener('click', () => {
    if (confirm('Are you sure?')) {
        socket.emit('offerDraw', 'offerDraw');
        console.log('Player offers draw');
    }
});
const commandField = document.getElementById('command');
commandField.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        socket.emit('command', commandField.value);
    }
});

// Socket events
function movePiece(moveObj) {
    if (colour) {
        if (chess.move(moveObj)) {
            socket.emit('move', gameId, token, moveObj);
        }
    }
}

socket.on('update', (chessState) => {
    chess.load_pgn(chessState.toString());
    update();
});

socket.on('initialState', (chessState, playerColour) => {
    colour = playerColour;
    chess.load_pgn(chessState.pgn.toString());
    chessBoard = new Board(chess, movePiece);
    app.appendChild(chessBoard.element);
    update();
});
