import Users from "./users.model.js";

async function getAllUsers() {
  console.log("Service: Fetching all users");
  return Users.find({});
}

async function getUserById(userId) {
  return Users.findById(userId);
}

export { getAllUsers, getUserById };
