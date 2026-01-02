import Users from "./users.model.js";
import { getUserBoardsId, getUserFollowersCount } from "./users.utils.js";

async function getAllUsers() {
  console.log("Service: Fetching all users");
  return Users.find({});
}

async function getUserById(userId) {
  const user = await Users.findById(userId);

  // Fetch boards id created by the user
  const boardsId = await getUserBoardsId(userId);

  const userFollowersCount = await getUserFollowersCount(userId);

  return {
    ...user.toObject(),
    followersCount: userFollowersCount,
    boards: boardsId,
  };
}


export { getAllUsers, getUserById };
