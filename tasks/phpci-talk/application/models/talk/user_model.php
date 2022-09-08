<?php
class User_model extends CI_Model {

  function __construct(){
    parent::__construct();
  }

# login > authentication
  public function getUserData($id_str, $password){
    $this->db->select('id, nickname');
    return $this->db->get_where('user', array('id_str'=>$id_str, 'password'=>$password))->row_object();
  }
}
?>