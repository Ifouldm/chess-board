class Toolbar {
    constructor(element) {
        this.element = element;
        this.colour = 'w';
        // Change the default choice for promotion
        this.promotionSelection = 'q';
        const promotion = document.getElementById('promotion');
        promotion.addEventListener('change', (event) => {
            if (event.target) {
                const promotionSel = event.target;
                this.promotionSelection = promotionSel.value;
            }
        });
        this.player1 = { name: 'p1', colour: 'w', score: 0 };
        this.player2 = { name: 'p1', colour: 'w', score: 0 };
    }
    set(player1, player2, colour) {
        this.colour = colour;
        this.player1 = player1;
        this.player2 = player2;
    }
    update(chess) {
        const status = document.getElementById('status');
        const turn = document.getElementById('turn');
        const history = document.getElementById('history');
        const playerBadge = document.getElementById('playerName');
        const p1Name = document.getElementById('p1Name');
        const p2Name = document.getElementById('p2Name');
        const p1Score = document.getElementById('p1Score');
        const p2Score = document.getElementById('p2Score');
        status.value = '';
        if (chess.game_over())
            status.value += 'Game Over ';
        if (chess.in_checkmate())
            status.value += 'Checkmate ';
        if (!chess.in_checkmate() && chess.in_check())
            status.value += 'Check ';
        if (chess.in_draw())
            status.value += 'Draw ';
        if (chess.insufficient_material())
            status.value += 'Insufficient Material ';
        if (chess.in_threefold_repetition())
            status.value += 'Threefold Repetition';
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
        if (this.player1) {
            playerBadge.className = '';
            playerBadge.textContent = turnColour === this.player1.colour
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
