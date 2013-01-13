var io = require('socket.io').listen(1338);
io.set('log level', 1);

var globals = 
{
  LENGTH: 2000,
  scores_received: 0,
  clients: {} 
};

function start()
{
  var time = new Date().getTime();
  setTimeout(end, globals.LENGTH);
  
  io.sockets.emit('start', time);
}

function end()
{
  io.sockets.emit('end', {});
}

function add_score(id, score)
{
  globals.scores_received++;
  globals.clients[id].score = score;

  if (globals.scores_received >= globals.clients.length)
    compute_winner();
}

function compute_winner()
{
  var max = 0;
  var min = 9999;

  for (var c in globals.clients)
  {
    console.log("*" + globals.clients[c].id + ", " + globals.clients[c].score);
    if (globals.clients[c].score > max) max = globals.clients[c].score;  
    if (globals.clients[c].score < min) min = globals.clients[c].score;  
  }

  console.log(globals.clients.length);

  for (c in globals.clients)
  {
    console.log("*" + globals.clients[c].id);
    globals.clients[c].socket.emit('results', {min: min, max: max, my: globals.clients[c].score});
    globals.clients[c].score = 0;
  }

  globals.scores_receives = 0;
}

io.sockets.on('connection', function(socket) 
{
  socket.on('start', function()
  { 
    start();
  });  

  socket.on('disconnect', function() 
  {
    console.log("disconnect");
    delete globals.clients[socket.id];
  });

  socket.on('score', function(score)
  {
    add_score(socket.id, score);
  });
 
  globals.clients[socket.id] = {id: socket.id, socket: socket, score: 0};
  console.log("C" + globals.clients.length);
});

