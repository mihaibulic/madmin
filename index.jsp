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
    <input class="red button" type="button" value="Start" onclick="start_click()" />
    <p id="question">This space is for questions!</p>
    <p id="answer">0</p>
    <input class="blue button" type="button" value="1" onclick="answer(1)" />
    <input class="blue button" type="button" value="2" onclick="answer(2)" />
    <input class="blue button" type="button" value="3" onclick="answer(3)" />
    <br/>
    <input class="blue button" type="button" value="4" onclick="answer(4)" />
    <input class="blue button" type="button" value="5" onclick="answer(5)" />
    <input class="blue button" type="button" value="6" onclick="answer(6)" />
    <br/>
    <input class="blue button" type="button" value="7" onclick="answer(7)" />
    <input class="blue button" type="button" value="8" onclick="answer(8)" />
    <input class="blue button" type="button" value="9" onclick="answer(9)" />
    <input class="blue button" type="button" value="0" onclick="answer(0)" />
    <br/>
    <input class="green button" type="button" value="Enter" onclick="submit()" />
  </div>
  <div id="footer">
    <p>&copy; 2012 Mihai</p>
    <p>Mihai Bulic</p>
</body>
</html>
