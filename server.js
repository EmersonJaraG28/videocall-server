// server.js
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

    // Obtener los demás usuarios en la sala (menos el actual)
    const clientsInRoom = [...(io.sockets.adapter.rooms.get(room) || [])]
        .filter(id => id !== socket.id)
        .map(id => {
            const s = io.sockets.sockets.get(id);
            return { userId: s.userId, socketId: id };
        });

    // Enviar al nuevo usuario la lista de usuarios actuales
    socket.emit('all-users', clientsInRoom);

    // Notificar a otros usuarios que alguien nuevo se conectó
    socket.to(room).emit('user-joined', { userId, socketId: socket.id });

    // Reenviar señales a un usuario específico
    socket.on('signal', ({ targetId, signal }) => {
        console.log(`Signal from ${socket.userId} to ${targetId}`);
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
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
