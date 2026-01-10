import Users from "../users/users.model.js";
import Comment from "./comment.model.js";

// Accepts a single comment or an array of comments
async function addAuthorToComment(commentOrArray) {
  /*
      Mongoose documents only serialize properties defined in the schema.
When you add a new property (like authorName) directly to a Mongoose document, it won’t appear in the JSON output unless you first convert the document to a plain object using .toObject() or .lean().

Technical reason:
Mongoose documents have internal mechanisms for tracking schema fields and virtuals. Extra properties added after fetching are not tracked for serialization.
.toObject() creates a plain JavaScript object, so any new properties you add will be included when sending the response.
      */

  if (Array.isArray(commentOrArray)) {
    return Promise.all(
      commentOrArray.map(async (comment) => {
        const user = await Users.findById(comment.userId);
        const commentObj = comment.toObject();
        commentObj.authorName = user ? user.username : "Unknown";
        return commentObj;
      })
    );
  } else {
    const user = await Users.findById(commentOrArray.userId);
    const commentObj = commentOrArray.toObject();
    commentObj.authorName = user ? user.username : "Unknown";
    return commentObj;
  }
}

async function getCommentBoardId(commentId) {
  const comment = await Comment.findById(commentId).select("boardId");
  return comment ? comment.boardId : null;
}

export { addAuthorToComment, getCommentBoardId };