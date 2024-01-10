const express = require("express");
const cors = require("cors");
const axios = require("axios");

const posts = {};

const app = express();
app.use(express.json());
app.use(cors());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  console.log("event received", req.body);

  handleEvent(type, data);
  res.send({});
});

app.listen(4002, () => {
  debugger;
  axios
    .get("http://event-bus-serv-cluster-ip:4005/events")
    .then((response) => {
      const events = response.data || [];
      console.log(events);
      events.forEach((event) => {
        handleEvent(event.type, event.data);
      });
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
    });
  console.log("Listening on 4002 query service");
});

function handleEvent(type, data) {
  if (type === "PostCreated") {
    posts[data.id] = { id: data.id, title: data.title, comments: [] };
  }

  if (type === "CommentCreated") {
    posts[data.postId].comments.push({
      id: data.id,
      content: data.content,
      status: data.status,
    });
  }

  if (type === "CommentUpdated") {
    posts[data.postId].comments.find((comment) => {
      if (comment.id === data.id) {
        comment.status = data.status;
        comment.content = data.content;
      }
    });
  }
}
