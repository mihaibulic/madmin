var io = require('socket.io').listen(1338);
io.set('log level', 1);

var LENGTH = 15000;
var TIMEOUT_LENGTH = 2000;

// MODES
var READY = 0;
var PLAYING = 1;
var COMPUTING_WINNER = 2;

var mode = READY;
var clients = []; 
var players = 0;
var scores_received = 0;
var timeout = null;

function start() {
  if (mode === READY) { 
    mode = PLAYING;
    clients = [];
    players = 0;
    scores_received = 0;
    io.sockets.emit('start',{});
  }
}

function add_score(id, score) {
  if (clients[id]) {
    scores_received++;
    clients[id].score = score;
  
    console.log("scores received");
    if (scores_received >= players) {
      compute_winner(); 
    }
    else {
      timeout = setTimeout(compute_winner, TIMEOUT_LENGTH);
    }
  }
}

function compute_winner() {
  mode = COMPUTING_WINNER;
  clearTimeout(timeout);
  
  console.log("computing winner");
  var max = -999;
  for (var c in clients) {
    if (clients[c].score > max) max = clients[c].score;  
    clients[c].score = 0;
  }

  io.sockets.emit('results', max);  
  mode = READY;
}

function add_player(socket) {
  if(!clients[socket.id]) {
    console.log("adding player");
    players++;
    clients[socket.id] = {id: socket.id, socket: socket, score: 0};
  }
}

function remove_player(id) {
  if(clients[id]) {
    players--;
    delete clients[id];

    if (players === 0) {
      mode = READY;
    }
  }
}

io.sockets.on('connection', function(socket) {
  console.log('connected ' + socket.id);

  if (mode === PLAYING) 
    socket.emit('wait', {});
  else 
    socket.emit('ready', {});

  socket.on('start', start);  
  socket.on('heart', function() { add_player(socket); });
  socket.on('score', function(score) { add_score(socket.id, score); });
  socket.on('disconnect', function() { remove_player(socket.id); });
});

