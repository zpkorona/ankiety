<?php
//isM_TabIntvNumStarted.php?user_id=xyz14&int_no=014&stage_no=1
//ALL ARGUMENTS MUST BE SET
//RETURNS int_no IF IT'S started____________ FOR GIVEN user_id AND stage_no

$logfile = fopen("php-calls.log", "a+");
if ($logfile) {
  flock($logfile, LOCK_EX);
  fwrite($logfile, date("Y-m-d H:i:s") . ": " . $_SERVER['REMOTE_ADDR'] . "/" . $_SERVER['PHP_SELF'] . "?" . urldecode($_SERVER['QUERY_STRING']) . "\n");
  flock($logfile, LOCK_UN);
  fclose($logfile);
}//if

$req_intv_num = -1;
if (array_key_exists('survey_id', $_GET) &&
    array_key_exists('user_id',  $_GET) &&
    array_key_exists('int_no',   $_GET) &&
    array_key_exists('stage_no', $_GET)) {
  $survey_id = $_GET['survey_id'];
  $req_user_id  = $_GET['user_id'];
  $req_intv_num = $_GET['int_no'];
  $req_stage_no = $_GET['stage_no'];
  //echo "<hr>$req_user_id, $req_intv_num, $req_stage_no<hr>";
  $file_name   = "../$survey_id/datafiles/intvnums_m_tab.txt";
  $startedstr  = "started____________";
  if ($req_user_id  != -1 && $req_intv_num != -1 && 0 < $req_stage_no && $req_stage_no < 11) {
    $file = @fopen($file_name, "r");
    if ($file) {
      flock($file, LOCK_SH);
      $fsize = filesize($file_name);
      $req_intv_num_match = false;
      $req_intv_num_found = false;
      $file_pos = 0;
      $intv_num = -1;
      $user_id  = -1;
      $statusN = "status$req_stage_no";
      while (!$req_intv_num_found && !$req_intv_num_match && ($file_pos = ftell($file)) < $fsize) {
        $line = fgets($file);
        parse_str($line, $params);
        if (array_key_exists('intv_num', $params) && array_key_exists('user_id', $params)) {
          $intv_num = trim($params['intv_num']);
          $user_id  = trim($params['user_id']);
          if ($req_intv_num === $intv_num) {
            $req_intv_num_found = true;
            //echo "$intv_num, $user_id, $statusN,<hr>";
            if ($req_user_id === $user_id && array_key_exists($statusN, $params)) {
              $req_intv_num_match = trim($params[$statusN]) == $startedstr;
            }//if
          }//if
        }//if
      }//while
      if (!$req_intv_num_match) {
        $req_intv_num = -1;
      }//if
      flock($file, LOCK_UN);
      fclose($file);
    }//if
    else {
      $req_intv_num = -1;
    }//else
  }//if
  else {
    $req_intv_num = -1;
  }//else
}//if
//echo "<hr>req_intv_num=";
echo $req_intv_num;
//echo ",<hr>";
?>
