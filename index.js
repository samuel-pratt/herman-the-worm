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
 * Create game loop that calls the following functions depending on health
 * curl():
 *    function that when called returns next move to curl up in a circle
 * goTo():
 *    function that when called returns a move
 *    accepts a pair of coordinates as parameters
 *    returns the next move along an A* path towards coords
 */

const findNearestFood = data => {
  const snake_head = data.you.body[0];
  const food = data.board.food;

  const distances = food.map(item => {
    return Math.sqrt(
      (snake_head[0] - item[0]) * (snake_head[0] - item[0]) +
        (snake_head[1] - item[1]) * (snake_head[1] - item[1])
    );
  });

  const shortestDistance = Math.min(...distances);
  const index = distance.indexOf(shortestDistance);

  return food[index];
};

const goTo = (start, end) => {
  return [0, 0];
};

const curl = data => {
  const length = data.you.body.length;

  return { move: "up" };
};

// API info at: https://docs.battlesnake.com/snake-api

app.post("/start", (request, response) => {
  // Respond with snake customization data
  const data = {
    color: "#0F0F0F",
    headType: "safe",
    tailType: "round-bum"
  };

  return response.json(data);
});

app.post("/move", (request, response) => {
  // Respond with move data
  let move = {
    move: "left"
  };

  if (request.you.body.length < 8) {
    const nearest_food = findNearestFood(request);
    const path = goTo(request.body[0], nearest_food);
    // This isn't quite right, needs to figure out a direction
    move = path[0];
  } else if (request.you.health >= 50) {
    return response.json(curl(request));
  } else if (request.you.health < 50) {
    const nearest_food = findNearestFood(request);
    const path = goTo(request.body[0], nearest_food);
    // This isn't quite right, needs to figure out a direction
    move = path[0];
  }

  return response.json(move);
});

app.post("/end", (request, response) => {
  // Perform cleanup and logging, response ignored
  return response;
});

app.post("/ping", (request, response) => {
  // Wakes up app if asleep, response ignored
  return response;
});

app.listen(app.get("port"), () => {
  console.log("Server listening on port %s", app.get("port"));
});
