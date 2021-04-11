module.exports = function handleEnd(request, response) {
  const gameData = request.body;

  console.log('END');
  console.log(gameData);

  response.status(200).send('ok');
};
