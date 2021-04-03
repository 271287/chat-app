const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('join', (userName) => {
    console.log('New user ' + socket.id);
    users.push({ author: userName, id: socket.id });
    socket.broadcast.emit('message', { author: 'Chat bot', content: `${userName} has joined the converstaion!`});
  });
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => {
    const user = users.filter(user => (user.id !== socket.id));
    socket.broadcast.emit('message', { author: 'Chat bot', content: `${user.userName} has left the conversation.`});
    //console.log('users' + user);
    console.log('Oh, socket ' + socket.id + ' has left') });
    console.log('I\'ve added a listener on message event \n');
});