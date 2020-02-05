const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");

const app = express();

app.set("port", process.env.PORT || 9001);

app.enable("verbose errors");

app.use(logger("dev"));
app.use(bodyParser.json());

// API info at: https://docs.battlesnake.com/snake-api

app.post("/start", (request, response) => {
  // Respond with snake data: { color: 'Red', headType: "regular", tailType: "pixel"}
  const data = {
    color: "#0F0F0F"
  };

  return response.json(data);
});

app.post("/move", (request, response) => {
  // Respond with move data: { move: "left" }
  const move = {
    move: "left"
  };

  return response.json(move);
});

app.post("/end", (request, response) => {
  // Perform cleanup, response ignored
});

app.post("/ping", (request, response) => {
  // Wakes up app if asleep, repsonse ignored
});
