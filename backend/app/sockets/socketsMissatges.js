const { Server } = require("socket.io");

function ioMissatges(server) {
    const ioMissatges = new Server(server);


    //Rebre missatges
    ioMissatges.on('connection', (socket) => {
        console.log('a user connected3 ' + socket.id);
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
        });
    });
    //Divulgar missatges
    // ioMissatges.on('connection', (socket) => {
    //     socket.on('chat message', (msg) => {
    //       io.emit('chat message', msg);
    //     });
    // });

    ioMissatges.on('connection', (socket) => {
        console.log('a user connected3 ' + socket.id);
        socket.on('chat message', (msg) => {
            socket.broadcast.emit('chat message', msg);
        });
    });
}

module.exports = ioMissatges;