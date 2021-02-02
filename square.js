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
    constructor(piece, pos, sqColor) {
        this.element = document.createElement('div');
        this.pos = pos;
        this.isDark = sqColor === 'dark';
        this.element.classList.add('square', sqColor);
        this.pieceIcon = document.createElement('img');
        this.pieceIcon.style.display = 'none';
        if(piece) {
            this.pieceIcon.src = './assets/'+pieces[piece.type+piece.color];
            this.pieceIcon.classList.add('piece');
            this.element.appendChild(this.pieceIcon);
            this.pieceIcon.style.display = 'block';
        }
        //this.element.textContent = ref;
    }

    update(piece) {
        if (piece) {
            this.pieceIcon.src = './assets/'+pieces[piece.type+piece.color];
            this.pieceIcon.style.display = 'block';
        } else {
            this.pieceIcon.style.display = 'none';
        }

    }
}

export default Square;