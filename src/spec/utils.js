import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../features/socials/users/users.model.js";
import Boards from "../features/boards/boards/boards.model.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { jwt_secret } from "../../config.js";

//C'est cool, mais il faudrait plutôt nettoyer toute la DB entre chaque test
// -> plus facile à maintenir
export const cleanUpCollection = async function (CollectionToClean) {
  await Promise.all([CollectionToClean.deleteMany()]);
};

//Purification sainte de la DB
export const cleanUpDatabase = async function () {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
};
//default test user
export const createTestUser = async function ({
  username = "funkytest",
  email = "funkytest@email.com",
  password = "Password123!",
}={}) {
  try {
    //console.log("Creating test user:", { username, email });

    let passwordHash = await bcrypt.hash(password, 10);

    const testUser = new User({
      username: username,
      email: email,
      password: passwordHash,
    });
    await testUser.save();
    return testUser;
  } catch (error) {
    console.error("Error creating test user:", error);
  }
};

const signJwt = promisify(jwt.sign);

// ...
export function generateValidJwt(user) {
  // Generate a valid JWT which expires in 7 days.
  const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
  const claims = { sub: user._id.toString(), exp: exp };
  return signJwt(claims, jwt_secret);
}

export async function createTestBoard(userId){

  if(userId === undefined || !mongoose.Types.ObjectId.isValid(userId)){
    throw new Error("Invalid userId provided to createTestBoard");
  }

  const board = new Boards({
    title: "Test Board",
    description: "This is a test board",
    userId: userId,
    imageUrl: "http://example.com/image.jpg",
  });
  return board.save();
}

export async function createFewBoards() {
  try {
    const bob = await createTestUser({
      username: "bob",
      email: "bob@email.com",
      password: "Password123!",
    });

    const alice = await createTestUser({
      username: "alice",
      email: "alice@email.com",
      password: "Password123!",
    });

    const bobBoard = new Boards({
      title: "Bob's Board",
      description: "this is bob's board",
      userId: bob._id,
      imageUrl: "http://example.com/image.jpg",
    });

    const aliceBoard = new Boards({
      title: "Alice's board",
      description: "this is alice board",
      userId: alice._id,
      imageUrl: "http://example.com/image.jpg",
    });

    await bobBoard.save();
    await aliceBoard.save();
    return [bobBoard, aliceBoard];
  } catch (err) {
    console.error("Error creating test boards:", err);
  }
}
