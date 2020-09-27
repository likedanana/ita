  <form action="insertPost" method="POST" class="container">
    <input type="text" name="title" placeholder="제목을 입력해주세요.">
    <textarea name="content" cols="30" rows="10"></textarea>
    <input type="submit" value="등록하기">
  </form>
  <script>
    const submitInput = document.querySelector('input[type="submit"]');
    const titleInput = document.querySelector('input[type="text"]');
    const contentTextarea = document.querySelector('textarea');

    submitInput.onclick = function(){
      if(titleInput.value == '') {
        alert('제목을 입력하세요!');
        return false;
      }
      if(contentTextarea.value == ''){
        alert('내용을 입력하세요!');
        return false;
      }
    };
  </script>
</body>
</html>