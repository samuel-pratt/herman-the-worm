const easystarjs = require('easystarjs');

const easystar = new easystarjs.js();
let food_path = [];
let isFoodFound = false;
let tail_path = [];
let isTailFound = false;

function coordEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

function moveAsCoord(move, head) {
  switch (move) {
    case 'up':
      return { x: head.x, y: head.y + 1 };
    case 'down':
      return { x: head.x, y: head.y - 1 };
    case 'left':
      return { x: head.x - 1, y: head.y };
    case 'right':
      return { x: head.x + 1, y: head.y };
  }
}

function coordAsMove(coord, head) {
  console.log(coord);
  console.log(head);
  if (coord.x == head.x && coord.y == head.y + 1) {
    return 'up';
  } else if (coord.x == head.x && coord.y == head.y - 1) {
    return 'down';
  } else if (coord.x == head.x - 1 && coord.y == head.y) {
    return 'left';
  } else if (coord.x == head.x + 1 && coord.y == head.y) {
    return 'right';
  }
}

function offBoard(state, coord) {
  if (coord.x < 0) return true;
  if (coord.y < 0) return true;
  if (coord.y >= state.board.height) return true;
  if (coord.x >= state.board.height) return true;
  return false; // If it makes it here we are ok.
}

function onSnakes(state, coord) {
  state.board.snakes.forEach((snake) => {
    snake.body.forEach((snakePart) => {
      if (coordEqual(snakePart, coord)) {
        return true;
      }
    });
  });

  state.you.body.forEach((snakePart) => {
    if (coordEqual(snakePart, coord)) {
      return true;
    }
  });

  return false;
}

function findFoodDistances(food, snakeHead) {
  if (food === []) return null; // No food on board

  const distances = food.map((item) => {
    return {
      distance: Math.sqrt(
        (snakeHead.x - item.x) * (snakeHead.x - item.x) +
          (snakeHead.y - item.y) * (snakeHead.y - item.y)
      ),
      location: item,
    };
  });

  distances.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  return distances;
}

function findPathToFood(food, snakes, self, width, height) {
  const snakeHead = self.body[0];

  // Create empty board array
  let board = Array(height)
    .fill()
    .map(() => Array(width).fill(0));

  // Add other snakes to the board
  snakes.forEach((snake) =>
    snake.body.forEach((element) => (board[element.y][element.x] = 1))
  );

  // Add self to board, not including head
  const selfBody = self.body.slice(1);
  selfBody.forEach((element) => (board[element.y][element.x] = 1));

  // Find path
  easystar.enableSync();
  easystar.setGrid(board);
  easystar.setAcceptableTiles([0]);

  nearest_food = food[0].location;
  easystar.findPath(
    snakeHead.x,
    snakeHead.y,
    nearest_food.x,
    nearest_food.y,
    function (path) {
      if (path === null) {
        console.log('No path found');
      } else {
        food_path = path;
        isFoodFound = true;
      }
    }
  );
  easystar.calculate();
}

function findPathToTail(snakes, self, width, height) {
  const snakeHead = self.body[0];

  // Create empty board array
  let board = Array(height)
    .fill()
    .map(() => Array(width).fill(0));

  // Add other snakes to the board
  snakes.forEach((snake) =>
    snake.body.forEach((element) => (board[element.y][element.x] = 1))
  );

  // Add self to board, not including head
  const selfBody = self.body.slice(1);
  selfBody.forEach((element) => (board[element.y][element.x] = 1));

  board[self.body[self.body.length - 1][0]][
    self.body[self.body.length - 1][1]
  ] = 0;

  // Find path
  easystar.enableSync();
  easystar.setGrid(board);
  easystar.setAcceptableTiles([0]);

  const tail = self.body[self.body.length - 1];

  easystar.findPath(snakeHead.x, snakeHead.y, tail.x, tail.y, function (path) {
    if (path === null) {
      console.log('No path found');
    } else {
      food_path = path;
      isFoodFound = true;
    }
  });
  easystar.calculate();
}

module.exports = function handleMove(request, response) {
  const gameData = request.body;

  console.log('MOVE_DATA:');
  console.log(gameData);

  const possibleMoves = ['up', 'down', 'left', 'right'];
  let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  const boardWidth = gameData.board.width;
  const boardHeight = gameData.board.height;
  const food = gameData.board.food;
  const snakes = gameData.board.snakes;
  const self = gameData.you;

  const head = self.body[0];
  const neck = self.body[1];

  const nearestFood = findFoodDistances(food, self.body[0]);

  findPathToFood(nearestFood, snakes, self, boardWidth, boardHeight);

  if (isFoodFound === true) {
    response.status(200).send({
      move: coordAsMove(food_path[1], self.body[0]),
    });
  } else {
    response.status(200).send({
      move: coordAsMove(
        findPathToTail(snakes, self, boardWidth, boardHeight),
        self.body[0]
      ),
    });
  }

  console.log('MOVE_CHOICE: ' + move);
  response.status(200).send({
    move: move,
  });
};
