const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'/Chatroom.html'));
});

server.listen(port,'0.0.0.0', () => {
  console.log(`listening on *:${port}`);
});



let chatHistory = []; // 1. Create a place to store messages

io.on('connection', (socket) => {
  console.log('a user connected');

  // 2. Send the history to the NEW user only
  socket.emit('load history', chatHistory);

  socket.on('chat message', (msg) => {
    chatHistory.push(msg); // 3. Save the new message to history
    if (chatHistory.length > 5) {
      chatHistory.shift(); 
    }
    io.emit('chat message', msg); 
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});