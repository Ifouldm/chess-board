type player = {
    id?: string;
    name: string;
    score: number;
    colour: 'b' | 'w';
};
type gameModel = {
    _id: string;
    player1: player;
    player2: player;
    pgn: string;
    messages: message[];
};
type message = {
    playerName: string;
    playerColour: 'b' | 'w';
    message: string;
    dateTime: Date;
};

type piece = { type: string; color: string } | null;

export { player, gameModel, message, piece };
