const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', socket => {
    const { room, userId } = socket.handshake.query;
    socket.userId = userId;
    socket.room = room;
    socket.join(room);

    console.log(`User ${userId} connected to room ${room}`);

    const clientsInRoom = [...(io.sockets.adapter.rooms.get(room) || [])]
        .filter(id => id !== socket.id)
        .map(id => {
            const s = io.sockets.sockets.get(id);
            return { userId: s.userId, socketId: id };
        });


    socket.emit('all-users', clientsInRoom);

    socket.to(room).emit('user-joined', { userId, socketId: socket.id });

    socket.on('signal', ({ targetId, signal }) => {
        io.to(targetId).emit('signal', {
            fromId: socket.id,
            fromUserId: socket.userId,
            signal
        });
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected from room ${socket.room}`);
        socket.to(room).emit('user-left', {
            userId: socket.userId
        });
    });

    socket.on('media-toggle', ({ userId, type, enabled }) => {
        socket.to(socket.room).emit('user-media-toggled', { userId, type, enabled });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
