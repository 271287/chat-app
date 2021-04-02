const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.render('index');
});

const app = express();
const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
});

socket.on('join', (user) => {
  console.log('New user ' + socket.id);
  users.push({ name: user, id: socket.id });
  socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: `${user} has joined the conversation!`
    });
});

socket.on('disconnect', () => { 
    const userIndex = users.find(user => user.id == socket.id)
    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: `${userIndex.name} has left the conversation... :(`
    }); 

  });