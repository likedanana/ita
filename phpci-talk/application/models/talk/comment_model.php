<?php
class Comment_model extends CI_Model {

  function __construct(){
    parent::__construct();
  }

  public function getComments($post_id){
    $this->db->select('id');
    $this->db->select('writer');
    $this->db->select('UNIX_TIMESTAMP(created) AS created');
    $this->db->select('content');
    $this->db->select('likes');
    return $this->db->get_where('comment', array('post_id'=>$post_id))->result();
  }

  public function getCommentNums(){
    $this->db->select('post_id, count(*) as count')->group_by('post_id');
    return $this->db->get('comment')->result();
  }

  public function insertComment($content, $post_id){
    $this->db->set('content', $content);
    $this->db->set('created', 'NOW()', false);
    $this->db->set('post_id', $post_id);
    $this->db->insert('comment');
  }

  public function setLike($commentId){
    # update like
    $this->db->set('likes', 'likes+1', false);
    $this->db->where('id', $commentId);
    $this->db->update('comment');
    return $this->db->get_where('comment', array('id'=>$commentId))->row()->likes;
  }
}
?>