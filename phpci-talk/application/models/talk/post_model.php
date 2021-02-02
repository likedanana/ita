<?php
class Post_model extends CI_Model {

  function __construct(){
    parent::__construct();
  }

# board
  public function getHeadlines(){
    $this->db->select('post.id, user_id');
    $this->db->select('user_id');
    $this->db->select('created');
    $this->db->select('title');
    $this->db->select('user.nickname AS nickname');
    $this->db->join('user', 'post.user_id = user.id', 'left');
    $this->db->order_by('id', 'DESC');
    return $this->db->get('post')->result_object();
  }

# detail
  public function getPost($post_id){
    $this->db->select('post.id');
    $this->db->select('user_id');
    $this->db->select('created');
    $this->db->select('title');
    $this->db->select('content');
    $this->db->select('user.nickname AS nickname');
    $this->db->join('user', 'post.user_id = user.id', 'left');
    return $this->db->get_where('post', array('post.id'=>$post_id))->row();
  }

# write
  public function getPostToUpdate($id){
    $this->db->select('id');
    $this->db->select('title');
    $this->db->select('content');
    return $this->db->get_where('post', array('id'=>$id))->row_object();
  }

# write > writePost
  public function insertPost($title, $content){
    $this->db->set('user_id', $_SESSION['id']);
    $this->db->set('title', $title);
    $this->db->set('content', $content);
    $this->db->set('created', 'NOW()', false);
    $this->db->insert('post');
    $this->db->select('id')->order_by('id', 'DESC')->limit(1);
    return $this->db->get('post')->row_object()->id;
  }

  public function updatePost($id, $title, $content){
    $this->db->set('title', $title);
    $this->db->set('content', $content);
    $this->db->set('created', 'NOW()', false);
    $this->db->where('id', $id);
    $this->db->update('post');
  }

# detail > delete
  public function deletePost($id){
    $this->db->delete('post', array('id'=>$id));
  }
}
?>