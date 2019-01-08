<?php
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

  if ($stage_no == -1)
    $stage_no = "_";
  $file_name = "../datafiles/tmp/$survey_id$stage_no($intv_num)$user_id.dat";
  //echo "$intv_num . ", " . $survey_id . ", " . $stage_no . ", " . $user_id . ", " . $variable . ", " . $value . ", " . $file_name . "<hr>";

  $form_data['start_time'] = "";
  $form_data['end_time'  ] = "";
  $form_data['duration'  ] = "";

//  if ($form_data['stage_no'] == -1) {
    $form_data["tp1_ord"]  = "";
    $form_data["tp1_name"] = "";
    $form_data["tp1_q1"]   = "";
    $form_data["tp1_q2"]   = "";
    $form_data["tp1_q3"]   = "";
    $form_data["tp2_ord"]  = "";
    $form_data["tp2_name"] = "";
    $form_data["tp2_q1"]   = "";
    $form_data["tp2_q2"]   = "";
    $form_data["tp2_q3"]   = "";
    $form_data['q7']       = "";
    $form_data['q8_1']     = "";
    $form_data['q8_2']     = "";
    $form_data['q8_3']     = "";
    $form_data['q8_4']     = "";
    $form_data['q8_5']     = "";
    $form_data['q8_6']     = "";
    $form_data['q8_7']     = "";
    $form_data['q8_8']     = "";
    $form_data['q8_9']     = "";
    $form_data['q8_10']    = "";
    $form_data['q8_11']    = "";
    $form_data['q8_12']    = "";
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
    foreach ($form_data as $key => $value)
      if ($value !== "") {
        if ($lp)
          $json_string .= ", ";
        $json_string .= " \"$key\":\"$value\"";
        $lp++;
      }//if
    $json_string .= " }";

    if (file_exists($file_name . ".used"))
      unlink($file_name . ".used");
    rename($file_name, $file_name . ".used");
  }//if
}//if
echo $json_string;

?>
