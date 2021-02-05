class Moves {
    constructor(chess) {
        this.chess = chess;
    }

    update(){
        const moves = this.chess.moves();
    }
}

export default Moves;