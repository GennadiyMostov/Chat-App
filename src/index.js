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
  socket.emit('connect/disconnect', generateMessage('Welcome!'));

  socket.on('disconnect', () => {
    io.emit('connect/disconnect', generateMessage('A User Has Left The Chat'));
  });

  socket.broadcast.emit(
    'connect/disconnect',
    generateMessage('A New User Has Joined The Chat')
  );

  socket.on('sendMessage', (msg, callback) => {
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback('System: Dont Be Fuggin Cussing In The Chat');
    }

    io.emit('sendMessage', generateMessage(msg));
    callback('Delivered');
  });

  socket.on('sendLocation', (locationData, callback) => {
    io.emit('locationMessage', generateLocationMessage(locationData));
    callback();
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
