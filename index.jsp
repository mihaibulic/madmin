<!DOCTYPE html>
<html>
<head>
  <title> MAD MINUTE!</title>
  <%@ include file="/support/head.jsp"%>
  <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
  <div id="logo">
    <h1>Mad Minute!</h1>  
  </div>
  <div id="main">
    <a id="start_button" class="red button" onclick="start_click()">Start</a>
    <p id="time">:0</p>
    <p id="question">Hit Start!</p>
    <p id="answer">prepare for social math</p>
    <a id="1" class="blue button" onclick="add_to_answer(1)">1</a>
    <a id="2" class="blue button" onclick="add_to_answer(2)">2</a>
    <a id="3" class="blue button" onclick="add_to_answer(3)">3</a>
    <br/>
    <a id="4" class="blue button" onclick="add_to_answer(4)">4</a>
    <a id="5" class="blue button" onclick="add_to_answer(5)">5</a>
    <a id="6" class="blue button" onclick="add_to_answer(6)">6</a>
    <br/>
    <a id="7" class="blue button" onclick="add_to_answer(7)">7</a>
    <a id="8" class="blue button" onclick="add_to_answer(8)">8</a>
    <a id="9" class="blue button" onclick="add_to_answer(9)">9</a>
    <br/>
    <a id="X" class="red button" onclick="clear_answer()">x</a>
    <a id="0" class="blue button" onclick="add_to_answer(0)">0</a>
    <a id=">" class="green button" onclick="submit()">Enter</a>
  </div>
  <div id="footer">
    <p>&copy; 2012 Mihai</p>
  
  <script type="text/javascript" src="Timer.js"></script>
  <script type="text/javascript" src="client.js"></script>
  <script type="text/javascript" src="socket.io.js"></script>
</body>
</html>
