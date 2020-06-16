const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');

const handleStart = require('./routes/start');
const handleMove = require('./routes/move');
const handleEnd = require('./routes/end');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.enable('verbose errors');
app.use(morgan('dev'));
app.use(bodyParser.json());

// ROUTES
app.get('/', handleIndex);
app.post('/start', handleStart);
app.post('/move', handleMove);
app.post('/end', handleEnd);

function handleIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: '1',
    author: 'Sam Pratt',
    color: '#f21f3a',
    head: 'safe',
    tail: 'default',
  };
  response.status(200).json(battlesnakeInfo);
}

app.listen(PORT, () =>
  console.log(`Server listening at http://127.0.0.1:${PORT}`),
);
