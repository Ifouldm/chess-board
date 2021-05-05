/* eslint-disable import/no-unresolved */
import Board from './board.js';
import Modal from './modal.js';
import Toolbar from './toolbar.js';
import ScoreTable from './scoretable.js';
import { Chess, Move } from './lib/chess.js';
import {
    isPushNotificationSupported,
    initializePushNotifications,
    registerServiceWorker,
    getUserSubscription,
    createNotificationSubscription,
} from './push-notifications.js';
import Loading from './loading.js';
import Chat from './chat.js';
import { gameModel, message } from './types.js';

// Build UI
const app = document.getElementById('app') as HTMLDivElement;
const loadingElement = new Loading();
const loading = loadingElement.getElement();
const chat = new Chat(submitMessage);

// Audio
const audioMove = new Audio('/assets/default/move.ogg');

// SocketIO
const socket = io();

// Get game details using query params
function getParameterByName(name: string, url = window.location.href) {
    const sanName = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${sanName}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Query parameters & globals
const gameId = getParameterByName('gameId');
const token = getParameterByName('token');
let playerColour: 'w' | 'b' | null;

socket.emit('auth', gameId, token);

// Push services
if (isPushNotificationSupported()) {
    // register the service worker: file "sw.js" in the root of our project
    registerServiceWorker();
    getUserSubscription().then((subscription) => {
        if (!subscription) {
            initializePushNotifications().then(() => {
                createNotificationSubscription().then((sub) => {
                    fetch('/subscription', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ gameId, token, sub }),
                    })
                        .then()
                        .catch((err) => console.error(err));
                });
            });
        }
    });
}

// Setup and draw
const chess = new Chess();
const chessBoard = new Board(chess, movePiece);
const toolbar = new Toolbar();
const modal = new Modal();
update();

// Update after each move
function update() {
    chessBoard.update();
    toolbar.update(chess);
}

// Toolbar
const concedeButton = document.getElementById('concedeButton');
if (concedeButton) {
    concedeButton.addEventListener('click', () => {
        modal.show('Are you sure you want to Concede?', () => {
            socket.emit('concede', gameId, token);
        });
    });
}
const offerDrawButton = document.getElementById('offerDrawButton');
if (offerDrawButton) {
    offerDrawButton.addEventListener('click', () => {
        modal.show('Are you sure you want to offer a draw?', () => {
            socket.emit('offerDraw', gameId, token);
        });
    });
}
const commandField = document.getElementById('command') as HTMLInputElement;
if (commandField) {
    commandField.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            socket.emit('command', commandField.value, token);
        }
    });
}
const commandButton = document.getElementById(
    'submitCommand'
) as HTMLButtonElement;
if (commandButton) {
    commandButton.addEventListener('click', () => {
        socket.emit('command', commandField.value, token);
    });
}

// Socket events
function movePiece(moveObj: Move) {
    if (playerColour === chess.turn()) {
        moveObj.promotion = toolbar.promotionSelection;
        if (chess.move(moveObj)) {
            socket.emit('move', gameId, token, moveObj);
        }
    }
}

function submitMessage(messageOut: string) {
    socket.emit('message', gameId, token, messageOut);
}

socket.on('update', (gameUpdate: gameModel) => {
    if (gameUpdate._id === gameId) {
        chess.load_pgn(gameUpdate.pgn);
        toolbar.player1.score = gameUpdate.player1.score;
        toolbar.player2.score = gameUpdate.player2.score;
        toolbar.set(gameUpdate.player1, gameUpdate.player2, playerColour);
        update();
        audioMove.play();
    }
});

socket.on('initialState', (gameState: gameModel, pColour: 'w' | 'b' | null) => {
    if (gameState._id === gameId) {
        loading.style.display = 'none';
        playerColour = pColour;
        if (playerColour === 'b') chessBoard.generateSquares('b');
        toolbar.set(gameState.player1, gameState.player2, playerColour);
        chess.load_pgn(gameState.pgn);
        app.appendChild(chessBoard.element);
        chat.update(gameState.messages);
        update();
    }
});

socket.on(
    'concedeNotification',
    (gameRef: string, playerName: string, concedeColour: 'w' | 'b') => {
        if (gameRef === gameId && concedeColour !== playerColour) {
            modal.show(`${playerName} conceded, ok to accept`);
        }
    }
);

socket.on(
    'drawOffer',
    (gameRef: string, playerName: string, drawColour: 'w' | 'b') => {
        if (gameRef === gameId && drawColour !== playerColour) {
            modal.show(
                `${playerName} offered a draw, ok to accept, cancel to deny`,
                () => {
                    socket.emit('drawOfferReponse', gameId, token, true);
                },
                () => {
                    socket.emit('drawOfferReponse', gameId, token, false);
                }
            );
        }
    }
);

socket.on(
    'drawNotification',
    (
        gameRef: string,
        accepted: boolean,
        resColour: 'w' | 'b',
        resName: string
    ) => {
        if (gameRef === gameId && resColour !== playerColour) {
            modal.show(
                `${resName} ${
                    accepted ? 'accepted' : 'declined'
                } a draw, ok to continue`
            );
        }
    }
);

socket.on('gameList', (gameList: gameModel[]) => {
    loading.style.display = 'none';
    const scoreDiv = document.createElement('div');
    const scoreTable = new ScoreTable(gameList);
    scoreDiv.appendChild(scoreTable.element);
    scoreDiv.id = 'scores';
    app.appendChild(scoreDiv);
});

socket.on('chatMessage', (gameRef: string, messages: message[]) => {
    if (gameRef === gameId) {
        chat.update(messages);
    }
});
