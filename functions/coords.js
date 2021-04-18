/*
 * Helper functions for handling coordinates.
 * coordEqual: checks if two sets of coordinates are equal and returns true or false.
 * moveAsCoord: takes a move (up, down, left, right) and the coordinates of the snakes head, and returns the coordinates of that move
 * coordAsMove: takes coordinates of a move and the head, and returns the direction that move is in (up, down, left, right)
 */
module.exports = {
  coordEqual: function (a, b) {
    return a.x === b.x && a.y === b.y;
  },
  moveAsCoord: function (move, head) {
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
  },
  coordAsMove: function (coord, head) {
    if (coord.x == head.x && coord.y == head.y + 1) {
      return 'up';
    } else if (coord.x == head.x && coord.y == head.y - 1) {
      return 'down';
    } else if (coord.x == head.x - 1 && coord.y == head.y) {
      return 'left';
    } else if (coord.x == head.x + 1 && coord.y == head.y) {
      return 'right';
    }
  },
};
