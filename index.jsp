<!DOCTYPE html>
<html>
<head>
  <title> MAD MINUTE!</title>
  <script type="text/javascript" src="Timer.js"></script>
  <script type="text/javascript" src="client.js"></script>
  <script type="text/javascript" src="socket.io.js"></script>
  <link rel="stylesheet" type="text/css" href="style.css" />
  <%@ include file="/support/head.jsp"%>
</head>
<body>
  <div id="logo">
    <h1>Mad Minute!</h1>  
  </div>
  <div id="main">
    <a id="start_button" class="red button" onclick="start_click()">Start</a>
    <p id="time">:0</p>
    <p id="question">-</p>
    <p id="answer">-</p>
    <a id="1" class="blue button" value="1" onclick="answer(1)">1</a>
    <a id="2" class="blue button" value="2" onclick="answer(2)">2</a>
    <a id="3" class="blue button" value="3" onclick="answer(3)">3</a>
    <br/>
    <a id="4" class="blue button" value="4" onclick="answer(4)">4</a>
    <a id="5" class="blue button" value="5" onclick="answer(5)">5</a>
    <a id="6" class="blue button" value="6" onclick="answer(6)">6</a>
    <br/>
    <a id="7" class="blue button" value="7" onclick="answer(7)">7</a>
    <a id="8" class="blue button" value="8" onclick="answer(8)">8</a>
    <a id="9" class="blue button" value="9" onclick="answer(9)">9</a>
    <br/>
    <a id="x" class="red button" value="x" onclick="answer('x')">x</a>
    <a id="0" class="blue button" value="0" onclick="answer(0)">0</a>
    <a id="enter" class="green button" value="Enter" onclick="submit()"></a>
  </div>
  <div id="footer">
    <p>&copy; 2012 Mihai</p>
</body>
</html>
