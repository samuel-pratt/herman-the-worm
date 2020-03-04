// Imports
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const easystarjs = require("easystarjs");

// Express app stuff
const app = express();
app.set("port", process.env.PORT || 9001);
app.enable("verbose errors");
app.use(morgan("dev"));
app.use(bodyParser.json());

// Pathfinding stuff
const easystar = new easystarjs.js();
let food_path = [];
let isFoodFound = false;

const findFoodDistances = (food, snakeHead) => {
  if (food === []) return null; // No food on board

  const distances = food.map(item => {
    return {
      distance: Math.sqrt(
        (snakeHead.x - item.x) * (snakeHead.x - item.x) +
          (snakeHead.y - item.y) * (snakeHead.y - item.y)
      ),
      location: item
    };
  });

  distances.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  return distances;
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

  const food = findFoodDistances(
    request.body.board.food,
    request.body.you.body[0]
  );

  console.log(food);

  if (food === null) {
    // Curl
  }

  const snakeHead = request.body.you.body[0];

  // Create empty board array
  let board = Array(request.body.board.height)
    .fill()
    .map(() => Array(request.body.board.width).fill(0));

  // Add other snakes to the board
  request.body.board.snakes.forEach(snake =>
    snake.body.forEach(element => (board[element.y][element.x] = 1))
  );

  // Add self to board, not including head
  const self = request.body.you.body.slice(1);
  self.forEach(element => (board[element.y][element.x] = 1));

  // Find path
  easystar.enableSync();
  easystar.setGrid(board);
  easystar.setAcceptableTiles([0]);

  for (let i = 0; i < food.length; i++) {
    if (isFoodFound) {
      break;
    }
    nearest_food = food[i].location;
    easystar.findPath(
      snakeHead.x,
      snakeHead.y,
      nearest_food.x,
      nearest_food.y,
      function(path) {
        if (path === null) {
          console.log("Path was not found.");
        } else {
          food_path = path;
          isFoodFound = true;
        }
      }
    );
    easystar.calculate();
  }

  if (food_path === []) {
    // Curl
  }

  console.log(food_path);

  if (food_path[1].x > snakeHead.x) {
    move.move = "right";
  } else if (food_path[1].x < snakeHead.x) {
    move.move = "left";
  } else if (food_path[1].y > snakeHead.y) {
    move.move = "down";
  } else if (food_path[1].y < snakeHead.y) {
    move.move = "up";
  }
  console.log("MOVE: " + move.move);
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
