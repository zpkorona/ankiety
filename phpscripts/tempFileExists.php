<?php
//tempFileExists.php?int_no=1001&survey_id=Example.scr&stage_no=-1&user_id=Zbyszek
$intv_num = -1;
if (array_key_exists('int_no', $_GET) &&
    array_key_exists('survey_id', $_GET) &&
    array_key_exists('stage_no', $_GET) &&
    array_key_exists('user_id', $_GET)) {
  $intv_num  = $_GET['int_no'];
  $survey_id = $_GET['survey_id'];
  $stage_no  = $_GET['stage_no'];
  if ($stage_no == -1) $stage_no = "_";
  $user_id   = $_GET['user_id'];
  if (!file_exists("../datafiles")) {
    @mkdir("../datafiles");
  }//if
  if (!file_exists("../datafiles/tmp")) {
    @mkdir("../datafiles/tmp");
  }//if
  $file_name = "../datafiles/tmp/$survey_id$stage_no($intv_num)$user_id.dat";
  if (!file_exists($file_name) || !filesize($file_name)) {
    $intv_num = -1;
  }//if
}//if
echo $intv_num;
?>
