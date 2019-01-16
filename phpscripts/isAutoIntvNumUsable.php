<?php
//isAutoIntvNumUsable.php?user_id=gość&int_no=1
//creates the intvnums_autoi.txt file if it doen't exist
//IF int_no IS -1, RETURNS FIRST waiting____________ OR FREE int_no FOR GIVEN user_id
//IF int_no IS NOT -1, RETURNS IT IF IT'S waiting____________ AND user_id IS CORRECT OR FIRST NOT USED NUMBER

$logfile = fopen("php-calls.log", "a+");
if ($logfile) {
  flock($logfile, LOCK_EX);
  fwrite($logfile, date("Y-m-d H:i:s") . ": " . $_SERVER['REMOTE_ADDR'] . "/" . $_SERVER['PHP_SELF'] . "?" . urldecode($_SERVER['QUERY_STRING']) . "\n");
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
  $file_name  = "../$survey_id/datafiles/intvnums_autoi.txt";
  $waitingstr = "waiting____________";
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
    $all_inums_cnt = 0;
    $all_intv_nums = [0];
    $max_intv_num = 0;
    $used_inums_cnt = 0;
    $used_intv_nums = [0];
    while (!$req_intv_num_match && ($file_pos = ftell($file)) < $fsize) {
      $line = fgets($file);
      parse_str($line, $params);
      if (array_key_exists('intv_num', $params) && array_key_exists('user_id', $params) && array_key_exists('status', $params)) {
        $intv_num = trim($params['intv_num']);
        $user_id  = trim($params['user_id']);
        $status   = trim($params['status']);
        //echo "intv_num=$intv_num, user_id=$user_id, status=$status,<br>";
        if ($req_intv_num != -1 && $req_intv_num === $intv_num) {
          $req_intv_num_found = true;
          $req_intv_num_match = $req_user_id === $user_id && $status === $waitingstr;//|| $status == $startedstr);
        }//if
        $all_intv_nums[$all_inums_cnt++] = $intv_num;
        if ($req_user_id !== $user_id || $status !== $waitingstr) {
          $used_intv_nums[$used_inums_cnt++] = $intv_num;
        }//if
        if ($max_intv_num < $intv_num) {
          $max_intv_num = $intv_num;
        }//if
      }//if
    }//while
    //echo "<hr />req_intv_num_match=$req_intv_num_match, req_intv_num_found=$req_intv_num_found, max_intv_num=$max_intv_num, all_inums_cnt=$all_inums_cnt, used_inums_cnt=$used_inums_cnt,<br>"; echo "all_intv_nums="; var_dump($all_intv_nums); echo "<br />"; echo "used_intv_nums="; var_dump($used_intv_nums); echo "<hr />";

    if (!$req_intv_num_match) {
      if ($req_intv_num == -1 || $req_intv_num_found) {
        $req_intv_num = $used_inums_cnt == 0? 1 : $max_intv_num + 1;
        if ($used_inums_cnt == 1 && 1 < $max_intv_num) {
          $req_intv_num = 1 < $used_intv_nums[0]? 1 : 2;//$max_intv_num;
        }//if
        if (1 < $used_inums_cnt && sort($used_intv_nums)) {
          $req_intv_num = 1;
          for ($i = 0; $i < $used_inums_cnt && $used_intv_nums[$i] <= $req_intv_num; $i++) {
            $req_intv_num = $used_intv_nums[$i] + 1;
          }//for
        }//if
        for ($i = 0; $i < $all_inums_cnt && $all_intv_nums[$i] != $req_intv_num; $i++);
        if ($i == $all_inums_cnt) {
          fwrite($file, "intv_num=$req_intv_num&user_id=$req_user_id&status=$waitingstr\n");
        }//if
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
//echo "<hr>req_intv_num=";
echo $req_intv_num;
//echo ",<hr>";
?>
