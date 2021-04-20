module.exports = function handleIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: '1',
    author: 'Sam Pratt',
    color: '#b7f0a1',
    head: 'chomp',
    tail: 'ghost',
  };
  response.status(200).json(battlesnakeInfo);
};
