var io = require('socket.io').listen(1338);
io.set('log level', 1);

var playing= false;
var LENGTH= 15000;
var scores_received= 0;
var players= 0;
var clients= []; 

function start()
{
  if (!playing) {
    playing = true;
    clients = [];
    players = 0;
    scores_received = 0;
    io.sockets.emit('start',{});
  }
}

function add_score(id, score)
{
  if (clients[id]) {
    scores_received++;
    clients[id].score = score;
  
    console.log("scores rec " + scores_received + ", " + players);
    if (scores_received >= players)
    {
      console.log("computing winner");
      compute_winner(); 
    }
  }
}

function compute_winner()
{
  var max = -999;
  for (var c in clients)
  {
    if (clients[c].score > max) max = clients[c].score;  
    clients[c].score = 0;
  }

  io.sockets.emit('results', max);  
  playing = false;
}

function add_player(socket) {
  if(!clients[socket.id]) {
    players++;
    clients[socket.id] = {id: socket.id, socket: socket, score: 0};
  }
}

function remove_player(id) {
  if(clients[id]) {
    players--;
    delete clients[id];
  }
}

io.sockets.on('connection', function(socket) 
{
  console.log('connected ' + socket.id);
  socket.on('start', start);  
  socket.on('heart', function() { add_player(socket); });
  socket.on('score', function(score) { add_score(socket.id, score); });
  socket.on('disconnect', function() { remove_player(socket.id); });
});

