  <article class="board container">
    <ul>
<?php
  foreach($headlines as $entry){
?>
  <li>
    <a href="detail/<?=$entry->id?>">
      <span><?=$entry->id?></span>
      <span><?=$entry->title?> <span class="comment">
<?php
  foreach($commentNums as $num)
    if($num->post_id == $entry->id) echo '('.$num->count.')';
?>
      </span></span>
      <span><?=$entry->nickname?></span>
      <span><?=date("o-m-d", strtotime($entry->created));
      ?></span>
    </a>
  </li> 
<?php
  }
?>
    </ul>
    <a href="write" class="write">글쓰기</a>
  </article>
</body>
</html>