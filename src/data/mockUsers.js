const mockUsers = [
  { username: "alice", password: "alice123" },
  { username: "bob", password: "bob123" },
  { username: "demo", password: "demo123" },
];

function findUser(username, password) {
  return mockUsers.find(
    (user) => user.username === username && user.password === password,
  );
}

module.exports = {
  mockUsers,
  findUser,
};
