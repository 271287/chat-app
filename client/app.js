const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName;

const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('join', (user) => addMessage(user));

function login(e) {
  e.preventDefault();
  let user = userNameInput.value;
  if (!user.length === '') {
    alert("Please write your name!");
  } else {
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('join', userName);
  }
};
loginForm.addEventListener('submit', login);

function sendMessage(e) {
  e.preventDefault();
  if (messageContentInput.value === '') {
    alert('Please type your message!');
  } else {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value });
    messageContentInput.value = '';
  }
};
addMessageForm.addEventListener('submit', sendMessage);

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}