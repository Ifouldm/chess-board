class Toolbar {
    constructor(toolbar) {
        this.element = toolbar;
        this.status = document.getElementById('status');
        this.turn = document.getElementById('turn');
        this.history = document.getElementById('history');
        this.promotion = document.getElementById('promotion');
        this.playerBadge = document.getElementById('playerName');
        this.p1Name = document.getElementById('p1Name');
        this.p2Name = document.getElementById('p2Name');
        this.p1Score = document.getElementById('p1Score');
        this.p2Score = document.getElementById('p2Score');
        // Change the default choice for promotion
        this.promotionSelection = 'q';
        this.promotion.addEventListener('change', (event) => {
            this.promotionSelection = event.target.value;
        });
    }

    set(player1, player2, colour) {
        this.colour = colour;
        this.player1 = player1;
        this.player2 = player2;
    }

    update(chess) {
        this.status.value = '';
        if (chess.game_over()) this.status.value += 'Game Over ';
        if (chess.in_checkmate()) this.status.value += 'Checkmate ';
        if (!chess.in_checkmate() && chess.in_check()) this.status.value += 'Check ';
        if (chess.in_draw()) this.status.value += 'Draw ';
        if (chess.insufficient_material()) this.status.value += 'Insufficient Material ';
        if (chess.in_threefold_repetition()) this.status.value += 'Threefold Repetition';

        this.history.innerHTML = '';
        chess.history().reverse().forEach((move, index) => {
            const historyElement = document.createElement('li');
            const historyLink = document.createElement('a');
            historyLink.href = '#';
            historyLink.textContent = move;
            historyElement.className = index % 2 === 0 ? 'darkMove' : 'lightMove';
            historyElement.append(historyLink);
            this.history.append(historyElement);
        });
        this.turnColour = chess.turn();
        this.turn.className = this.turnColour === 'w' ? 'turn light' : 'turn dark';
        if (this.player1) {
            this.playerBadge.className = '';
            this.playerBadge.textContent = this.turnColour === this.player1.colour
                ? this.player1.name
                : this.player2.name;
            if (this.colour === this.turnColour) {
                this.playerBadge.textContent += ' (You)';
                this.playerBadge.className = 'you';
            }
            this.p1Name.textContent = this.player1.name;
            this.p2Name.textContent = this.player2.name;
            this.p1Score.textContent = this.player1.score;
            this.p2Score.textContent = this.player2.score;
        }
    }
}

export default Toolbar;
