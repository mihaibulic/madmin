var io = require('socket.io').listen(1338);
io.set('log level', 1);

var state = 
{
  LENGTH: 15000,
  scores_received: 0,
  players: 0,
  clients: [] 
};

function start()
{
  state.clients = [];
  state.players = 0;
  state.scores_received = 0;
  io.sockets.emit('start',{});
}

function add_score(id, score)
{
  state.scores_received++;
  state.clients[id].score = score;

  console.log("scores rec " + state.scores_received + ", " + state.players);
  if (state.scores_received >= state.players)
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

function add_player(socket) {
  if(!state.clients[socket.id]) {
    state.players++;
    state.clients[socket.id] = {id: socket.id, socket: socket, score: 0};
  }
}

function remove_player(id) {
  if(state.clients[id]) {
    state.players--;
    delete state.clients[id];
  }
}

io.sockets.on('connection', function(socket) 
{
  console.log('connected');
  socket.on('start', start);  
  socket.on('heart', function() { add_player(socket); });
  socket.on('score', function(score) { add_score(socket.id, score); });
  socket.on('disconnect', function() { remove_player(socket.id); });
});

