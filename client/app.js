import Board from './board.js';
import Modal from './modal.js';
import { Chess } from './lib/chess.js';

// DOM elements
const app = document.getElementById('app');
const statusText = document.getElementById('status');
const turn = document.getElementById('turn');
const history = document.getElementById('history');
const promotion = document.getElementById('promotion');
const playerBadge = document.getElementById('playerName');
const loading = document.getElementById('loading');

const modal = new Modal();

const socket = io();

let colour;
let player1 = '';
let player2 = '';

// Setup and draw
const chess = new Chess();
const chessBoard = new Board(chess, movePiece);
update();

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
    if (player1) {
        playerBadge.textContent = player1.colour === turnColour ? player1.name : player2.name;
    }
}

// Toolbar
const concedeButton = document.getElementById('concedeButton');
concedeButton.addEventListener('click', () => {
    modal.show('Are you sure you want to Concede?', () => {
        socket.emit('concede', gameId, token);
    });
});
const offerDrawButton = document.getElementById('offerDrawButton');
offerDrawButton.addEventListener('click', () => {
    modal.show('Are you sure you want to offer a draw?', () => {
        socket.emit('offerDraw', gameId, token);
    });
});
const commandField = document.getElementById('command');
commandField.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        socket.emit('command', commandField.value, token);
    }
});

// Socket events
function movePiece(moveObj) {
    if (colour === chess.turn()) {
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
    loading.style.display = 'none';
    colour = playerColour;
    player1 = chessState.player1;
    player2 = chessState.player2;
    chess.load_pgn(chessState.pgn.toString());
    app.appendChild(chessBoard.element);
    update();
});

socket.on('concede', (game, playerName) => {
    if (game === gameId) {
        modal.show(`${playerName} conceded, ok to start new game`);
    }
});

socket.on('drawOffer', (game, playerName, concedeColour) => {
    console.log(game, playerName, concedeColour);
    if (game === gameId && concedeColour !== colour) {
        modal.show(`${playerName} offered a draw, ok to accept cancel to deny`);
    }
});

socket.on('gameList', (gameList) => {
    loading.style.display = 'none';
    const list = document.createElement('ul');
    gameList.forEach((gameItem) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `/?gameId=${gameItem._id}`;
        link.textContent = `${gameItem.player1.name} vs ${gameItem.player2.name}`;
        item.appendChild(link);
        list.appendChild(item);
    });
    app.appendChild(list);
});
