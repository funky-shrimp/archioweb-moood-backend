import usersFollow from "./usersFollows.model.js";

async function createFollow(usersFollowData) {
  const newFollow = new usersFollow(usersFollowData);
  return newFollow.save();
}

async function deleteFollow(followerId, followedId) {
  return usersFollow.findOneAndDelete({ followerId, followedId });
}

export { createFollow, deleteFollow };
