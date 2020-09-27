  <section class="container">
    <article class="detail">
      <div class="write"><?=$post->writer?> <?=date("o-m-d",$post->created)?></div>
      <div class="title"><?=$post->title?></div>
      <div class="content"><?=$post->content?></div>
      <a href="/index.php/talk">뒤로</a>
    </article>
    <article class="comments">
      <span class="title">댓글 <span class="num"><?=count($comments)?></span></span>
<?php
foreach($comments as $comment){
?>
      <article class="comment">
        <div class="writer"><?=$comment->writer?> <span class="created"><?=date("o-m-d H:i:s", $comment->created)?></span></div>
        <div class="content"><?=$comment->content?></div>
        <div class="align"><button class="like" data-id="<?=$comment->id?>"><?=$comment->likes?></button></div>
      </article>
<?php
}
?>
      <form action="<?=$post->id?>" method="post" class="comment-form">
        <textarea name="comment" cols="30" rows="4"></textarea>
        <div class="flex">
          <span class="writer">내닉네임</span>
          <input type="submit" value="등록">
        </div>
      </form>
    </article>
  </section>
  <script>
    // 댓글 유효성검사
    const submitInput = document.querySelector('input[type="submit"]');
    const commentTextarea = document.querySelector('textarea');
    
    submitInput.onclick = function(){
      if(commentTextarea.value == ''){
        alert('댓글을 입력하세요!');
        return false;
      }
    };

    // 좋아요 submit
    let comments = document.querySelector('.comments');
    comments.onclick = function(event){
      let target = event.target;
      if(target.tagName != 'BUTTON') return;

      // if(target.value == 'clicked') {alert('이미 추천되었습니다.'); return}
      // target.value = 'clicked';
      // target.innerHTML++;

      let likeForm = document.createElement('form');
      likeForm.method = 'post';
      likeForm.action = '<?=$post->id?>';
      
      let likeInput = document.createElement('input');
      likeInput.setAttribute('type', 'hidden');
      likeInput.setAttribute('name', 'commentId');
      likeInput.setAttribute('value', target.dataset.id);
      
      likeForm.appendChild(likeInput);
      document.body.appendChild(likeForm);
      likeForm.submit();      

      alert('추천 되었습니다.');
    }
 </script>
</body>
</html>