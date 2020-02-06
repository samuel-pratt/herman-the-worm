const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const easystarjs = require("easystarjs");
const easystar = new easystarjs.js();

const app = express();

app.set("port", process.env.PORT || 9001);

app.enable("verbose errors");

app.use(morgan("dev"));
app.use(bodyParser.json());
let food_path = [];
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

const findNearestFood = data => {
  const snake_head = data.you.body[0];
  const food = data.board.food;

  if (food === {}) return null; // No food on board

  const distances = food.map(item => {
    return Math.sqrt(
      (snake_head.x - item.x) * (snake_head.x - item.x) +
        (snake_head.y - item.y) * (snake_head.y - item.y)
    );
  });

  const shortestDistance = Math.min(...distances);
  const index = distances.indexOf(shortestDistance);

  return food[index];
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

  const nearest_food = findNearestFood(request.body);

  if (nearest_food === null) {
    return response.json(move);
  }

  const snake_head = request.body.you.body[0];

  // Create empty board array
  let board = Array(request.body.board.height)
    .fill()
    .map(() => Array(request.body.board.width).fill(0));

  // Add other snakes to the board
  request.body.board.snakes.forEach(snake =>
    snake.body.forEach(element => (board[element.y][element.x] = 1))
  );

  // Add self to board, not including head
  const self = request.body.you.body;
  self.forEach(element => (board[element.y][element.x] = 1));

  easystar.setGrid(board);
  easystar.setAcceptableTiles([0]);

  easystar.findPath(
    snake_head.x,
    snake_head.y,
    nearest_food.x,
    nearest_food.y,
    function(path) {
      if (path === null) {
        console.log("Path was not found.");
      } else {
        food_path = path;
      }
    }
  );

  easystar.calculate();

  console.log(food_path);

  if (food_path[0].x < food_path[1].x) {
    move.move = "left";
  } else if (food_path[0].x > food_path[1].x) {
    move.move = "right";
  } else if (food_path[0].y < food_path[1].y) {
    move.move = "down";
  } else if (food_path[0].y > food_path[1].y) {
    move.move = "up";
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
