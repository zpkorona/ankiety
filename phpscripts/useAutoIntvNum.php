<?php
//useAutoIntvNum.php?user_id=gość&int_no=1
//creates the intvnums_autoi.txt file if it doen't exist
//int_no MUST NOT BE -1
//RETURNS int_no IF IT'S waiting____________/NOT USED AND user_id IS CORRECT
//  SETS FOUND TO started____________
$req_intv_num = -1;
if (array_key_exists('user_id', $_GET) &&
    array_key_exists('int_no',  $_GET)) {
  $req_user_id  = $_GET['user_id'];
  $req_intv_num = $_GET['int_no'];
  if ($req_user_id == -1)
    $req_user_id = "#NN#";
  //echo "<hr>req_user_id=$req_user_id, req_intv_num=$req_intv_num<hr>";
  if (!file_exists("../datafiles"))
    @mkdir("../datafiles");
  $file_name   = "../datafiles/intvnums_autoi.txt";
  $waitingstr  = "waiting____________";
  $startedstr  = "started____________";
  if ($req_intv_num != -1) {
    if (file_exists($file_name)) {
      $file = @fopen($file_name, "r+");
    }//if
    else {
      $file = @fopen($file_name, "c+");
    }//else

    if ($file) {
      flock($file, LOCK_EX);
      $fsize = filesize($file_name);
      $req_intv_num_found = false;
      $req_intv_num_match = false;
      $file_pos = 0;
      $intv_num = -1;
      $user_id  = -1;
      $status   = -1;
      while (!$req_intv_num_match && ($file_pos = ftell($file)) < $fsize) {
        $line = fgets($file);
        parse_str($line, $params);
        if (array_key_exists('intv_num', $params) && array_key_exists('user_id', $params) && array_key_exists('status', $params)) {
          $intv_num = trim($params['intv_num']);
          $user_id  = trim($params['user_id']);
          $status   = trim($params['status']);
          if ($req_intv_num === $intv_num) {
            $req_intv_num_found = true;//$req_user_id === $user_id;
            $req_intv_num_match = $req_user_id === $user_id && $status == $waitingstr;
          }//if
        }//if
      }//while
      if ($req_intv_num_match) {
        fseek($file, $file_pos);
        fwrite($file, "intv_num=$req_intv_num&user_id=$req_user_id&status=$startedstr\n");
      }//if
      else {
        if ($req_intv_num_found) {
          $req_intv_num = -1;
        }//if
        else {
          fwrite($file, "intv_num=$req_intv_num&user_id=$req_user_id&status=$startedstr\n");
        }//else
      }//else
      flock($file, LOCK_UN);
      fclose($file);
    }//if
    else {
      $req_intv_num = -1;
    }//else
  }//if
}//if
//echo "<hr>req_intv_num=";
echo $req_intv_num;
//echo ",<hr>";
?>
