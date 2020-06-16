export default function handleIndex(request, response) {
  const battlesnakeInfo = {
    apiversion: '1',
    author: 'Sam Pratt',
    color: '#008080',
    head: 'default',
    tail: 'default',
  };
  response.status(200).json(battlesnakeInfo);
}
