let socket = io();

socket.on('connect/disconnect', (welcome) => {
  console.log(welcome);
});
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

const geolocation = document
  .querySelector('#send-location')
  .addEventListener('click', (event) => {
    if (!navigator.geolocation) {
      return alert('Geolocation Not Supported By Your Browser');
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const locationData = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };

      socket.emit('sendLocation', locationData);
    });
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
