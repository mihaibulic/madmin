var state = {
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
  start_field: document.getElementById("start"),
  server: null
};

function start_click()
{
  if (state.playing)
  {
    submit();
  }
  else 
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

  state.start_field.className = "hidden";
  state.que_field.className = "green button";
  state.time_field.className = "green button";
  state.ans_field.className = "green button";
  
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
    state.que_field.innerHTML = a + "+" + b;
    state.act_answer = a + b; 
  }
  else if (t === 1)
  {
    a = Math.round(Math.random()*100);
    b = Math.round(Math.random()*100);
    first = Math.max(a,b);
    sec = Math.min(a,b); 
    state.que_field.innerHTML = first + "-" + sec;
    state.act_answer = first - sec;
  }
  else 
  {
    a = Math.round(Math.random()*13);
    b = Math.round(Math.random()*13);
    state.que_field.innerHTML = a + "x" + b;
    state.act_answer = a * b;
  }
  state.my_answer = 0;
}

function display_results(max)
{
  if (state.score === max)
  {
    state.start_field.innerHTML = "YOU WON"; 
    state.start_field.className = "green button";
  }
  else
  {
    state.start_field.innerHTML = "You Lost"; 
    state.start_field.className = "red button";
  }
  state.start_field.innerHTML += " (" + state.score + " pts)";
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
  state.start_field.innerHTML = "Please Wait..."; 
  state.start_field.className = "yellow button";
  state.que_field.className = "hidden";
  state.time_field.className = "hidden";
  state.ans_field.className = "hidden";
}

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

window.onload = function()
{
  document.onkeyup=function(e) {
    switch(e.which) {
      case 8:
        clear_answer();
      break;
      case 13:
        start_click(); 
      break;
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        add_to_answer(e.which-48); 
      break;
    }
  }
  state.server = io.connect('ws://madmin.misquares.com');
  state.server.on('start', start);
  state.server.on('end', end);
  state.server.on('results', display_results);
};

if( isMobile.any() ) {
  var cssId = 'mobile';  // you could encode the css path itself to generate id..
  if (!document.getElementById(cssId))
  {
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'mobile.css';
    link.media = 'all';
    head.appendChild(link);
  }
}
