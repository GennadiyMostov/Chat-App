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
  console.log('New Connection');

  socket.on('sendMessage', (msg) => {
    console.log(msg);
    io.emit('sendMessage', msg);
  });

  // socket.emit('countUpdated', count);
  // socket.on('increment', () => {
  //   count++;
  //   // socket.emit('countUpdated', count);
  //   io.emit('countUpdated', count);
  // });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
