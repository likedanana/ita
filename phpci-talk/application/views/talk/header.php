<!DOCTYPE html>
<html lang="kr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" type="text/css" href="/style/root.css">
  <link rel="stylesheet" type="text/css" href="/style/<?=$style?>.css">
  <title><?=$title?></title>
</head>
<body>
  <header><span class="nickname"><?=$_SESSION['nickname']?>님</span><button class="logout">로그아웃</button></header>
  <nav>
    <ul>
      <li><a href="">학과공지</a></li>
      <li><a href="">교육강좌</a></li>
      <li><a href="">기술정보</a></li>
      <li><a href="">문의하기</a></li>
      <li><a href="" class="clicked">이야기방</a></li>
      <li><a href="">Moodle</a></li>
    </ul>
  </nav>
  <script>
    document.querySelector('.logout').addEventListener('click', function(){
      window.location.href = 'http://localhost/index.php/talk/login';
    });
  </script>