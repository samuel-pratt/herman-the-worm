const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");

app.set("port", process.env.PORT || 9001);

app.enable("verbose errors");

app.use(logger("dev"));
app.use(bodyParser.json());

app.post("/start", (request, response) => {
  // Response data
  const data = {
    color: "#0F0F0F"
  };

  return response.json(data);
});

app.post("/move", (request, response) => {
  const move = {
    move: "left"
  };

  return response.json(move);
});

app.post("/end", (request, response) => {});

app.post("/ping", (request, response) => {});
