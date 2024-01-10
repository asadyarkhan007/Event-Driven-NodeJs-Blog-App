const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

var events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  console.log(event);
  events.push(event);
  axios.post("http://posts-serv-cluster-ip:4000/events", event);
  axios.post("http://comment-serv-cluster-ip:4001/events", event);
  axios.post("http://query-serv-cluster-ip:4002/events", event);
  axios.post("http://moderation-serv-cluster-ip:4003/events", event);
  res.status(200).json();
});

app.get("/events", (req, res) => {
  console.log("recvied call", events);
  res.send(events);
});

app.listen(4005, () => {
  console.log("New Listening on 4005 event service");
});
