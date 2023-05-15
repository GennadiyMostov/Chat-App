const users = [];

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  //Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate Data

  if (!username || !room) {
    return {
      error: 'Username And Room Are Required',
    };
  }

  //Check for existing user

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  //Validate Username

  if (existingUser) {
    return {
      error: 'Username is taken',
    };
  }

  //Store User

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

addUser({
  id: 22,
  username: 'Skeeter',
  room: 'Dookie',
});

const getUser = (id) => {
  return users.find((user) => {
    return user.id === id;
  });
};

const getUsersInRoom = (roomName) => {
  return users.filter((user) => {
    return user.room === roomName.trim().toLowerCase();
  });
};

// console.log(getUser(22));
// console.log(getUsersInRoom('1341'));

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
