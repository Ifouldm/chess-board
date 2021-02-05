// import Chess from './client/lib/chess.js';

const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// const chess = Chess();
const port = 3000;

app.use('/', express.static('client'));

io.on('connection', (socket) => {
    socket.on('move', (details) => {
        io.emit('update', chess);
    });
    socket.on('reset', (details) => {
        console.log(details);
        io.emit('update', chess);
    });
    socket.on('concede', (details) => {
        console.log(details);
        io.emit('update', chess);
    });
    socket.on('offerDraw', (details) => {
        console.log(details);
        io.emit('update', chess);
    });
    console.log('user connected');
});

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
