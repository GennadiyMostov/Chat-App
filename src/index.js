const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.sendFile(path.join(publicDirectoryPath));
});

io.on('connection', (socket) => {
  socket.emit('connect/disconnect', 'Welcome To The Chat');

  socket.on('disconnect', () => {
    io.emit('connect/disconnect', 'A User Has Left The Chat');
  });

  socket.broadcast.emit('connect/disconnect', 'A New User has Joined');

  socket.on('sendMessage', (msg) => {
    io.emit('sendMessage', msg);
  });

  socket.on('sendLocation', (locationData) => {
    io.emit(
      'sendMessage',
      `https://google.com/maps?q=${locationData.lat},${locationData.lon}`
    );
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
