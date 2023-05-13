let socket = io();

socket.on('sendMessage', (message) => {
  console.log(message);
});

const userMessage = document.querySelector('#send');
let messageValue = document.querySelector('#message');

userMessage.addEventListener('click', (event) => {
  event.preventDefault();

  if (messageValue.value) {
    socket.emit('sendMessage', messageValue.value);
    messageValue.value = '';
  }
});

// Saved For Reference
// socket.on('countUpdated', (count) => {
//   console.log('Count has been updated', count);
// });
// const button = document
//   .querySelector('#increment')
//   .addEventListener('click', (event) => {
//     socket.emit('increment');
//   });
