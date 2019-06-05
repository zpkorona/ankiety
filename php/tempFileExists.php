<?php
//tempFileExists.php?int_no=1001&survey_id=Example.scr&stage_no=-1&user_id=Zbyszek

$logfile = fopen("php-calls.log", "a+");
if ($logfile) {
  flock($logfile, LOCK_EX);
  fwrite($logfile, date("Y-m-d H:i:s") . ": " . $_SERVER['REMOTE_ADDR'] . "/" . $_SERVER['PHP_SELF'] . "?" . urldecode($_SERVER['QUERY_STRING']) . "\n");
  flock($logfile, LOCK_UN);
  fclose($logfile);
}//if

$intv_num = -1;
if (array_key_exists('survey_id', $_GET) &&
    array_key_exists('int_no', $_GET) &&
    array_key_exists('stage_no', $_GET) &&
    array_key_exists('user_id', $_GET)) {
  $survey_id = $_GET['survey_id'];
  $intv_num  = $_GET['int_no'];
  $stage_no  = $_GET['stage_no'];
  if ($stage_no == -1) $stage_no = "_";
  $user_id   = $_GET['user_id'];
  if (!file_exists("../$survey_id/data")) {
    @mkdir("../$survey_id/data");
  }//if
  if (!file_exists("./$survey_id/data/tmp")) {
    @mkdir("../$survey_id/data/tmp");
  }//if
  $file_name = "../$survey_id/data/tmp/$survey_id$stage_no($intv_num)$user_id.dat";
  if (!file_exists($file_name) || !filesize($file_name)) {
    $intv_num = -1;
  }//if
}//if
echo $intv_num;
?>
