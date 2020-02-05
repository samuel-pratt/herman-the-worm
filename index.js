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

  if (food === []) return null; // No food on board

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

const generateGraph = data => {
  return [0];
};

const goTo = (start, end, graph) => {
  return [0, 0];
};

const curl = data => {
  const length = data.you.body.length;

  if (length < 4) {
    // 2x2 square, perimeter 4
  } else if (length < 6) {
    // 2x3 square, perimeter 6
  } else if (length < 8) {
    // 3x3 square, perimeter 8
  } else if (length < 10) {
    // 3x4 square, perimeter 10
  } else if (length < 12) {
    // 4x4 square, perimeter 12
  }
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

  const nearest_food = findNearestFood(request);

  if (nearest_food === null) {
    return response.json(curl(request));
  }

  const snake_head = request.you.body[0];

  if (request.you.health < 50) {
    return response.json(
      goTo(snake_head, nearest_food, generateGraph(request))
    );
  } else {
    return response.json(curl(request));
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
