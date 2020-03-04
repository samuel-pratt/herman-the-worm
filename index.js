// Imports
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const easystarjs = require("easystarjs");

// Pathfinding stuff
const easystar = new easystarjs.js();
let food_path = [];

// Express app stuff
const app = express();
app.set("port", process.env.PORT || 9001);
app.enable("verbose errors");
app.use(morgan("dev"));
app.use(bodyParser.json());

// Helper functions
const findNearestFood = (food, snakeHead) => {
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
