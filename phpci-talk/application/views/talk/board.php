  <article class="board container">
    <ul>
<?php
  foreach($headlines as $entry){
?>
  <li>
    <a href="talk/detail/<?=$entry->id?>">
      <span><?=$entry->id?></span>
      <span><?=$entry->title?> <span class="comment">
<?php
  foreach($commentNums as $num)
    if($num->post_id == $entry->id) echo '('.$num->count.')';
?>
      </span></span>
      <span><?=$entry->writer?></span>
      <span><?=date("o-m-d", $entry->created)?></span>
    </a>
  </li> 
<?php
  }
?>
    </ul>
    <a href="talk/write" class="write">글쓰기</a>
  </article>
</body>
</html>