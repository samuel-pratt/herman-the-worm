const coordFunctions = require('../functions/coords');
const coordEqual = coordFunctions.coordEqual;
const coordAsMove = coordFunctions.coordAsMove;
const moveAsCoord = coordFunctions.moveAsCoord;

const boardFunctions = require('../functions/board');
const findFoodDistances = boardFunctions.findFoodDistances;
const offBoard = boardFunctions.offBoard;
const onSnakes = boardFunctions.onSnakes;

const astar = require('../functions/astar');

module.exports = function handleMove(request, response) {
  const gameData = request.body;

  const width = gameData.board.width;
  const height = gameData.board.height;
  const food = gameData.board.food;
  const snakes = gameData.board.snakes;
  const self = gameData.you;
  const snakeHead = self.body[0];

  const sortedFood = findFoodDistances(food, self.body[0]);

  // Create empty board array
  let board = Array(height)
    .fill()
    .map(() => Array(width).fill(1));

  // Add other snakes to the board
  snakes.forEach((snake) =>
    snake.body.forEach((element) => (board[element.x][element.y] = 0)),
  );

  // Add self to board, not including head
  const selfBody = self.body.slice(1);
  selfBody.forEach((element) => (board[element.x][element.y] = 0));
  console.log(board);
  var graph = new astar.Graph(board);

  var start = graph.grid[snakeHead.x][snakeHead.y];
  var end = graph.grid[sortedFood[0].location.x][sortedFood[0].location.y];

  var result = astar.astar.search(graph, start, end);

  if (result.length) {
    var move = coordAsMove({ x: result[0].x, y: result[0].y }, snakeHead);
  } else {
    for (let i = selfBody.length - 1; i > 0; i--) {
      start = graph.grid[snakeHead.x][snakeHead.y];
      end = graph.grid[selfBody[i].x][selfBody[i].y];

      result = astar.astar.search(graph, start, end);

      if (result.length) {
        var move = coordAsMove({ x: result[0].x, y: result[0].y }, snakeHead);
        break;
      }
    }
  }

  response.status(200).send({
    move: move,
  });
};
