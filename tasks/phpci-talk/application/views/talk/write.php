  <form action="http://localhost/index.php/talk/writePost" method="POST" class="container">
    <input type="text" name="title" placeholder="제목을 입력해주세요.">
    <textarea name="content" cols="30" rows="10"></textarea>
    <input type="hidden" name="id">
    <input type="submit" value="등록하기">
  </form>
  <script>
    const titleInput = document.querySelector('input[type="text"]');
    const contentTextarea = document.querySelector('textarea');
    const idInput = document.querySelector('input[type="hidden"]');
    
    // 글 수정 시
    <?php
      if($editPost != null){
        echo 'titleInput.value = "'.$editPost->title.'";';
        echo 'contentTextarea.value = "'.$editPost->content.'";';
        echo 'idInput.value = "'.$editPost->id.'";';
      }
    ?>

    // 유효성검사
    const submitInput = document.querySelector('input[type="submit"]');

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