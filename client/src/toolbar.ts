import { Chess } from './lib/chess.js';

import { pieces } from './pieces.js';

import { player } from './types.js';

class Toolbar {
    toolbar: HTMLDivElement;

    colour: 'w' | 'b' | null;

    promotionSelection: string;

    player1: player;

    player2: player;

    template = `<div class="row">Status:</div>
        <div class="row">
            <input type="text" class="textinput" name="status" id="status" readonly>
        </div>
        <div class="row">
            Turn: <span id="playerName"></span>
            <div id="turn" class="turn light"></div>
        </div>
        <div class="row">Moves:</div>
        <div class="row">
            <div class="scrollableArea">
                <ol id="history" reversed class="history"></ol>
            </div>
        </div>
        <div class="row">
            Promotion choice:
        </div>
        <div class="row">
            <div id="promotion" class="icons">
                <label for="bishop">
                    <input class="selection" type="radio" id="bishop" name="promotion" value="b">
                    <img class="img" src="#" id=bishopIcon alt="Bishop">
                </label>
                <label for="knight">
                    <input class="selection" type="radio" id="knight" name="promotion" value="n">
                    <img class="img" src="#" id=knightIcon alt="Knight">
                </label>
                <label for="rook">
                    <input class="selection" type="radio" id="rook" name="promotion" value="r">
                    <img class="img" src="#" id=rookIcon alt="Rook">
                </label>
                <label for="queen">
                    <input class="selection" type="radio" id="queen" checked name="promotion" value="q">
                    <img class="img" src="#" id=queenIcon alt="Queen">
                </label>
            </div>
        </div>
        <div class="row">
            <button id=concedeButton class="button">Concede</button>
        </div>
        <div class="row">
            <button id=offerDrawButton class="button">Offer Draw</button>
        </div>
        <div class="row">
            Score:
        </div>
        <div class="row">
            <div class="score">
                <span id="p1Name"></span>:<span id="p1Score"></span>
            </div>
            <div class="score">
                <span id="p2Name"></span>:<span id="p2Score"></span>
            </div>
        </div>
        <div class="row">
            Command:
        </div>
        <div class="row">
            <input type="text" id="command" class="textinput">
            <button class="button sm" id="submitCommand">+</button>
        </div>`;

    constructor() {
        const app = document.getElementById('app');
        this.toolbar = document.createElement('div');
        this.toolbar.id = 'toolbar';
        this.toolbar.innerHTML = this.template;
        this.colour = 'w';
        app?.appendChild(this.toolbar);
        // Change the default choice for promotion
        this.promotionSelection = 'q';
        const promotion = document.getElementById(
            'promotion'
        ) as HTMLDivElement;
        promotion.addEventListener('change', (event: Event) => {
            if (event.target) {
                const promotionSel = event.target as HTMLInputElement;
                this.promotionSelection = promotionSel.value;
            }
        });
        const queenIcon = document.getElementById(
            'queenIcon'
        ) as HTMLImageElement;
        queenIcon.setAttribute('src', `assets/${pieces.get('qb')}`);
        queenIcon.alt = 'Queen';
        queenIcon.title = 'Queen';
        const knightIcon = document.getElementById(
            'knightIcon'
        ) as HTMLImageElement;
        knightIcon.setAttribute('src', `assets/${pieces.get('nb')}`);
        knightIcon.alt = 'Knight';
        knightIcon.title = 'Knight';
        const bishopIcon = document.getElementById(
            'bishopIcon'
        ) as HTMLImageElement;
        bishopIcon.setAttribute('src', `assets/${pieces.get('bb')}`);
        bishopIcon.alt = 'Bishop';
        bishopIcon.title = 'Bishop';
        const rookIcon = document.getElementById(
            'rookIcon'
        ) as HTMLImageElement;
        rookIcon.setAttribute('src', `assets/${pieces.get('rb')}`);
        rookIcon.alt = 'Rook';
        rookIcon.title = 'Rook';
        this.player1 = { name: 'p1', colour: 'w', score: 0 };
        this.player2 = { name: 'p1', colour: 'w', score: 0 };
    }

    getElement(): HTMLDivElement {
        return this.toolbar;
    }

    set(player1: player, player2: player, colour: 'w' | 'b' | null): void {
        this.colour = colour;
        this.player1 = player1;
        this.player2 = player2;
    }

    update(chess: Chess): void {
        const status = document.getElementById('status') as HTMLInputElement;
        const turn = document.getElementById('turn') as HTMLDivElement;
        const history = document.getElementById('history') as HTMLOListElement;
        const playerBadge = document.getElementById(
            'playerName'
        ) as HTMLSpanElement;
        const p1Name = document.getElementById('p1Name') as HTMLSpanElement;
        const p2Name = document.getElementById('p2Name') as HTMLSpanElement;
        const p1Score = document.getElementById('p1Score') as HTMLSpanElement;
        const p2Score = document.getElementById('p2Score') as HTMLSpanElement;

        status.value = '';
        if (chess.game_over()) status.value += 'Game Over ';
        if (chess.in_checkmate()) status.value += 'Checkmate ';
        if (!chess.in_checkmate() && chess.in_check()) status.value += 'Check ';
        if (chess.in_draw()) status.value += 'Draw ';
        if (chess.insufficient_material())
            status.value += 'Insufficient Material ';
        if (chess.in_threefold_repetition())
            status.value += 'Threefold Repetition';

        history.innerHTML = '';
        chess
            .history()
            .reverse()
            .forEach((move: string, index: number) => {
                const historyElement = document.createElement('li');
                const historyLink = document.createElement('a');
                historyLink.href = '#';
                historyLink.textContent = move;
                historyElement.className =
                    (chess.history().length - index) % 2 === 0
                        ? 'darkMove'
                        : 'lightMove';
                historyElement.append(historyLink);
                history.append(historyElement);
            });
        const turnColour = chess.turn();
        turn.className = turnColour === 'w' ? 'turn light' : 'turn dark';
        if (this.player1) {
            playerBadge.className = '';
            playerBadge.textContent =
                turnColour === this.player1.colour
                    ? this.player1.name
                    : this.player2.name;
            if (this.colour === turnColour) {
                playerBadge.textContent += ' (You)';
                playerBadge.className = 'you';
            }
            p1Name.textContent = this.player1.name;
            p2Name.textContent = this.player2.name;
            p1Score.textContent = this.player1.score.toString();
            p2Score.textContent = this.player2.score.toString();
        }
    }
}

export default Toolbar;
