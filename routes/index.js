module.exports = function handleIndex(request, response) {
  const battlesnakeInfo = {
    apiversion: '1',
    author: 'Sam Pratt',
    color: '#008080',
    head: 'safe',
    tail: 'default',
  };
  response.status(200).json(battlesnakeInfo);
};
