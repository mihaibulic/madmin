var io = require('socket.io').listen(1338);
io.set('log level', 1);

var state = 
{
  LENGTH: 15000,
  scores_received: 0,
  clients: [] 
};

function start()
{
  state.clients = [];
  state.scores_received = 0;
  io.sockets.emit('start',{});
}

function add_score(id, score)
{
  state.scores_received++;
  state.clients[id].score = score;

  console.log("scores rec " + state.scores_received + ", " + state.clients.length);
  if (state.scores_received >= state.clients.length)
  {
    console.log("computing winner");
    compute_winner(); 
  }
}

function compute_winner()
{
  console.log("cw");
  var max = -999;

  for (var c in state.clients)
  {
    if (state.clients[c].score > max) max = state.clients[c].score;  
    state.clients[c].score = 0;
  }

  io.sockets.emit('results', max);  
}

io.sockets.on('connection', function(socket) 
{
  console.log('connected');
  socket.on('start', start);  
  socket.on('heart', function() { state.clients[socket.id] = {id: socket.id, socket: socket, score: 0}; });
  socket.on('score', function(score) { add_score(socket.id, score); });
  socket.on('disconnect', function() { delete state.clients[socket.id]; });
});

