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
 * What to do when there's no food
 * What to do when theres no path
 * Check one move to remove dangerous options
 */
app.post("/move", (request, response) => {
  // Respond with move data
  let move = {
    move: "left"
  };

  const nearest_food = findNearestFood(data.board.food, data.you.body[0]);

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
    [snakeHead.x - 1, snakeHead.y - 1]
  ];
  const checkDown = [
    [snakeHead.x, snakeHead.y + 2],
    [snakeHead.x - 1, snakeHead.y + 1],
    [snakeHead.x - 1, snakeHead.y + 1]
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

  const snakeHeads = request.body.board.snakes.map(snake => {
    return [snake.body[0].x, snake.body[0].y];
  });

  snakeHeads.forEach(item => {
    if (checkUp.indexOf(item) != -1) {
      board[(snakeHead.x, snakeHead.y - 1)] = 1;
      if ({ x: snakeHead.x, y: snakeHead.y - 1 } === nearest_food) {
        nearest_food = findNearestFood(
          request.body.board.food(
            splice(
              request.body.board.food.indexOf(
                { x: snakeHead.x, y: snakeHead.y - 1 },
                1
              )
            )
          ),
          snakeHead
        );
      }
    }
    if (checkDown.indexOf(item) != -1) {
      board[(snakeHead.x, snakeHead.y + 1)] = 1;
      if ({ x: snakeHead.x, y: snakeHead.y + 1 } === nearest_food) {
        nearest_food = findNearestFood(
          request.body.board.food(
            splice(
              request.body.board.food.indexOf(
                { x: snakeHead.x, y: snakeHead.y + 1 },
                1
              )
            )
          ),
          snakeHead
        );
      }
    }
    if (checkLeft.indexOf(item) != -1) {
      board[(snakeHead.x - 1, snakeHead.y)] = 1;
      if ({ x: snakeHead.x - 1, y: snakeHead.y } === nearest_food) {
        nearest_food = findNearestFood(
          request.body.board.food(
            splice(
              request.body.board.food.indexOf(
                { x: snakeHead.x - 1, y: snakeHead.y },
                1
              )
            )
          ),
          snakeHead
        );
      }
    }
    if (checkRight.indexOf(item) != -1) {
      board[(snakeHead.x + 1, snakeHead.y)] = 1;
      if ({ x: snakeHead.x + 1, y: snakeHead.y } === nearest_food) {
        nearest_food = findNearestFood(
          request.body.board.food(
            splice(
              request.body.board.food.indexOf(
                { x: snakeHead.x + 1, y: snakeHead.y },
                1
              )
            )
          ),
          snakeHead
        );
      }
    }
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

  console.log(food_path);
  console.log(snakeHead);

  if (food_path[1].x > snakeHead.x) {
    move.move = "right";
  } else if (food_path[1].x < snakeHead.x) {
    move.move = "left";
  } else if (food_path[1].y > snakeHead.y) {
    move.move = "down";
  } else if (food_path[1].y < snakeHead.y) {
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
