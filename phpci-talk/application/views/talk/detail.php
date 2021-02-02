  <section class="container">
    <article class="detail">
      <!-- Headline -->
      <div class="headline">
        <div class="flexbox">
          <div class="write"><?=$post->nickname?> <?=date("o-m-d",strtotime($post->created))?></div>
          <div class="empty"></div>
<?php
if($post->user_id == $_SESSION['id']) {
?>
          <div class="my">
            <a class="roundbtn" href="/index.php/talk/write/<?=$post->id?>">수정</a>  
            <a class="roundbtn delete" href="/index.php/talk/delete/<?=$post->id?>" onclick="return confirm('정말 삭제하시겠습니까?')">삭제</a> 
          </div>
<?php
}
?>
        </div>
        <div class="title"><?=$post->title?></div>
      </div>
      <!-- Content -->
      <div class="content"><?=$post->content?></div>
      <a class="back" href="/index.php/talk/board">뒤로</a>
    </article>
    <!-- Comments -->
    <article class="comments">
      <span class="title">댓글 <span class="num"><?=count($comments)?></span></span>
      <!-- Comment -->
<?php
foreach($comments as $comment){
?>
    <article class="comment">
      <div class="flexbox">
        <div class="writer"><?=$comment->nickname?> <span class="created"><?=date("o-m-d H:i:s", strtotime($comment->created))?></span></div>
        <div class="empty"></div>
<?php
if($_SESSION['id'] == $comment->user_id){
?>
        <div class="my">
          <button class="roundbtn edit" id="edit-comment" data-editing="false">수정</button>
          <button class="roundbtn" id="delete-comment" data-id="<?=$comment->id?>">삭제</button>
        </div>
<?php
}
?>
      </div>
      <!-- Comment Content -->
      <div class="content"><?=$comment->content?></div>

      <form action="<?=$post->id?>" class="comment-form edit-form" method="post">
        <textarea name="editedComment" cols="30" rows="4"></textarea>
        <input type="hidden" name="editedCommentId" value="<?=$comment->id?>">
        <input type="submit" value="등록" id="edit-submit">
      </form>

      <div class="align-right"><button class="like" id="like" data-id="<?=$comment->id?>"><?=$comment->likes?></button></div>
    </article>
<?php
}
?>
      <!-- Comment Form -->
      <form action="<?=$post->id?>" method="post" class="comment-form">
        <textarea name="newComment" id="new-comment" cols="30" rows="4"></textarea>
        <div class="flex">
          <span class="writer"><?=$_SESSION['nickname']?></span>
          <input type="submit" value="등록" id="submit">
        </div>
      </form>
    </article>
  </section>
  <script>

    // 새로운 댓글 유효성검사
    const submitInput = document.querySelector('#submit');
    const commentTextarea = document.querySelector('#new-comment');
    submitInput.onclick = function(){
      if(commentTextarea.value == ''){
        alert('댓글을 입력하세요!');
        return false;
      }
    };

    // 댓글 컨테이너 onclik 함수(이벤트 위임)
    const comments = document.querySelector('.comments');
    comments.onclick = function(event){
      let target = event.target;

      // 좋아요 중복 확인 후 submit
      if(target.getAttribute('id') == 'like'){
        let likedArr = JSON.parse('<?=$_SESSION['liked']?>');
        let liked = false;
        likedArr.forEach(function(likedId){
          if(target.dataset.id == likedId){ 
            liked = true;
            return;
          }
        });

        if(liked){
          alert('이미 좋아요를 누른 댓글입니다.');
        } else {
          submitForm(target, 'likeCommentId', '추천되었습니다.'); 
        }
      }

      // 댓글 수정 토글
      if(target.getAttribute('id') == 'edit-comment'){
        const commentDiv = target.parentElement.parentElement.nextElementSibling;
        const commentEditForm = commentDiv.nextElementSibling;
        const commentEditTextarea = commentEditForm.firstElementChild;
        
        if(target.dataset.editing == 'false'){
          target.dataset.editing = 'true';
          commentDiv.style.display = 'none';
          commentEditForm.style.display = 'block';
          commentEditTextarea.value = commentDiv.innerHTML;
        }else{
          target.dataset.editing = 'false';
          commentDiv.style.display = 'block';
          commentEditForm.style.display = 'none';
        }
      }

      // 수정된 댓글 유효성 검사
      if(target.getAttribute('id') == 'edit-submit'){
        const commentTextarea = target.previousElementSibling.previousElementSibling;
        if(commentTextarea.value == ''){
          alert('수정할 댓글을 입력하세요!');
          return false;
        }
      }

      // 댓글 삭제
      if(target.getAttribute('id') == 'delete-comment'){
        submitForm(target, 'deleteCommentId', '삭제되었습니다.');
      }
    }

    function submitForm(target, name, alertMessage){
      let form = document.createElement('form');
      form.method = 'post';
      form.action = '<?=$post->id?>';
      
      let input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', name);
      input.setAttribute('value', target.dataset.id);
      
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();

      alert(alertMessage);
    }

 </script>
</body>
</html>