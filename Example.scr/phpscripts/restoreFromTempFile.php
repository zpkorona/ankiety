<?php
//useTableIntvNum.php?user_id=gość&int_no=1

//echo "<hr>restoreFromTempFile.php :: ";
//foreach ($_GET as $n => $v)  echo "_GET[$n] = $v<br>";

$json_string = "";

if (array_key_exists('int_no', $_GET) &&
    array_key_exists('survey_id', $_GET) &&
    array_key_exists('stage_no', $_GET) &&
    array_key_exists('user_id', $_GET)) {
  $intv_num  = $_GET['int_no'];
  $survey_id = $_GET['survey_id'];
  $stage_no  = $_GET['stage_no'];
  $user_id   = $_GET['user_id'];

  $form_data['intv_num'  ] = $intv_num;
  $form_data['survey_id' ] = $survey_id;
  $form_data['stage_no'  ] = $stage_no;
  $form_data['user_id'   ] = $user_id;

  if ($stage_no == -1) {
    $stage_no = "_";
  }//if
  $file_name = "../datafiles/tmp/$survey_id$stage_no($intv_num)$user_id.dat";
  //echo "$intv_num . ", " . $survey_id . ", " . $stage_no . ", " . $user_id . ", " . $variable . ", " . $value . ", " . $file_name . "<hr>";

  $form_data['start_time'] = "";
  $form_data['end_time'  ] = "";
  $form_data['duration'  ] = "";

//  if ($form_data['stage_no'] == -1) {
    $form_data['rA_1']  = "";
    $form_data['rA_2']  = "";
    $form_data['rA_3']  = "";
    $form_data['rA_4']  = "";
    $form_data['rA_5']  = "";
    $form_data['rA_6']  = "";
    $form_data['rA_7']  = "";
    $form_data['rA_8']  = "";
    $form_data['rA_9']  = "";
    $form_data['rA_10'] = "";
    $form_data['rA_11'] = "";
    $form_data['rA_12'] = "";
    $form_data['rA_13'] = "";
    $form_data['rA_14'] = "";
    $form_data['rA_15'] = "";
    $form_data['rA_16'] = "";
    $form_data['rAt16'] = "";
    $form_data['rB_1']  = "";
    $form_data['rB_2']  = "";
    $form_data['rB_3']  = "";
    $form_data['rB_4']  = "";
    $form_data['rB_5']  = "";
    $form_data['rB_6']  = "";
    $form_data['rB_7']  = "";
    $form_data['rB_8']  = "";
    $form_data['rB_9']  = "";
    $form_data['rB_10'] = "";
    $form_data['rB_11'] = "";
    $form_data['rB_12'] = "";
    $form_data['rB_13'] = "";
    $form_data['rB_14'] = "";
    $form_data['rB_15'] = "";
    $form_data['rB_16'] = "";
    $form_data['rC']    = "";
    $form_data['rD']    = "";
    $form_data['rE']    = "";
    $form_data['rF']    = "";
    $form_data['rG']    = "";
    $form_data['rH']    = "";
    $form_data['rI_1']  = "";
    $form_data['rI_2']  = "";
    $form_data['rI_3']  = "";
    $form_data['rI_4']  = "";
    $form_data['rI_5']  = "";
    $form_data['rI_6']  = "";
    $form_data['rI_7']  = "";
    $form_data['rI_8']  = "";
    $form_data['rI_9']  = "";
    $form_data['rI_10'] = "";
    $form_data['rI_11'] = "";
    $form_data['rI_12'] = "";
    $form_data['rJ_1']  = "";
    $form_data['rJ_2']  = "";
    $form_data['rJ_3']  = "";
    $form_data['rJ_4']  = "";
    $form_data['rJ_5']  = "";
    $form_data['rJ_6']  = "";
    $form_data['rJ_7']  = "";
    $form_data['rJ_8']  = "";
    $form_data['rJ_9']  = "";
    $form_data['rJ_10'] = "";
    $form_data['rJ_11'] = "";
    $form_data['rJ_12'] = "";
    $form_data['rK']    = "";
    $form_data['rL']    = "";
    $form_data['rM_1']  = "";
    $form_data['rM_2']  = "";
    $form_data['rM_3']  = "";
    $form_data['rM_4']  = "";
    $form_data['rM_5']  = "";
    $form_data['rM_6']  = "";
    $form_data['rM_7']  = "";
    $form_data['rM_8']  = "";
    $form_data['rM_9']  = "";
    $form_data['rM_10'] = "";
    $form_data['rM_11'] = "";
    $form_data['rM_12'] = "";
    $form_data['rN']    = "";
    $form_data['rZ']    = "";
//  }//if

  $file = @fopen($file_name, "r");
  if ($file) {
    flock($file, LOCK_SH);
    $fsize = filesize($file_name);
    //echo "<hr><div class='surveyshow-table'>";
    //echo "<div><div>l.p.</div><div>zmienna</div><div>wartość</div></div>";
    //$lp = 1;
    while (ftell($file) < $fsize && !feof($file)) {
      $line = fgets($file);
      $start = strpos($line, "\"");
      if ($start !== false) {
        $start++;
        $length = strpos($line, "\"", $start) - $start;
        $key = substr($line, $start, $length);
        $start = strpos($line, "\"", $start + $length + 1) + 1;
        $length = strpos($line, "\"", $start) - $start;
        $value = substr($line, $start, $length);
        if (array_key_exists($key, $form_data)) $form_data[$key] = $value;
      }//if
      //echo "<div><div>$lp</div><div>$key</div><div>$value</div></div>";
      //$lp++;
    }//while
    //echo "</div><hr>";
    flock($file, LOCK_UN);
    fclose($file);

    //echo "<hr><div class='surveyshow-table'>";
    //echo "<div><div>l.p.</div><div>zmienna</div><div>wartość</div></div>";
    //$lp = 1;
    //foreach ($form_data as $key => $value) {
    //  echo "<div><div>$lp</div><div>$key</div><div>$value</div></div>";
    //  $lp++;
    //}//foreach
    //echo "</div><hr>";

    $json_string = "{ ";
    $lp = 0;
    foreach ($form_data as $key => $value) {
      if ($value !== "") {
        if ($lp) {
          $json_string .= ", ";
        }//if
        $json_string .= " \"$key\":\"$value\"";
        $lp++;
      }//if
    }//foreach
    $json_string .= " }";

    if (file_exists($file_name . ".used")) {
      unlink($file_name . ".used");
    }//if
    rename($file_name, $file_name . ".used");
  }//if
}//if
echo $json_string;

?>
