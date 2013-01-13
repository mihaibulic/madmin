var state = 
{
  LENGTH: 2000,
  interval: null,
  timer: null,
  score: 0,
  server: null
};

function start()
{
  state.server.emit('start', {});
}

function update()
{
  if(state.timer.isDone())
  {
    clearInterval(state.interval);
    state.interval = null;
  }
  console.log(state.timer.timeLeft());
}

function answer(ans)
{
  state.score += ans;
  console.log("Score: " + state.score);
}

function display_results(data)
{
  console.log("winner: " + data.max);
  console.log("my score: " + data.my);
  console.log("loser: " + data.min);
     
  if (data.my === data.max) console.log("YOU WON");
  else if (data.my === data.min) console.log("YOU LOST");
}

function end()
{
  clearInterval(state.interval);
  state.interval = null;
    
  console.log("END");
  
  state.server.emit('score', state.score);
}

window.onload = function()
{
  state.server = io.connect('ws://madmin.misquares.com');
  state.server.on('start', function(time)
  {
    state.server.on('end', end);
    state.server.on('results', display_results);

    state.timer = new Timer(state.LENGTH - (new Date().getTime() - time), true);
    state.score = 0;
    state.interval = setInterval(update, 500);
    update();
  });
};


