class Moves {
    constructor(chess) {
        this.chess = chess;
    }

    update(){
        let moves = this.chess.moves();
    }
}

export default Moves;