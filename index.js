import { json } from 'body-parser';
import express from 'express';
import morgan from 'morgan';

import handleIndex from './routes/index';
import handleStart from './routes/start';
import handleMove from './routes/move';
import handleEnd from './routes/end';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(json());
app.enable('verbose errors');
app.use(morgan('dev'));

// ROUTES
app.get('/', handleIndex);
app.post('/start', handleStart);
app.post('/move', handleMove);
app.post('/end', handleEnd);

app.listen(PORT, () =>
  console.log(`Server listening at http://127.0.0.1:${PORT}`),
);
