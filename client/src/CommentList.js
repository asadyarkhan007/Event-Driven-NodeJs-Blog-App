import React from "react";

const CommentList = ({ comments }) => {
  const renderedPosts = comments.map((comment) => {
    let content;
    if (comment.status === "pending")
      content = "This comment is bein moderated";
    if (comment.status === "approved") content = comment.content;
    if (comment.status === "rejected") content = "This comment is rejected";

    return <li key={comment.id}>{content}</li>;
  });
  return <ul>{renderedPosts}</ul>;
};

export default CommentList;
