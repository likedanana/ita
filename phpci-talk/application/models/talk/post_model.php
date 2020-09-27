<?php
class Post_model extends CI_Model {

  function __construct(){
    parent::__construct();
  }

  public function getHeadlines(){
    $this->db->select('id');
    $this->db->select('writer');
    $this->db->select('UNIX_TIMESTAMP(created) AS created');
    $this->db->select('title');
    $this->db->order_by('id', 'DESC');
    return $this->db->get('post')->result();
  }

  public function getPost($post_id){
    $this->db->select('id');
    $this->db->select('writer');
    $this->db->select('UNIX_TIMESTAMP(created) AS created');
    $this->db->select('title');
    $this->db->select('content');
    return $this->db->get_where('post', array('id'=>$post_id))->row();
  }

  public function insertPost($title, $content){
    $this->db->set('title', $title);
    $this->db->set('content', $content);
    $this->db->set('created', 'NOW()', false);
    $this->db->insert('post');
    $this->db->select('id')->order_by('id', 'DESC')->limit(1);
    return $this->db->get('post')->row()->id;
  }
}
?>