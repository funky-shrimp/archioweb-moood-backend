import * as usersFollow from "./usersFollow.service.js";

async function createFollow(req, res, next) {
  try {
    const followerId = req.user.id;
    const followedId = req.params.id;

    res.json(await usersFollow.createFollow({ followerId, followedId }));
  } catch (err) {
    // Check for MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ message: "You already follow this user." });
    }
    next(err);
  }
}


async function deleteFollow(req, res, next) {
  try {
    const followerId = req.user.id;
    const followedId = req.params.id;

    res.json(await usersFollow.deleteFollow(followerId, followedId));
  } catch (err) {
    next(err);
  }
}

export { createFollow, deleteFollow };