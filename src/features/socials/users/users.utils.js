import Boards from "../../boards/boards/boards.model.js";

async function getUserBoardsId(userId) {
    //creator is types.objectId referencing the user
    let boards = await Boards.find({ creator: userId }).select('_id');

    boards = boards.map(board => board._id);

    return boards
}

export { getUserBoardsId };