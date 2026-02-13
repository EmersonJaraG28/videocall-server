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
    const { room, userId, userUUID } = socket.handshake.query;
    socket.userId = userId;
    socket.userUUID = userUUID;
    socket.room = room;
    socket.join(room);

    console.log(`User ${userId} (${userUUID}) connected to room ${room}`);

    const clientsInRoom = [...(io.sockets.adapter.rooms.get(room) || [])]
        .filter(id => id !== socket.id)
        .map(id => {
            const s = io.sockets.sockets.get(id);
            return { userId: s.userId, userUUID: s.userUUID, socketId: id };
        });


    socket.emit('all-users', clientsInRoom);

    socket.to(room).emit('user-joined', { userId, userUUID, socketId: socket.id });

    socket.on('signal', ({ targetId, signal }) => {
        io.to(targetId).emit('signal', {
            fromId: socket.id,
            fromUserId: socket.userId,
            fromUserUUID: socket.userUUID,
            signal
        });
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.userId} (${socket.userUUID}) disconnected from room ${socket.room}`);
        socket.to(room).emit('user-left', {
            userId: socket.userId,
            userUUID: socket.userUUID
        });
    });

    socket.on('media-toggle', ({ type, enabled }) => {
        socket.to(socket.room).emit('user-media-toggled', {
            userId: socket.userId,
            userUUID: socket.userUUID,
            type,
            enabled
        });
    });

    socket.on('initial-media-status', ({ targetId, audio, video }) => {
        socket.to(targetId).emit('user-media-toggled', {
            userId: socket.userId,
            userUUID: socket.userUUID,
            type: "audio",
            enabled: audio
        });
        socket.to(targetId).emit('user-media-toggled', {
            userId: socket.userId,
            userUUID: socket.userUUID,
            type: "video",
            enabled: video
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
