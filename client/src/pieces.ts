const pieces = new Map<string, string>();
pieces.set('pb', '/default/Chess_pdt45.svg');
pieces.set('kb', '/default/Chess_kdt45.svg');
pieces.set('qb', '/default/Chess_qdt45.svg');
pieces.set('bb', '/default/Chess_bdt45.svg');
pieces.set('nb', '/default/Chess_ndt45.svg');
pieces.set('rb', '/default/Chess_rdt45.svg');
pieces.set('pw', '/default/Chess_plt45.svg');
pieces.set('kw', '/default/Chess_klt45.svg');
pieces.set('qw', '/default/Chess_qlt45.svg');
pieces.set('bw', '/default/Chess_blt45.svg');
pieces.set('nw', '/default/Chess_nlt45.svg');
pieces.set('rw', '/default/Chess_rlt45.svg');

if (false) {
    pieces.set('pb', 'mario/slice_3_0.gif');
    pieces.set('kb', 'mario/slice_1_7.gif');
    pieces.set('qb', 'mario/slice_5_1.gif');
    pieces.set('bb', 'mario/slice_5_2.gif');
    pieces.set('nb', 'mario/slice_2_9.gif');
    pieces.set('rb', 'mario/slice_5_5.gif');
    pieces.set('pw', 'mario/slice_0_7.gif');
    pieces.set('kw', 'mario/slice_0_0.gif');
    pieces.set('qw', 'mario/slice_0_2.gif');
    pieces.set('bw', 'mario/slice_0_4.gif');
    pieces.set('nw', 'mario/slice_0_5.gif');
    pieces.set('rw', 'mario/slice_0_9.gif');
}

const pieceNames = new Map<string, string>();
pieceNames.set('pb', 'Black Pawn');
pieceNames.set('kb', 'Black King');
pieceNames.set('qb', 'Black queen');
pieceNames.set('bb', 'Black Bishop');
pieceNames.set('nb', 'Black Knight');
pieceNames.set('rb', 'Black Rook');
pieceNames.set('pw', 'White Pawn');
pieceNames.set('kw', 'White King');
pieceNames.set('qw', 'White queen');
pieceNames.set('bw', 'White Bishop');
pieceNames.set('nw', 'White Knight');
pieceNames.set('rw', 'White Rook');

export { pieces, pieceNames };
