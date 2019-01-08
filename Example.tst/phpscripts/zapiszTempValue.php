<?php
//zapiszTempValue.php ....
//echo "<hr>saveData2disk.php, " . $_SERVER['PHP_SELF'] . "<hr>";
//foreach ($_GET as $n => $v)  echo "_GET[$n] = $v<br>";
if (array_key_exists('int_no', $_GET) &&
    array_key_exists('survey_id', $_GET) &&
    array_key_exists('stage_no', $_GET) &&
    array_key_exists('user_id', $_GET) &&
    array_key_exists('var', $_GET) &&
    array_key_exists('val', $_GET) &&
    array_key_exists('opq', $_GET)) {
  $intv_num  = $_GET['int_no'];
  $survey_id = $_GET['survey_id'];
  $stage_no  = $_GET['stage_no'];
  if ($stage_no == -1) {
    $stage_no = "_";
  }//if
  $user_id   = $_GET['user_id'];
  $variable  = $_GET['var'];
  $value     = $_GET['val'];
  $openQuest = $_GET['opq'];
  if (!file_exists("../datafiles")) {
    @mkdir("../datafiles");
  }//if
  if (!file_exists("../datafiles/tmp")) {
    @mkdir("../datafiles/tmp");
  }//if
  $file_name = "../datafiles/tmp/$survey_id$stage_no($intv_num)$user_id.dat";
  $file = @fopen($file_name, "a");
  //echo "<hr>" . $intv_num . ", " . $survey_id . ", " . $stage_no . ", " . $user_id . ", " . $variable . ", " . $value . ", " . $openQuest . " :: " . $file_name . "<hr>";
  if ($file) {
    flock($file, LOCK_EX);
    if ($openQuest) {
      $find    = array("\"", "\\", ";", "\r\n", "\r", "\n");
      $replace = array("'",  "/",  ".", ", ",   ", ", ", ");
      $value = str_replace($find, $replace, trim($value));
    }
    fputs($file, "\"$variable\"=\"$value\"\n");
    flock($file, LOCK_UN);
    fclose($file);
  }//if
}//if
?>
