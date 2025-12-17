import Users from "./users.model.js";
import { getUserBoardsId } from "./users.utils.js";

async function getAllUsers() {
  console.log("Service: Fetching all users");
  return Users.find({});
}

async function getUserById(userId) {
  const user = await Users.findById(userId);

  // Fetch boards id created by the user
  const boardsId = await getUserBoardsId(userId);

  return {
    ...user.toObject(),
    boards: boardsId,
  };
}

export { getAllUsers, getUserById };
