import Comments from "../../socials/comments/comment.model.js";
import { addAuthorToComment } from "./comments.utils.js";

async function createComment(commentData) {
  const comment = await new Comments(commentData).save();
  return await addAuthorToComment(comment);
}

async function deleteComment(postId) {
  return Comments.findByIdAndDelete(postId);
}

export { createComment, deleteComment };
