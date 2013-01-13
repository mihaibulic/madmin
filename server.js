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
//  setTimeout(end, state.LENGTH);
  io.sockets.emit('start',{});
}

function end()
{
  io.sockets.emit('end', {});
}

function add_score(id, score)
{
  state.scores_received++;
  state.clients[id].score = score;

  console.log("scores rec");
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
  state.scores_received = 0;
}

io.sockets.on('connection', function(socket) 
{
  console.log('connected');
  socket.on('start', start);  
  socket.on('disconnect', function() { delete state.clients[socket.id]; });
  socket.on('score', function(score) { add_score(socket.id, score); });
 
  state.clients[socket.id] = {id: socket.id, socket: socket, score: 0};
});

