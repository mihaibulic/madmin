var LENGTH= 16000;
var COOLDOWN_LENGTH= 1500;
var MAX_SCORE = 100;
var MIN_SCORE = 25;
var PROBLEM_TIME = 3000;
var ANSWER_PENALTY = -25;
var TIME_PENALTY = -25;
var ANDWER_LENGTH = 1000;

// MODES
var NONE = -1;
var READY = 0;
var PLAYING = 1;
var WAITING = 2;
var COOLDOWN = 3;
var NEXT_GAME = 4;

var interval = null;
var answer_timeout = null;
var timer = null;
var problem_timer = null;
var tries =0;
var score = 0;
var my_answer = "";
var act_answer = 0;
var mode = NONE;
var ans_field = document.getElementById("answer");
var que_field = document.getElementById("question");
var time_field = document.getElementById("time");
var start_field = document.getElementById("start");
var server = null;

function start_click() {
  if (mode === PLAYING)
    submit();
  else if (mode === READY)
    server.emit('start', {});
}

function start() {
  mode = PLAYING;
  timer = new Timer(LENGTH, true);
  score = 0;

  start_field.className = "hidden";
  que_field.className = "disabled button";
  time_field.className = "green button";
  ans_field.className = "disabled button";

  interval = setInterval(update, 500);
  time_field.innerHTML = ":" + Math.round(LENGTH/1000);
  generate_problem();
  server.emit('heart', {});
}

function wait() {
  mode = NEXT_GAME;
  start_field.className = "yellow button";
  start_field.innerHTML = "Finishing game";
}

function ready() {
  mode = READY;
  start_field.className = "green button";
  start_field.innerHTML = "Start";
}

function update() {
  if (mode === PLAYING) {
    if (timer.isDone())
      end();
    else 
    {
      time_field.innerHTML = ":" + Math.round(timer.timeLeft()/1000);
      time_field.className = (timer.timeLeft() <= 5000 ? "red button" :
	(timer.timeLeft() <= 10000 ? "yellow" : "green")) + " button";
    }
  }
}

function generate_problem() {
  var a = 0;
  var b = 0; 
  var first = 0;
  var second = 0;
  var t = Math.floor(Math.random()*3);

  if (t === 0) {
    a = Math.round(Math.random()*100);
    b = Math.round(Math.random()*100);
    que_field.innerHTML = a + "+" + b;
    act_answer = (a + b) + ""; 
  }
  else if (t === 1) {
    a = Math.round(Math.random()*100);
    b = Math.round(Math.random()*100);
    first = Math.max(a,b);
    sec = Math.min(a,b); 
    que_field.innerHTML = first + "-" + sec;
    act_answer = (first - sec) + "";
  }
  else {
    a = Math.round(Math.random()*13);
    b = Math.round(Math.random()*13);
    que_field.innerHTML = a + "x" + b;
    act_answer = (a * b) + "";
  }
  tries = 0;
  problem_timer = new Timer(PROBLEM_TIME, true);  
  my_answer = "";
  ans_field.innerHTML = "A";
}

function add_to_answer(ans) {
  if (mode === PLAYING && my_answer.length < 3) {
    my_answer += "" + ans;
    ans_field.innerHTML = "A: " + my_answer;
  }
}

function clear_answer() {
  if (mode === PLAYING) {
    my_answer = ""; 
    ans_field.innerHTML = "A";
  }
}

function submit() {
  if (mode === PLAYING) {
    clearTimeout(answer_timeout);

    if (my_answer === act_answer) {
      var try_penalty = tries * ANSWER_PENALTY;
      var time_penalty = TIME_PENALTY*(PROBLEM_TIME - problem_timer.timeLeft())/1000.0;
      score += Math.round(Math.max(MIN_SCORE, MAX_SCORE + try_penalty + time_penalty));
      ans_field.className = "green button";
      
      generate_problem();
    }
    else if (my_answer.length > 0){
      tries++;
      my_answer = "";
      ans_field.innerHTML = "A";
      ans_field.className = "red button";
    }

    answer_timeout = setTimeout(reset_answer, ANDWER_LENGTH);
  }
}

function reset_answer() {
  if (mode === PLAYING && ans_field.className !== "hidden") {
    ans_field.className = "disabled button";
  }
}

function end() {
  if (mode === PLAYING) {
    mode = WAITING;
    clearInterval(interval);
    interval = null;
    
    time_field.innerHTML = ":0";
    que_field.className = "hidden";
    time_field.className = "hidden";
    ans_field.className = "hidden";
    start_field.className = "yellow button";
    start_field.innerHTML = "Please Wait..."; 

    server.emit('score', score);
  }
}

function display_results(max) {
  if (mode === WAITING) {
    if (score === max) {
      start_field.innerHTML = "YOU WON"; 
      start_field.className = "green button";
    }
    else {
      start_field.innerHTML = "You Lost"; 
      start_field.className = "red button";
    }
    start_field.innerHTML += " (" + Math.round(score) + " pts)";
    mode = COOLDOWN;
  }
  setTimeout(ready, COOLDOWN_LENGTH);
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

window.onload = function() {
  document.onkeydown=function(e) {
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
  };

  if(server === null) {
    server = io.connect('ws://madmin.' + document.domain);
    server.on('start', start);
    server.on('wait', wait);
    server.on('ready', ready);
    server.on('results', display_results);
  }
};

if( isMobile.any() ) {
  var cssId = 'mobile';  // you could encode the css path itself to generate id..
  if (!document.getElementById(cssId)) {
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
