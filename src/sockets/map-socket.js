import jwt from 'jsonwebtoken'

module.exports = class MapSocket {

    constructor(sockIO, socket) {
        this.io = sockIO;
        this.socket = socket;
    }

    init() {
        this.io.emit('chat message', `connection established ${this.socket.id}`);
        this.socket.on('chat message', (msg) => {
            this.io.emit('chat message', msg);
        });
    }


}