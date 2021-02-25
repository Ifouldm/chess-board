type game = {
    _id: string,
    player1: { name: string, score: number, colour: string },
    player2: { name: string, score: number, colour: string },
    pgn: string
};

class ScoreTable {
    element: HTMLTableElement;

    tableBody: HTMLElement;

    constructor(gameList: game[]) {
        this.element = document.createElement('table');
        this.element.className = 'scoretable';
        this.tableBody = document.createElement('tbody');
        const gameHeader = document.createElement('th');
        gameHeader.textContent = 'Match';
        const scoreHeader = document.createElement('th');
        scoreHeader.textContent = 'Score';
        this.element.appendChild(gameHeader);
        this.element.appendChild(scoreHeader);
        this.element.appendChild(this.tableBody);
        this.update(gameList);
    }

    update(gameList: game[]): void {
        const newTableBody = document.createElement('tbody');
        gameList.forEach((gameItem) => {
            const row = document.createElement('tr');
            const gameCell = document.createElement('td');
            const scoreCell = document.createElement('td');
            const link = document.createElement('a');
            link.href = `/?gameId=${gameItem._id}`;
            link.textContent = `${gameItem.player1.name} vs ${gameItem.player2.name}`;
            gameCell.appendChild(link);
            scoreCell.textContent = `${gameItem.player1.score} - ${gameItem.player2.score}`;
            row.appendChild(gameCell);
            row.appendChild(scoreCell);
            newTableBody.appendChild(row);
        });
        this.element.replaceChild(newTableBody, this.tableBody);
    }
}
export default ScoreTable;
