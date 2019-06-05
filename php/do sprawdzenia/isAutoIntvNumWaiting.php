<?php
//isAutoIntvNumWaiting.php?user_id=gość&int_no=1
//creates the intvnums_autoi.txt file if it doen't exist
//int_no MUST NOT BE -1
//RETURNS int_no IF IT'S waiting____________ AND user_id IS CORRECT
//RETURNS int_no IF IT'S NOT FOUND, AND ADDS IT AT THE END

$logfile = fopen("php-call.log", "a+");
if ($logfile) {
  flock($logfile, LOCK_EX);
  fwrite($logfile, date("Y-m-d H:i:s") . ": " . $_SERVER['REMOTE_ADDR'] . "/" . $_SERVER['PHP_SELF'] . "?" . $_SERVER['QUERY_STRING'] . "\n");
  flock($logfile, LOCK_UN);
  fclose($logfile);
}//if

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
  //echo "<hr>req_user_id=$req_user_id, req_intv_num=$req_intv_num<hr>";

  if ($req_intv_num != -1) {
    $file_name   = "../$survey_id/datafiles/intvnums_autoi.txt";
    $waitingstr  = "waiting____________";
    if (!file_exists("../$survey_id/datafiles")) {
      @mkdir("../$survey_id/datafiles");
    }//if
  	if (file_exists($file_name)) {
     	 $file = @fopen($file_name, "r+");
    }//if
    else {
      $file = @fopen($file_name, "w+");
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

      if (!$req_intv_num_match) {
        if ($req_intv_num_found) {
          $req_intv_num = -1;
        }//if
        else {
          fwrite($file, "intv_num=$req_intv_num&user_id=$req_user_id&status=$waitingstr\n");
        }//else
      }//if
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
