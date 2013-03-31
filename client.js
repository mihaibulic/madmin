var LENGTH= 15000;
var interval= null;
var timer= null;
var score= 0;
var my_answer= "";
var act_answer= 0;
var playing= false;
var ans_field= document.getElementById("answer");
var que_field= document.getElementById("question");
var time_field= document.getElementById("time");
var start_field= document.getElementById("start");
var server= null;
var my_answer_array = [];

function start_click()
{
  if (playing)
  {
    submit();
  }
  else 
  {
    server.emit('start', {});
  }
}

function start()
{
  playing = true;
  timer = new Timer(LENGTH, true);
  score = 0;
  time_field.innerHTML = ":" + Math.round(LENGTH/1000);

  start_field.className = "hidden";
  que_field.className = "green button";
  time_field.className = "green button";
  ans_field.className = "green button";
  
  generate_problem();
  
  interval = setInterval(update, 500);

  server.emit('heart', {});
}

function update()
{
  if (playing)
  {
    if (timer.isDone())
    {
      end();
    }
    else
    {
      time_field.innerHTML = ":" + Math.round(timer.timeLeft()/1000);
      ans_field.innerHTML = my_answer_array.toString();
    }
  }
}

function clear_answer()
{
  if (playing)
  {
    my_answer = ""; 
    my_answer_array = []; 
    ans_field.innerHTML = "A: ";
  }
}

function add_to_answer(ans)
{
  if (playing)
  {
    my_answer_array.push(ans);
//    ans_field.innerHTML = my_answer += "" + ans;
//    ans_field.innerHTML = my_answer;
  }
}

function submit()
{
  if (playing)
  {
    score += (my_answer === act_answer) ? 1 : -1;
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
    que_field.innerHTML = a + "+" + b;
    act_answer = (a + b) + ""; 
  }
  else if (t === 1)
  {
    a = Math.round(Math.random()*100);
    b = Math.round(Math.random()*100);
    first = Math.max(a,b);
    sec = Math.min(a,b); 
    que_field.innerHTML = first + "-" + sec;
    act_answer = (first - sec) + "";
  }
  else 
  {
    a = Math.round(Math.random()*13);
    b = Math.round(Math.random()*13);
    que_field.innerHTML = a + "x" + b;
    act_answer = (a * b) + "";
  }
  my_answer = "";
  my_answer_array = [];
  ans_field.innerHTML = "A: ";
}

function display_results(max)
{
  if (score === max)
  {
    start_field.innerHTML = "YOU WON"; 
    start_field.className = "green button";
  }
  else
  {
    start_field.innerHTML = "You Lost"; 
    start_field.className = "red button";
  }
  start_field.innerHTML += " (" + score + " pts)";
}

function end()
{
  if (playing) {
    playing = false;
    clearInterval(interval);
    interval = null;
    
    time_field.innerHTML = ":0";
    que_field.innerHTML = "please wait";
    ans_field.innerHTML = "...";
  
    server.emit('score', score);
    start_field.innerHTML = "Please Wait..."; 
    start_field.className = "yellow button";
    que_field.className = "hidden";
    time_field.className = "hidden";
    ans_field.className = "hidden";
  }
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
  server = io.connect('ws://madmin.misquares.com');
  server.on('start', start);
  server.on('results', display_results);
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
