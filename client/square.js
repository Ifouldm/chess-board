const pieces = {
    pb: 'Chess_pdt45.svg',
    kb: 'Chess_kdt45.svg',
    qb: 'Chess_qdt45.svg',
    bb: 'Chess_bdt45.svg',
    nb: 'Chess_ndt45.svg',
    rb: 'Chess_rdt45.svg',
    pw: 'Chess_plt45.svg',
    kw: 'Chess_klt45.svg',
    qw: 'Chess_qlt45.svg',
    bw: 'Chess_blt45.svg',
    nw: 'Chess_nlt45.svg',
    rw: 'Chess_rlt45.svg',
};
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

    addEventListeners(pos) {
        const { board } = this;
        this.element.addEventListener('dragstart', (event) => {
            board.highlight(pos);
            event.dataTransfer.setData('text/plain', pos);
        }, false);
        this.element.addEventListener('dragover', (event) => {
            event.preventDefault();
        }, false);
        this.element.addEventListener('dragenter', (event) => {
            // highlight potential drop target when the draggable element enters it
            event.preventDefault();
            if (event.target.className.includes('square')) {
                event.target.classList.add('overlay', 'red');
            }
        }, false);
        this.element.addEventListener('dragleave', (event) => {
            // clear highlight from drop target when the draggable element leaves it
            event.preventDefault();
            if (event.target.className.includes('square')) {
                event.target.classList.remove('overlay', 'red');
            }
        }, false);
        this.element.addEventListener('drop', (event) => {
            event.preventDefault();
            event.target.classList.remove('overlay', 'red');
            const from = event.dataTransfer.getData('text/plain');
            const to = pos;
            const { promotion } = this.board;
            const move = {
                from,
                to,
                promotion,
            };
            this.board.moveFn(move);
        }, false);
        this.element.addEventListener('dragend', () => this.board.clearHighlighting());
    }

    clearHighlighting() {
        this.element.classList.remove('overlay', 'purple');
    }

    highlight() {
        this.element.classList.add('overlay', 'purple');
    }

    update(piece) {
        if (piece) {
            this.piece.src = `./assets/${pieces[piece.type + piece.color]}`;
            this.piece.style.display = 'block';
        } else {
            this.piece.style.display = 'none';
        }
    }
}

export default Square;
