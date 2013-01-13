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
  state.timer = new Timer(state.LENGTH, true);
  state.score = 0;
  state.interval = setInterval(update, 500);
  
  document.getElementById("time").innerHTML = ":" + state.LENGTH;
  document.getElementById("answer").innerHTML = "-";
  
  update();
  generate_problem();
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
    state.my_answer = Math.floor(state.my_answer/10);
  }
  else
  {
    state.my_answer = Math.floor(state.my_answer*10 + ans);
  }
  
  document.getElementById("answer").innerHTML = state.my_answer; 
}

function submit()
{
  state.score += (state.my_answer === state.act_answer) ? 1 : -1;
  console.log(state.score);

  document.getElementById("answer").innerHTML = "-"; 
  state.my_answer = 0;

  generate_problem();
}

function generate_problem()
{
  var a = 0;
  var b = 0; 
  var first = 0;
  var second = 0;
  var t = Math.floor(Math.random()*3);
  var p = document.getElementById("question");

  if (t === 0)
  {
    a = Math.round(Math.random()*100);
    b = Math.round(Math.random()*100);
    p.innerHTML = a + " + " + b;
    state.act_answer = a + b; 
  }
  else if (t === 1)
  {
    a = Math.round(Math.random()*100);
    b = Math.round(Math.random()*100);
    first = Math.max(a,b);
    sec = Math.min(a,b); 
    p.innerHTML = first + " - " + sec;
    state.act_answer = first - sec;
  }
  else 
  {
    a = Math.round(Math.random()*13);
    b = Math.round(Math.random()*13);
    p.innerHTML = a + " x " + b;
    state.act_answer = a * b;
  }
}

function display_results(data)
{
  document.getElementById("question").innerHTML = (data.my === data.max) ? "YOU WON!" : "you lost :("; 
  document.getElementById("answer").innerHTML = "score: " + data.my;

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


