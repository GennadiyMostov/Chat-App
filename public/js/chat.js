let socket = io();

//Elements
const $messageForm = document.querySelector('#form');
const $messageFormButton = document.querySelector('#send');
let $messageFormValue = document.querySelector('#message');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//GeoLocation Elements
const $geolocationButton = document.querySelector('#send-location');

//io
socket.on('connect/disconnect', (welcome) => {
  const welcomeMessage = Mustache.render(messageTemplate, {
    message: welcome.text,
  });
  $messages.insertAdjacentHTML('beforeend', welcomeMessage);
});

socket.on('sendMessage', (message) => {
  // console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (location) => {
  // console.log(location);
  const locationData = Mustache.render(locationTemplate, {
    location: location.url,
    createdAt: moment(location.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', locationData);
});

//eventHandler and listeners
$messageFormButton.addEventListener('click', (event) => {
  event.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');

  if ($messageFormValue.value) {
    socket.emit('sendMessage', $messageFormValue.value, () => {
      $messageFormValue.setAttribute('placeholder', 'Enter A Message');
      $messageFormButton.removeAttribute('disabled');
    });
    $messageFormValue.value = '';
    $messageFormValue.focus();
  } else {
    $messageFormValue.setAttribute('placeholder', 'You Must Enter A Message');
    $messageFormValue.focus();
    $messageFormButton.removeAttribute('disabled');
  }
});

$geolocationButton.addEventListener('click', (event) => {
  if (!navigator.geolocation) {
    return alert('Geolocation Not Supported By Your Browser');
  }

  $geolocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    const locationData = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };

    socket.emit('sendLocation', locationData, () => {
      console.log('Location Shared!');
      $geolocationButton.removeAttribute('disabled');
    });
  });
});

socket.emit('join', { username, room });

// Saved For Reference
// socket.on('countUpdated', (count) => {
//   console.log('Count has been updated', count);
// });
// const button = document
//   .querySelector('#increment')
//   .addEventListener('click', (event) => {
//     socket.emit('increment');
//   });
