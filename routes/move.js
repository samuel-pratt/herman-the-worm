const coordFunctions = require('../functions/coords');
const coordEqual = coordFunctions.coordEqual;
const coordAsMove = coordFunctions.coordAsMove;
const moveAsCoord = coordFunctions.moveAsCoord;

const boardFunctions = require('../functions/board');
const findFoodDistances = boardFunctions.findFoodDistances;
const offBoard = boardFunctions.offBoard;
const onSnakes = boardFunctions.onSnakes;

const astar = require('../functions/pathfinding');

const easystarjs = require('easystarjs');
const easystar = new easystarjs.js();
let food_path = [];
let isFoodFound = false;
let noPathFound = false;

function findPath(destination, snakes, self, width, height) {
  const snakeHead = self.body[0];

  // Create empty board array
  let board = Array(height)
    .fill()
    .map(() => Array(width).fill(0));

  // Add other snakes to the board
  snakes.forEach((snake) =>
    snake.body.forEach((element) => (board[element.y][element.x] = 1)),
  );

  // Add self to board, not including head
  const selfBody = self.body.slice(1);
  selfBody.forEach((element) => (board[element.y][element.x] = 1));

  // Find path
  easystar.enableSync();
  easystar.setGrid(board);
  easystar.setAcceptableTiles([0]);

  easystar.findPath(
    snakeHead.x,
    snakeHead.y,
    destination.x,
    destination.y,
    function (path) {
      if (path === null) {
        noPathFound = true;
      } else {
        food_path = path;
        isFoodFound = true;
      }
    },
  );
  easystar.calculate();
}

module.exports = function handleMove(request, response) {
  /*isFoodFound = false;
  noPathFound = false;

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

  const sortedFood = findFoodDistances(food, self.body[0]);

  findPath(sortedFood[0].location, snakes, self, boardWidth, boardHeight);

  if (noPathFound === true) {
    for (const move of moves) {
      const coord = moveAsCoord(move, head);
      if (
        !offBoard(gameData, coord) &&
        !coordEqual(coord, neck) &&
        !onSnakes(gameData, coord)
      ) {
        response.status(200).send({
          move: move,
        });
      }
    }
  } else {
    response.status(200).send({
      move: coordAsMove(food_path[1], self.body[0]),
    });
  }*/
  const gameData = request.body;
  const width = gameData.board.width;
  const height = gameData.board.height;
  const food = gameData.board.food;
  const snakes = gameData.board.snakes;
  const self = gameData.you;

  const head = self.body[0];
  const neck = self.body[1];

  const sortedFood = findFoodDistances(food, self.body[0]);

  const snakeHead = self.body[0];

  // Create empty board array
  let board = Array(height)
    .fill()
    .map(() => Array(width).fill(1));

  // Add other snakes to the board
  snakes.forEach((snake) =>
    snake.body.forEach((element) => (board[element.y][element.x] = 0)),
  );

  // Add self to board, not including head
  const selfBody = self.body.slice(1);
  selfBody.forEach((element) => (board[element.y][element.x] = 0));

  var graph = new astar.Graph(board);

  var start = graph.grid[snakeHead.x][snakeHead.y];
  var end = graph.grid[sortedFood[0].location.x][sortedFood[0].location.y];

  var result = astar.astar.search(graph, start, end);

  console.log('Snake Head: ');
  console.log(snakeHead);
  console.log('Food: ');
  console.log(sortedFood[0].location);
  console.log('Result: ');
  console.log(result);

  var move = coordAsMove({ x: result[0].x, y: result[0].y }, snakeHead);

  console.log(move);

  response.status(200).send({
    move: move,
  });
};
