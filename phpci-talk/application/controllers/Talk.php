<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Talk extends CI_Controller {

  function __construct(){
    parent::__construct();
    $this->load->database();
  }

  public function index(){
    # model
    $this->load->model('talk/post_model');
    $this->load->model('talk/comment_model');
    $headlines = $this->post_model->getHeadlines();
    $commentNums = $this->comment_model->getCommentNums();

    # view
    $this->load->view('talk/header', array('title'=>'이야기방', 'style'=>'board'));
    $this->load->view('talk/board', array('headlines'=>$headlines, 'commentNums'=>$commentNums));
  }

  public function detail($id){  
    # model
    $this->load->model('talk/post_model');
    $this->load->model('talk/comment_model');


    # 새로운 댓글 표시
    if($this->input->post('comment') != null){
      $comment = $this->input->post('comment');
      $this->comment_model->insertComment($comment, $id);
    }

    # 좋아요 클릭
    if($this->input->post('commentId') != null){
      $commentId = $this->input->post('commentId');
      $data = $this->comment_model->setLike($commentId);
    }

    $post = $this->post_model->getPost($id);
    $comments = $this->comment_model->getComments($id);

    # view
    $this->load->view('talk/header', array('title'=>'이야기방 - '.$post->title, 'style'=>'detail'));
    $this->load->view('talk/detail', array('post'=>$post, 'comments'=>$comments));
  }

  public function write() {
    #view
    $this->load->view('talk/header', array('title'=>'이야기방 - 글 작성하기', 'style'=>'write'));
    $this->load->view('talk/write');
  }

  public function insertPost(){
    # get post data 
    $title = $this->input->post('title');
    $content = $this->input->post('content');

    # model
    $this->load->model('talk/post_model');
    $id = $this->post_model->insertPost($title, $content);

    # redirection
    $this->load->helper('url');
    redirect('http://localhost/index.php/talk/detail/'.$id);
  }
}