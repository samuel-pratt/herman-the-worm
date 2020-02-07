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

const findNearestFood = (food, snakeHead) => {
  if (food === []) return null; // No food on board

  const distances = food.map(item => {
    return Math.sqrt(
      (snakeHead.x - item.x) * (snakeHead.x - item.x) +
        (snakeHead.y - item.y) * (snakeHead.y - item.y)
    );
  });

  const shortestDistance = Math.min(...distances);
  const index = distances.indexOf(shortestDistance);

  return food[index];
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

/*
 * TODO
 * Make function to sort all food in order of distance
 * Place fake walls on dangerous spots
 * Check all paths instead of one
 * When there is no path, don't die immediately
 *
 */
app.post("/move", (request, response) => {
  // Respond with move data
  let move = {
    move: "left"
  };

  const nearest_food = findNearestFood(
    request.body.board.food,
    request.body.you.body[0]
  );

  if (nearest_food === null) {
    return response.json(move);
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

  // Add potentially dangerous paths as obstacles
  const checkUp = [
    [snakeHead.x, snakeHead.y - 2],
    [snakeHead.x - 1, snakeHead.y - 1],
    [snakeHead.x + 1, snakeHead.y - 1]
  ];
  const checkDown = [
    [snakeHead.x, snakeHead.y + 2],
    [snakeHead.x - 1, snakeHead.y + 1],
    [snakeHead.x + 1, snakeHead.y + 1]
  ];
  const checkLeft = [
    [snakeHead.x - 2, snakeHead.y],
    [snakeHead.x - 1, snakeHead.y - 1],
    [snakeHead.x - 1, snakeHead.y + 1]
  ];
  const checkRight = [
    [snakeHead.x + 2, snakeHead.y],
    [snakeHead.x + 1, snakeHead.y - 1],
    [snakeHead.x + 1, snakeHead.y + 1]
  ];

  request.body.board.snakes.forEach(snake => {
    head = [snake.body[0].x, snake.body[0].y];
    checkUp.forEach(option => {
      if (head[0] == option[0] && head[1] == option[1]) {
        board[snakeHead.x][snakeHead.y - 1] = 1;
        console.log("There is a snake head up");
        if (
          snakeHead.x == nearest_food.x &&
          snakeHead.y - 1 == nearest_food.y
        ) {
          console.log("There is food up");
        }
      }
    });
    checkDown.forEach(option => {
      if (head[0] == option[0] && head[1] == option[1]) {
        board[snakeHead.x][snakeHead.y + 1] = 1;
        console.log("There is a snake head down");
        if (
          snakeHead.x == nearest_food.x &&
          snakeHead.y + 1 == nearest_food.y
        ) {
          console.log("There is food down");
        }
      }
    });
    checkLeft.forEach(option => {
      if (head[0] == option[0] && head[1] == option[1]) {
        board[snakeHead.x - 1][snakeHead.y] = 1;
        console.log("There is a snake head left");
        if (
          snakeHead.x - 1 == nearest_food.x &&
          snakeHead.y == nearest_food.y
        ) {
          console.log("There is food left");
        }
      }
    });
    checkRight.forEach(option => {
      if (head[0] == option[0] && head[1] == option[1]) {
        board[snakeHead.x + 1][snakeHead.y] = 1;
        console.log("There is a snake head right");
        if (
          snakeHead.x + 1 == nearest_food.x &&
          snakeHead.y == nearest_food.y
        ) {
          console.log("There is food right");
        }
      }
    });
  });

  // Find path
  easystar.enableSync();
  easystar.setGrid(board);
  easystar.setAcceptableTiles([0]);

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
      }
    }
  );

  easystar.calculate();

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
