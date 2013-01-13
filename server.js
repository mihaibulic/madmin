var io = require('socket.io').listen(1338);
io.set('log level', 1);

var state = 
{
  LENGTH: 2000,
  scores_received: 0,
  clients: [] 
};

function start()
{
  var time = new Date().getTime();
  setTimeout(end, state.LENGTH);
  
  io.sockets.emit('start', time);
}

function end()
{
  io.sockets.emit('end', {});
}

function add_score(id, score)
{
  state.scores_received++;
  state.clients[id].score = score;

  if (state.scores_received >= state.clients.length)
    compute_winner();
}

function compute_winner()
{
  var max = 0;
  var min = 9999;

  for (var c in state.clients)
  {
    if (state.clients[c].score > max) max = state.clients[c].score;  
    if (state.clients[c].score < min) min = state.clients[c].score;  
  }

  for (c in state.clients)
  {
    state.clients[c].socket.emit('results', {min: min, max: max, my: state.clients[c].score});
    state.clients[c].score = 0;
  }

  state.scores_receives = 0;
}

io.sockets.on('connection', function(socket) 
{
  console.log("new connection: " + socket.id);

  socket.on('start', start);  
  socket.on('disconnect', function() 
  {
    delete state.clients[socket.id];
  });
  socket.on('score', function(score)
  {
    add_score(socket.id, score);
  });
 
  state.clients[socket.id] = {id: socket.id, socket: socket, score: 0};
});

