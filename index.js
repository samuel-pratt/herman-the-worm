const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");

const app = express();

app.set("port", process.env.PORT || 9001);

app.enable("verbose errors");

app.use(morgan("dev"));
app.use(bodyParser.json());

/*
 * TODO:
 * Create log file that stores:
 *    gameId, turn, number of other snakes, health, length of snake on /end
 * Create game loop that calls the following functions depending on health and turn
 * curl():
 *    function that when called returns next move to curl up in a circle
 * findNearestFood():
 *    function that calculates distances to food and returns coords of closest one
 * goTo():
 *    function that when called returns a move
 *    accepts a pair of coordinates as parameters
 *    returns the next move along an A* path towards coords
 */

const curl = data => {
  const length = data.you.body.length;
};

const findNearestFood = data => {
  const food = data.board.food;
};

const goTo = data => {
  const self = data.you;
};

// API info at: https://docs.battlesnake.com/snake-api

app.post("/start", (request, response) => {
  // Respond with snake data: { color: 'Red', headType: "regular", tailType: "regular"}
  const data = {
    color: "#0F0F0F",
    headType: "safe",
    tailType: "round-bum"
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
  // Perform cleanup and logging, response ignored
  return response;
});

app.post("/ping", (request, response) => {
  // Wakes up app if asleep, repsonse ignored
  return response;
});

app.listen(app.get("port"), () => {
  console.log("Server listening on port %s", app.get("port"));
});
