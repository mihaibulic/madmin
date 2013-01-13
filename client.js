var globals = 
{
  LENGTH: 15000,
  interval: null,
  timer: null,
  score: 0,
  server: null
};

function start()
{
  globals.server.emit('start', {});
}

function update()
{
  if(timer.isDone())
  {
    clearInterval(globals.interval);
    globals.interval = null;
  }
  console.log(timer.timeLeft());
}

function answer(ans)
{
  globals.score += ans;
  console.log("Score: " + globals.score);
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
  console.log("END");
    
  clearInterval(globals.interval);
  globals.interval = null;
    
  globals.server.emit('score', globals.score);
}

window.onload = function()
{
  globals.server = io.connect('ws://madmin.misquares.com');
  globals.server.on('start', function(time)
  {
    globals.server.on('end', end);
    globals.server.on('result', display_results);

    timer = new Timer(globals.LENGTH - (new Date().getTime() - time));
    update();
    globals.interval.setInterval(update, 500);
  });
};


