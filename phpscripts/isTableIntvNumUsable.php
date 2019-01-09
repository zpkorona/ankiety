<?php
//isTableIntvNumUsable.php?user_id=gość&int_no=1
//IF int_no IS -1, RETURNS FIRST waiting____________ int_no FOR GIVEN user_id
//IF int_no IS NOT -1, RETURNS IT IF IT'S waiting____________ OR started____________ AND user_id IS CORRECT
$req_intv_num = -1;
if (array_key_exists('survey_id', $_GET) &&
    array_key_exists('user_id', $_GET) &&
    array_key_exists('int_no',  $_GET)) {
  $survey_id = $_GET['survey_id'];
  $req_user_id  = $_GET['user_id'];
  $req_intv_num = $_GET['int_no'];
  if ($req_user_id == -1) {
    $req_user_id = "#NN#";
  }//if
  if (strlen($req_user_id) == 9 && preg_match("/(AlmWawa\d\d)|(AlmKrak\d\d)|(AlmKato\d\d)|(AlmWroc\d\d)|(AlmGdan\d\d)/", $req_user_id) === 1) {
    $req_user___ = preg_replace("/\d/", ".", $req_user_id);
  }//if
  else {
    $req_user___ = "";
  }//else
  //echo "<hr>req_user_id=$req_user_id, req_intv_num=$req_intv_num<hr>";
  $file_name   = "./$survey_id/datafiles/intvnums_table.txt";
  $waitingstr  = "waiting____________";
  $startedstr  = "started____________";
  $file = @fopen($file_name, "r+");//@fopen($file_name, "r");
  if ($file) {
    flock($file, LOCK_EX);
    $fsize = filesize($file_name);
    $req_intv_num_found = false;
    $req_intv_num_match = false;
    $req_intv_num_fou__ = false;
    $req_intv_num_mat__ = false;
    $file_p__ = -1;
    $file_pos = 0;
    $intv_num = -1;
    $user_id  = -1;
    $status   = -1;
    while (!$req_intv_num_found && !$req_intv_num_match && ($file_pos = ftell($file)) < $fsize) {
      $line = fgets($file);
      parse_str($line, $params);
      if (array_key_exists('intv_num', $params) && array_key_exists('user_id', $params) && array_key_exists('status', $params)) {
        $intv_num = trim($params['intv_num']);
        $user_id  = trim($params['user_id']);
        $status   = trim($params['status']);
        //echo "intv_num=$intv_num, user_id=$user_id, status=$status,<br>";
        if ($req_intv_num != -1 && $req_intv_num === $intv_num) {
          $req_intv_num_found = $req_user_id === $user_id;//true;
          $req_intv_num_match = $req_user_id === $user_id && ($status == $waitingstr || $status == $startedstr);
          if ($file_p__ == -1 && !$req_intv_num_match) {
            $req_intv_num_fou__ = $req_user___ === $user_id;//true;
            $req_intv_num_mat__ = $req_user___ === $user_id && ($status == $waitingstr || $status == $startedstr);
            if ($req_intv_num_mat__) {
              $file_p__ = $file_pos;
            }//if
          }//if
        }//if
        if ($req_intv_num == -1 && $req_user_id === $user_id && $status == $waitingstr) {
          $req_intv_num = $intv_num;
          $req_intv_num_match = true;
        }//if
      }//if
    }//while
    //echo "<hr>req_intv_num=$req_intv_num, req_intv_num_found=$req_intv_num_found, req_intv_num_match=$req_intv_num_match,<hr>";
    if (!$req_intv_num_match) {
      if ($req_intv_num_mat__ && $file_p__ != -1) {
        fseek($file, $file_p__);//to jest zbędne
        fwrite($file, "intv_num=$req_intv_num&user_id=$req_user_id");
      }//if
      else {
        $req_intv_num = -1;
      }//else
    }//if

    flock($file, LOCK_UN);
    fclose($file);
  }//if
  else {
    $req_intv_num = -1;
  }//else
}//if
//echo "<hr>req_intv_num=";
echo $req_intv_num;
//echo ",<hr>";
?>
