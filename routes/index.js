function handleIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: '1',
    author: 'Sam Pratt',
    color: '#f21f3a',
    head: 'chomp',
    tail: 'ghost',
  };
  response.status(200).json(battlesnakeInfo);
};

export default handleIndex;