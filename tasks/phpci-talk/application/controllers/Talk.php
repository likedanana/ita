<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Talk extends CI_Controller {

  function __construct(){
    parent::__construct();
    $this->load->database();
  }

# 로그인

  public function login(){
    # session
    $this->session->sess_destroy();

    # view
    $this->load->view('talk/login');
  }
  
  public function authentication(){
    # post 
    $id_str = $this->input->post('id_str');
    $password = $this->input->post('password');

    # model
    $this->load->model('talk/user_model');
    $userData = $this->user_model->getUserData($id_str, $password);

    # authenticate & redirection
    $this->load->helper('url');
    if($userData == null){
      $this->load->view('talk/error', array('errorMessage'=>'회원이 아닙니다!'));
    } else {
      $this->session->set_userdata(array(
        'isLogin'=>true, 
        'id'=>$userData->id, 
        'nickname'=>$userData->nickname,
        'liked'=>'[]'
      ));
      redirect('http://localhost/index.php/talk/board');
    }
  }

  public function loginCheck(){
    if(!isset($_SESSION['isLogin'])) $this->load->view('talk/error', array('errorMessage'=>'로그인이 필요합니다!'));
  }

# 게시판
  
  public function board(){
    $this->loginCheck();

    # model
    $this->load->model('talk/post_model');
    $this->load->model('talk/comment_model');
    $headlines = $this->post_model->getHeadlines();
    $commentNums = $this->comment_model->getCommentNums();
    // var_dump($commentNums);

    # view
    $this->load->view('talk/header', array('title'=>'이야기방', 'style'=>'board'));
    $this->load->view('talk/board', array('headlines'=>$headlines, 'commentNums'=>$commentNums));
  }

# 게시글

  public function detail($id){
    $this->loginCheck();
    # model
    $this->load->model('talk/post_model');
    $this->load->model('talk/comment_model');

    # post
    # 새 댓글 추가하기
    if($this->input->post('newComment') != null){
      $comment = $this->input->post('newComment');
      $this->comment_model->insertComment($comment, $id);
    }

    # 댓글 수정하기
    if($this->input->post('editedCommentId') != null){
      $comment_id = $this->input->post('editedCommentId');
      $comment = $this->input->post('editedComment');
      $this->comment_model->updateComment($comment, $comment_id);
    }

    # 댓글 삭제하기
    if($this->input->post('deleteCommentId') != null){
      $comment_id = $this->input->post('deleteCommentId');
      $this->comment_model->deleteComment($comment_id);
    }

    # 좋아요
    if($this->input->post('likeCommentId') != null){
      $comment_id = $this->input->post('likeCommentId');
      $this->comment_model->updateLike($comment_id);

      # session
      $liked = json_decode($_SESSION['liked'], true);
      array_push($liked, $comment_id);
      $_SESSION['liked'] = json_encode($liked);
      // var_dump($_SESSION);
    }

    $post = $this->post_model->getPost($id);
    $comments = $this->comment_model->getComments($id);

    # view
    $this->load->view('talk/header', array('title'=>'이야기방 - '.$post->title, 'style'=>'detail'));
    $this->load->view('talk/detail', array('post'=>$post, 'comments'=>$comments));
  }

  public function delete($id){
    # model
    $this->load->model('talk/post_model');
    $this->load->model('talk/comment_model');
    $this->post_model->deletePost($id);
    $this->comment_model->deleteComments($id);

    # redirection
    $this->load->helper('url');
    redirect('http://localhost/index.php/talk/board');
  }

# 글쓰기

  public function write($id = null) {
    $this->loginCheck();

    # model
    $editPost = null;
    if($id != null){
      $this->load->model('talk/post_model');
      $editPost = $this->post_model->getPostToUpdate($id);
    }

    # view
    $this->load->view('talk/header', array('title'=>'이야기방 - 글 작성하기', 'style'=>'write'));
    $this->load->view('talk/write', array('editPost'=>$editPost));
  }

  public function writePost(){
    # post
    $id = $this->input->post('id');
    $title = $this->input->post('title');
    $content = $this->input->post('content');

    # model
    $this->load->model('talk/post_model');
    if($id == null){
      $id = $this->post_model->insertPost($title, $content);
    }else{
      $this->post_model->updatePost($id, $title, $content);
    }
    
    # redirection
    $this->load->helper('url');
    redirect('http://localhost/index.php/talk/detail/'.$id);
  }
}