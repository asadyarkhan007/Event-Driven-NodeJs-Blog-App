const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPosts = {};

app.get("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  res.json(commentsByPosts[postId] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  console.log(content);
  const commentId = randomBytes(4).toString("hex");
  const comments = commentsByPosts[postId] || [];
  comments.push({ id: commentId, content, status: "pending" });
  commentsByPosts[postId] = comments;
  try {
    await axios.post("http://event-bus-serv-cluster-ip:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId,
        status: "pending",
      },
    });
  } catch (err) {
    console.log(err);
  }

  res.json(comments);
});

// Event Bus handle
app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);
  if (req.body.type === "CommentModerated") {
    const { status, id, postId } = req.body.data;
    const comments = commentsByPosts[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    await axios.post("http://event-bus-serv-cluster-ip:4005/events", {
      type: "CommentUpdated",
      data: {
        id: comment.id,
        status: comment.status,
        postId: postId,
        content: comment.content,
      },
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("Started 4001 comment service");
});
