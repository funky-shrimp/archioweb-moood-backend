import Boards from "../../boards/boards/boards.model.js";
import UsersFollow from "../usersFollow/usersFollows.model.js";

/**
 * retrieve all board IDs created by a specific user
 * @param {*} userId 
 * @returns 
 */
async function getUserBoardsId(userId) {
    //creator is types.objectId referencing the user
    let boards = await Boards.find({ creator: userId }).select('_id');

    boards = boards.map(board => board._id);

    return boards
}

/**
 * retrieve the count of followers for a specific user
 * @param {*} userId 
 * @returns 
 */
async function getUserFollowersCount(userId) {
    return await UsersFollow.countDocuments({ followedId: userId });
}



export { getUserBoardsId, getUserFollowersCount };