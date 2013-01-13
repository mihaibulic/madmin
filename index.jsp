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
    <div id="login">
      <input type="button" value="Start" onclick="start_click()" />
      <input type="button" value="Right" onclick="answer(1)" />
      <input type="button" value="Wrong" onclick="answer(-1)" />
      <input type="text" id="answer" style="display:hidden"/>
    </div>
    <div id="game">
      <canvas width="750" height="1250" id="cnv">Error: can't display canvas. Download the lastest version of Chrome for free.</canvas>
    </div>
  </div>
  <div id="footer">
    <p>&copy; 2012 Mihai</p>
    <p>Mihai Bulic</p>
</body>
</html>
