const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    await axios
      .post("http://event-bus-serv-cluster-ip:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          content: data.content,
          status: status,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }
  res.send({});
});

app.listen(4003, () => {
  console.log("moderation listen 4003");
});
