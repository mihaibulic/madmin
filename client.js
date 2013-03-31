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
  server: null
};

function start_click()
{
  if (!state.playing)
  {
    state.server.emit('start', {});
  }
}

function start()
{
  state.playing = true;
  state.timer = new Timer(state.LENGTH, true);
  state.score = 0;
  state.time_field.innerHTML = ":" + Math.round(state.LENGTH/1000);
  
  generate_problem();
  
  state.interval = setInterval(update, 200);

  state.server.emit('heart', {});
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
      state.ans_field.innerHTML = "A: " + state.my_answer;
      state.time_field.innerHTML = ":" + Math.round(state.timer.timeLeft()/1000);
    }
  }
}

function clear_answer()
{
  if (state.playing)
  {
    state.my_answer = 0; 
  }
}

function add_to_answer(ans)
{
  if (state.playing)
  {
    state.my_answer = Math.floor(state.my_answer*10 + ans);
  }
}

function submit()
{
  if (state.playing)
  {
    state.score += (state.my_answer === state.act_answer) ? 1 : -1;
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
  state.my_answer = 0;
}

function display_results(max)
{
  if (state.score === max)
  {
    state.que_field.innerHTML = "YOU WON!"; 
  }
  else
  {
    state.que_field.innerHTML = "you lost :("; 
  }
  state.ans_field.innerHTML = "score: " + state.score;
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


