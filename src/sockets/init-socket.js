import jwt from 'jsonwebtoken'
import User from '../models/user'
import config from '../config/database'
import MapSocket from './map-socket'

module.exports = class InitSocket {

    constructor(sockIO) {
        this.io = sockIO;

        //Temporary socket container
        this.userSockets = [];
    }

    init() {
        this.initSocketAuth();
        this.onSocketConnection();
    }


    initSocketAuth() {
        this.io.use((socket, next) => {
            if (socket.handshake.query && socket.handshake.query.token) {
                jwt.verify(socket.handshake.query.token, config.secret, (err, decoded) => {
                    if (err) {
                        return next(new Error('Authentication error'));
                    }
                    User.findOne({
                        username: decoded.username
                    }, (err, user) => {
                        if (err) {
                            console.log('error');
                            console.log(err);
                            throw err;
                        }
                        if (!user) {
                            return next(new Error('Authentication error'));
                        }

                        if (user.password === decoded.password) {
                            // if user is found and password is right create a token
                            socket.decoded = decoded;
                            next();
                        } else {
                            return next(new Error('Authentication error'));
                        }
                    });
                });
            }
        })
    }


    onSocketConnection() {
        this.io.on('connection', (socket) => {

            var socketId = socket.id;
            this.userSockets.push(socketId);

            //init socket emitters
            this.initEmitters(socket);

            //On socket disconnection
            this.onSocketDisconnection(socket);

        });
    }

    onSocketDisconnection(socket) {
        socket.on('disconnect', () => {

            //Temporary removing disconnected sockets
            for (let i = 0; i < this.userSockets.length; i++) {
                if (this.userSockets[i] === socket.id) {
                    this.userSockets.splice(i, 1);
                }
            }

        });
    }

    initEmitters(socket) {
        //Initialisation
        var mapSocket = new MapSocket(this.io, socket);

        //Call Socket Emitters
        mapSocket.init();
    }


}