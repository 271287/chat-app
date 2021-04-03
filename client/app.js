const loginForm = document.querySelector('welcome-form');
const messagesSection = document.querySelector('messages-section');
const messagesList = document.querySelector('messages-list');
const addMessageForm = document.querySelector('add-messages-form');
const userNameInput = document.querySelector('username');
const messageContentInput = document.querySelector('message-content');

let userName;

const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));
loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);

function login(e) {
  e.preventDefault();
  if(userNameInput.value === '') {
    alert('Please enter your name.');
  } else {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('join', userName);
  }
};

function sendMessage(e) {
  e.preventDefault();
  if(messageContentInput.value === '') {
    alert('Please type your message!');
  } else {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value });
    messageContentInput.value = '';
  }
};

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}