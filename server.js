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

  socket.on('join', (user) => {
    console.log('New user ' + socket.id);
    users.push({ name: user, id: socket.id });
    socket.broadcast.emit('message', {
      author: 'Chat bot',
      content: `${user} has joined the conversation!`
    });
  });

  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    const userFilter = users.filter(user => (user.id !== socket.id));
    socket.broadcast.emit('message', {
      author: 'Chat bot',
      content: `${userFilter.name} has left the conversation.`
    });
    //console.log('users' + user);
    //console.log('Oh, socket ' + socket.id + ' has left') );
    console.log('I\'ve added a listener on message event \n');
  });
});