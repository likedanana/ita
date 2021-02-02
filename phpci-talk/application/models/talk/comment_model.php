<?php
class Comment_model extends CI_Model {
  
  function __construct(){
    parent::__construct();
  }

# board
  public function getCommentNums(){
    $this->db->select('post_id, count(*) as count')->group_by('post_id');
    return $this->db->get('comment')->result_object();
  }

# detail
  public function getComments($post_id){
    $this->db->select('comment.id');
    $this->db->select('user_id');
    $this->db->select('created');
    $this->db->select('content');
    $this->db->select('likes');
    $this->db->select('user.nickname AS nickname');
    $this->db->join('user', 'comment.user_id = user.id', 'left');
    return $this->db->get_where('comment', array('post_id'=>$post_id))->result_object();
  }

  public function insertComment($content, $post_id){
    $this->db->set('content', $content);
    $this->db->set('created', 'NOW()', false);
    $this->db->set('post_id', $post_id);
    $this->db->set('user_id', $_SESSION['id']);
    $this->db->insert('comment');
  }

  public function updateComment($content, $id){
    $this->db->set('content', $content);
    $this->db->set('created', 'NOW()', false);
    $this->db->where('id', $id);
    $this->db->update('comment');
  }

  public function deleteComment($id){
    $this->db->delete('comment', array('id'=>$id));
  }
  
  public function updateLike($id){
    $this->db->set('likes', 'likes+1', false);
    $this->db->where('id', $id);
    $this->db->update('comment');
  }

# detail > delete
  public function deleteComments($post_id){
    $this->db->delete('comment', array('post_id'=>$post_id));
  }
}
?>