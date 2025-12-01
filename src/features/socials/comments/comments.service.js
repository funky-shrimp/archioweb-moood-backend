import Comments from "../../socials/comments/comment.model.js";

async function createComment(commentData) {
  const comment = new Comments(commentData);
  return comment.save();
}

async function deleteComment(postId) {
    return Comments.findByIdAndDelete(postId);
}

export {createComment, deleteComment};