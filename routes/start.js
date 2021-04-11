function handleStart(request, response) {
  const gameData = request.body;

  console.log('START');
  console.log(gameData);

  response.status(200).send('ok');
};

export default handleStart;