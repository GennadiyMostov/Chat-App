//setup
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const Filter = require('bad-words');

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./utils/users');

const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/messages');

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

//express
app.use(express.static(publicDirectoryPath));
app.get('', (req, res) => {
  res.sendFile(path.join(publicDirectoryPath));
});

//io
io.on('connection', (socket) => {
  // socket.emit('connect/disconnect', generateMessage('Welcome!'));

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.broadcast
      .to(user.room)
      .emit(
        'sendMessage',
        generateMessage('System', `${user.username} has joined the chat`)
      );
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'sendMessage',
        generateMessage('System', `${user.username} has left the chat`)
      );
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on('sendMessage', (msg, callback) => {
    // const filter = new Filter();

    // if (filter.isProfane(msg)) {
    //   return callback('System: Dont Be Fuggin Cussing In The Chat');
    // }

    const user = getUser(socket.id);

    io.to(user.room).emit('sendMessage', generateMessage(user.username, msg));
    callback('Delivered');

    callback();
  });

  socket.on('sendLocation', (locationData, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      'locationMessage',
      generateLocationMessage(user.username, locationData)
    );
    callback();
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
