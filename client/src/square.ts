import Board from './board.js';

type piece = { type: string, color: string } | null;

const pieces = new Map<string, string>();
pieces.set('pb', 'Chess_pdt45.svg');
pieces.set('kb', 'Chess_kdt45.svg');
pieces.set('qb', 'Chess_qdt45.svg');
pieces.set('bb', 'Chess_bdt45.svg');
pieces.set('nb', 'Chess_ndt45.svg');
pieces.set('rb', 'Chess_rdt45.svg');
pieces.set('pw', 'Chess_plt45.svg');
pieces.set('kw', 'Chess_klt45.svg');
pieces.set('qw', 'Chess_qlt45.svg');
pieces.set('bw', 'Chess_blt45.svg');
pieces.set('nw', 'Chess_nlt45.svg');
pieces.set('rw', 'Chess_rlt45.svg');

class Square {
    isMobile: boolean;

    element: HTMLDivElement;

    isDark: boolean;

    piece: HTMLImageElement;

    constructor(
        private board: Board,
        currentPiece: piece,
        pos: string,
        sqColor: string,
    ) {
        this.isMobile = /Mobi/i.test(navigator.userAgent);
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
        this.update(currentPiece);
    }

    addEventListeners(pos: string): void {
        const { board } = this;
        if (this.isMobile) {
            this.element.addEventListener('click', () => {
                if (!board.selected) {
                    board.highlight(pos);
                    board.selected = pos;
                } else if (board.selected === pos) {
                    board.clearHighlighting();
                    board.selected = '';
                } else {
                    board.clearHighlighting();
                    const move = {
                        from: board.selected,
                        to: pos,
                    };
                    board.selected = '';
                    board.move(move);
                }
            }, false);
        } else {
            this.element.addEventListener('dragstart', (event) => {
                board.highlight(pos);
                event.dataTransfer?.setData('text/plain', pos);
            }, false);
            this.element.addEventListener('dragover', (event) => {
                event.preventDefault();
            }, false);
            this.element.addEventListener('dragenter', (event) => {
                // highlight potential drop target when the draggable element enters it
                event.preventDefault();
                if (event.target) {
                    const square = event.target as HTMLElement;
                    square.classList.add('overlay', 'red');
                }
            }, false);
            this.element.addEventListener('dragleave', (event) => {
                // clear highlight from drop target when the draggable element leaves it
                event.preventDefault();
                if (event.target) {
                    const square = event.target as HTMLElement;
                    square.classList.remove('overlay', 'red');
                }
            }, false);
            this.element.addEventListener('drop', (event) => {
                event.preventDefault();
                if (event.target && event.dataTransfer) {
                    const square = event.target as HTMLElement;
                    square.classList.remove('overlay', 'red');
                    const from = event.dataTransfer.getData('text/plain');
                    const to = pos;
                    const move = {
                        from,
                        to,
                    };
                    this.board.move(move);
                }
            }, false);
            this.element.addEventListener('dragend', () => this.board.clearHighlighting());
        }
    }

    clearHighlighting(): void {
        this.element.classList.remove('overlay', 'purple');
    }

    highlight(): void {
        this.element.classList.add('overlay', 'purple');
    }

    update(updatePiece: piece): void {
        if (updatePiece) {
            this.piece.src = `./assets/${pieces.get(updatePiece.type + updatePiece.color)}`;
            this.piece.style.display = 'block';
        } else {
            this.piece.style.display = 'none';
        }
    }
}

export default Square;
