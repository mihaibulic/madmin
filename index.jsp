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
    <input id="start_button" class="red button" type="button" value="Start" onclick="start_click()" />
    <p id="time" style="visibility: hidden">:0</p>
    <p id="question">This space is for questions!</p>
    <p id="answer">-</p>
    <input id="1" class="blue button" type="button" value="1" onclick="answer(1)" />
    <input id="2" class="blue button" type="button" value="2" onclick="answer(2)" />
    <input id="3" class="blue button" type="button" value="3" onclick="answer(3)" />
    <br/>
    <input id="4" class="blue button" type="button" value="4" onclick="answer(4)" />
    <input id="5" class="blue button" type="button" value="5" onclick="answer(5)" />
    <input id="6" class="blue button" type="button" value="6" onclick="answer(6)" />
    <br/>
    <input id="7" class="blue button" type="button" value="7" onclick="answer(7)" />
    <input id="8" class="blue button" type="button" value="8" onclick="answer(8)" />
    <input id="9" class="blue button" type="button" value="9" onclick="answer(9)" />
    <br/>
    <input id="x" class="blue button" type="button" value="x" onclick="answer('x')" />
    <input id="0" class="blue button" type="button" value="0" onclick="answer(0)" />
    <input id="enter" class="green button" type="button" value="Enter" onclick="submit()" />
  </div>
  <div id="footer">
    <p>&copy; 2012 Mihai</p>
    <p>Mihai Bulic</p>
</body>
</html>
