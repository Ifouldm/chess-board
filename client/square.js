const pieces = {
    'pb': 'Chess_pdt45.svg',
    'kb': 'Chess_kdt45.svg',
    'qb': 'Chess_qdt45.svg',
    'bb': 'Chess_bdt45.svg',
    'nb': 'Chess_ndt45.svg',
    'rb': 'Chess_rdt45.svg',
    'pw': 'Chess_plt45.svg',
    'kw': 'Chess_klt45.svg',
    'qw': 'Chess_qlt45.svg',
    'bw': 'Chess_blt45.svg',
    'nw': 'Chess_nlt45.svg',
    'rw': 'Chess_rlt45.svg',
}
class Square {
    constructor(chess, board, piece, pos, sqColor) {
        this.chess = chess;
        this.board = board;
        this.element = document.createElement('div');
        this.isDark = sqColor === 'dark';
        this.element.classList.add('square', sqColor);
        this.element.id = pos;
        this.piece = document.createElement('img');
        this.addEventListeners(pos);
        this.element.appendChild(this.piece);
        this.piece.draggable = true;
        this.piece.style.display = 'none';
        this.piece.classList.add('piece');
        this.update(piece);
    }

    addEventListeners(pos){
        let board = this.board;
        this.element.addEventListener("dragstart", function(event) {
            console.log(pos);
            board.highlight(pos);
            event.dataTransfer.setData('text/plain', pos);
        }, false);
        this.element.addEventListener('dragover', (event) => {
            event.preventDefault();    
        }, false);
        this.element.addEventListener("dragenter", function(event) {
            // highlight potential drop target when the draggable element enters it
            event.preventDefault();
            if (event.target.className.includes("square")) {
                event.target.style.background = "#e6ccff";
            }

        }, false);
        this.element.addEventListener("dragleave", function(event) {
            // clear highlight from drop target when the draggable element leaves it
            event.preventDefault();
            if (event.target.className.includes("square")) {
                event.target.style.background = "";
            }

        }, false);
        this.element.addEventListener('drop', (event) => {
            event.preventDefault();
            const from = event.dataTransfer.getData('text/plain');
            console.log(from);
            const to = pos;
            const promotion = this.board.promotion;
            let move = {
                from,
                to,
                promotion
            };
            console.log(move);
            this.chess.move(move);
            this.board.updatefn();
        }, false);
        this.element.addEventListener('dragend', () => this.board.clearHighlighting());
    }

    clearHighlighting() {
        this.element.style.background = '';
    }

    highlight() {
        this.element.style.background = 'red';
    }

    update(piece) {
        if (piece) {
            this.piece.src = './assets/'+pieces[piece.type+piece.color];
            this.piece.style.display = 'block';
        } else {
            this.piece.style.display = 'none';
        }
    }
}

export default Square;