var state = 
{
  LENGTH: 15000,
  interval: null,
  timer: null,
  score: 0,
  my_answer: 0,
  act_answer: 0,
  playing: false,
  ans_field: document.getElementById("answer"),
  que_field: document.getElementById("question"),
  time_field: document.getElementById("time"),
  start_button: document.getElementById("start_button"),
  server: null
};

function start_click()
{
  if (!state.playing)
  {
    state.server.emit('start', {});
    start_button.innerHTML = "Starting...";
    start_button.className = "yellow button";
  }
}

function start()
{
  state.playing = true;
  
  state.time_field.innerHTML = ":" + Math.round(state.LENGTH/1000);
  state.que_field.innerHTML = "Q: ";
  state.ans_field.innerHTML = "A: ";
  
  generate_problem();
  
  state.timer = new Timer(state.LENGTH, true);
  state.score = 0;
  
  update();
  state.interval = setInterval(update, 500);
  start_button.style.visibility = "hidden";
}

function update()
{
  if (state.playing)
  {
    if (state.timer.isDone())
    {
      end();
    }
    else
    {
      state.time_field.innerHTML = ":" + Math.round(state.timer.timeLeft()/1000);
    }
  }
}

function answer(ans)
{
  if (state.playing)
  {
    if (ans === "x")
    {
      state.ans_field.innerHTML = "A: ";
      state.my_answer = 0; 
    }
    else
    {
      state.ans_field.innerHTML += ans; 
      state.my_answer = Math.floor(state.my_answer*10 + ans);
    }
  }
}

function submit()
{
  if (state.playing)
  {
    state.score += (state.my_answer === state.act_answer) ? 1 : -1;

    state.ans_field.innerHTML = "A: "; 
    state.my_answer = 0;

    generate_problem();
  }
}

function generate_problem()
{
  var a = 0;
  var b = 0; 
  var first = 0;
  var second = 0;
  var t = Math.floor(Math.random()*3);

  if (t === 0)
  {
    a = Math.round(Math.random()*100);
    b = Math.round(Math.random()*100);
    state.que_field.innerHTML = "Q: " + a + " + " + b;
    state.act_answer = a + b; 
  }
  else if (t === 1)
  {
    a = Math.round(Math.random()*100);
    b = Math.round(Math.random()*100);
    first = Math.max(a,b);
    sec = Math.min(a,b); 
    state.que_field.innerHTML = "Q: " + first + " - " + sec;
    state.act_answer = first - sec;
  }
  else 
  {
    a = Math.round(Math.random()*13);
    b = Math.round(Math.random()*13);
    state.que_field.innerHTML = "Q: " + a + " x " + b;
    state.act_answer = a * b;
  }
}

function display_results(max)
{
  state.que_field.innerHTML = (state.score === max) ? "YOU WON!" : "you lost :("; 
  state.ans_field.innerHTML = "score: " + state.score;

  start_button.innerHTML = "Start";
  start_button.className = "red button";
  start_button.style.visibility = "visible";
}

function end()
{
  state.playing = false;
  clearInterval(state.interval);
  state.interval = null;
    
  state.time_field.innerHTML = ":0";
  state.que_field.innerHTML = "please wait";
  state.ans_field.innerHTML = "...";
  
  state.server.emit('score', state.score);
}

window.onload = function()
{
  state.server = io.connect('ws://madmin.misquares.com');
  state.server.on('start', start);
  state.server.on('end', end);
  state.server.on('results', display_results);
};


