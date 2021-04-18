/*
 * Helper functions for checking things on the board.
 * findFoodDistances: takes an array of food on the board, and the location of the head, and returns an array of food sorted by distance from the head
 * offBoard: takes the game state and a coordinate and checks if it is off the board, returns true or false
 * onSnakes: takes the game state and a coordinate and checks if the coordinate is on any snakes, returns true or false
 */
module.exports = {
  findFoodDistances: function (food, snakeHead) {
    if (food === []) return null; // No food on board

    const distances = food.map((item) => {
      return {
        distance: Math.sqrt(
          (snakeHead.x - item.x) * (snakeHead.x - item.x) +
            (snakeHead.y - item.y) * (snakeHead.y - item.y),
        ),
        location: item,
      };
    });

    distances.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return distances;
  },
  offBoard: function (state, coord) {
    if (coord.x < 0) return true;
    if (coord.y < 0) return true;
    if (coord.y >= state.board.height) return true;
    if (coord.x >= state.board.height) return true;
    return false; // If it makes it here we are ok.
  },
  onSnakes: function (state, coord) {
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
  },
};
