var state = 
{
  LENGTH: 15000,
  interval: null,
  timer: null,
  score: 0,
  my_answer: 0,
  act_answer: 0,
  server: null
};

function start_click()
{
  state.server.emit('start', {});
  document.getElementById("start_button").style.visibility = "hidden";
  document.getElementById("time").style.visibility = "visible";
}

function start(time)
{
  state.timer = new Timer(state.LENGTH - (new Date().getTime() - time), true);
  state.score = 0;
  state.interval = setInterval(update, 50);
  update();
}

function update()
{
  if(state.timer.isDone())
  {
    clearInterval(state.interval);
    state.interval = null;
  }

  document.getElementById("time").innerHTML = ":" + Math.round(state.timer.timeLeft()/1000);
}

function answer(ans)
{
  if (ans === "x")
  {
    state.my_answer = Math.floor(my_answer/10);
  }
  else
  {
    state.my_answer += state.my_answer*10 + ans;
  }
  
  document.getElementById("answer").innerHTML = state.my_answer; 
}

function submit()
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

  document.getElementById("time").style.visibility = "hidden";
  document.getElementById("start_button").style.visibility = "visible";
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
  state.server.on('start', start);
  state.server.on('end', end);
  state.server.on('results', display_results);
};


