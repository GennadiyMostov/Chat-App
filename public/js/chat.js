let socket = io();

//Elements
const $messageForm = document.querySelector('#form');
const $messageFormButton = document.querySelector('#send');
let $messageFormValue = document.querySelector('#message');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //Height of visible window
  const visibleHeight = $messages.offsetHeight;
  //Total Height after scroll
  const containerHeight = $messages.scrollHeight;
  //Distance Scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

//GeoLocation Elements
const $geolocationButton = document.querySelector('#send-location');

//io

socket.on('sendMessage', (message) => {
  // console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('locationMessage', (location) => {
  // console.log(location);
  const locationData = Mustache.render(locationTemplate, {
    username: location.username,
    location: location.url,
    createdAt: moment(location.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', locationData);
  autoscroll();
});

socket.on('roomData', ({ room, users }) => {
  const roomData = Mustache.render(sidebarTemplate, {
    room,
    users,
  });

  document.querySelector('#sidebar').innerHTML = roomData;
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

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
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
