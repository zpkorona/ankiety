<?php
//echo "<hr>saveData2disk.php, " . $_SERVER['PHP_SELF'] . "<hr>";
//foreach ($_POST as $n => $v)  echo "_POST[$n] = $v<br>";

if (array_key_exists('intv_num'  , $_POST) &&
    array_key_exists('survey_id' , $_POST) &&
    array_key_exists('stage_no'  , $_POST) &&
    array_key_exists('user_id'   , $_POST) &&
    array_key_exists('start_time', $_POST) &&
    array_key_exists('end_time'  , $_POST) &&
    array_key_exists('duration'  , $_POST)) {
  $form_data['intv_num'  ] = $_POST['intv_num'  ];
  $form_data['survey_id' ] = $_POST['survey_id' ];
  $form_data['stage_no'  ] = $_POST['stage_no'  ];
  $form_data['user_id'   ] = $_POST['user_id'   ];
  $form_data['start_time'] = $_POST['start_time'];
  $form_data['end_time'  ] = $_POST['end_time'  ];
  $form_data['duration'  ] = $_POST['duration'  ];

  $find    = array("\"", "\\", ";", "\r\n", "\r", "\n");
  $replace = array("'",  "/",  ".", ", ",   ", ", ", ");

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

  //foreach($_POST as $name => $value)
  //  $form_data[$name] = $value;

//ZAMIANA
//^    \$form_data\[('.*')\] += "";
//    if (array_key_exists($1,  $_POST)) $form_data[$1]  = $_POST[$1];
    if (array_key_exists('rA_1',  $_POST)) $form_data['rA_1']  = $_POST['rA_1'];
    if (array_key_exists('rA_2',  $_POST)) $form_data['rA_2']  = $_POST['rA_2'];
    if (array_key_exists('rA_3',  $_POST)) $form_data['rA_3']  = $_POST['rA_3'];
    if (array_key_exists('rA_4',  $_POST)) $form_data['rA_4']  = $_POST['rA_4'];
    if (array_key_exists('rA_5',  $_POST)) $form_data['rA_5']  = $_POST['rA_5'];
    if (array_key_exists('rA_6',  $_POST)) $form_data['rA_6']  = $_POST['rA_6'];
    if (array_key_exists('rA_7',  $_POST)) $form_data['rA_7']  = $_POST['rA_7'];
    if (array_key_exists('rA_8',  $_POST)) $form_data['rA_8']  = $_POST['rA_8'];
    if (array_key_exists('rA_9',  $_POST)) $form_data['rA_9']  = $_POST['rA_9'];
    if (array_key_exists('rA_10', $_POST)) $form_data['rA_10'] = $_POST['rA_10'];
    if (array_key_exists('rA_11', $_POST)) $form_data['rA_11'] = $_POST['rA_11'];
    if (array_key_exists('rA_12', $_POST)) $form_data['rA_12'] = $_POST['rA_12'];
    if (array_key_exists('rA_13', $_POST)) $form_data['rA_13'] = $_POST['rA_13'];
    if (array_key_exists('rA_14', $_POST)) $form_data['rA_14'] = $_POST['rA_14'];
    if (array_key_exists('rA_15', $_POST)) $form_data['rA_15'] = $_POST['rA_15'];
    if (array_key_exists('rA_16', $_POST)) $form_data['rA_16'] = $_POST['rA_16'];
    if (array_key_exists('rAt16', $_POST)) $form_data['rAt16'] = str_replace($find, $replace, trim($_POST['rAt16']));
    if (array_key_exists('rB_1',  $_POST)) $form_data['rB_1']  = $_POST['rB_1'];
    if (array_key_exists('rB_2',  $_POST)) $form_data['rB_2']  = $_POST['rB_2'];
    if (array_key_exists('rB_3',  $_POST)) $form_data['rB_3']  = $_POST['rB_3'];
    if (array_key_exists('rB_4',  $_POST)) $form_data['rB_4']  = $_POST['rB_4'];
    if (array_key_exists('rB_5',  $_POST)) $form_data['rB_5']  = $_POST['rB_5'];
    if (array_key_exists('rB_6',  $_POST)) $form_data['rB_6']  = $_POST['rB_6'];
    if (array_key_exists('rB_7',  $_POST)) $form_data['rB_7']  = $_POST['rB_7'];
    if (array_key_exists('rB_8',  $_POST)) $form_data['rB_8']  = $_POST['rB_8'];
    if (array_key_exists('rB_9',  $_POST)) $form_data['rB_9']  = $_POST['rB_9'];
    if (array_key_exists('rB_10', $_POST)) $form_data['rB_10'] = $_POST['rB_10'];
    if (array_key_exists('rB_11', $_POST)) $form_data['rB_11'] = $_POST['rB_11'];
    if (array_key_exists('rB_12', $_POST)) $form_data['rB_12'] = $_POST['rB_12'];
    if (array_key_exists('rB_13', $_POST)) $form_data['rB_13'] = $_POST['rB_13'];
    if (array_key_exists('rB_14', $_POST)) $form_data['rB_14'] = $_POST['rB_14'];
    if (array_key_exists('rB_15', $_POST)) $form_data['rB_15'] = $_POST['rB_15'];
    if (array_key_exists('rB_16', $_POST)) $form_data['rB_16'] = $_POST['rB_16'];
    if (array_key_exists('rC',    $_POST)) $form_data['rC']    = $_POST['rC'];
    if (array_key_exists('rD',    $_POST)) $form_data['rD']    = $_POST['rD'];
    if (array_key_exists('rE',    $_POST)) $form_data['rE']    = $_POST['rE'];
    if (array_key_exists('rF',    $_POST)) $form_data['rF']    = $_POST['rF'];
    if (array_key_exists('rG',    $_POST)) $form_data['rG']    = str_replace($find, $replace, trim($_POST['rG']));
    if (array_key_exists('rH',    $_POST)) $form_data['rH']    = str_replace($find, $replace, trim($_POST['rH']));
    if (array_key_exists('rI_1',  $_POST)) $form_data['rI_1']  = $_POST['rI_1'];
    if (array_key_exists('rI_2',  $_POST)) $form_data['rI_2']  = $_POST['rI_2'];
    if (array_key_exists('rI_3',  $_POST)) $form_data['rI_3']  = $_POST['rI_3'];
    if (array_key_exists('rI_4',  $_POST)) $form_data['rI_4']  = $_POST['rI_4'];
    if (array_key_exists('rI_5',  $_POST)) $form_data['rI_5']  = $_POST['rI_5'];
    if (array_key_exists('rI_6',  $_POST)) $form_data['rI_6']  = $_POST['rI_6'];
    if (array_key_exists('rI_7',  $_POST)) $form_data['rI_7']  = $_POST['rI_7'];
    if (array_key_exists('rI_8',  $_POST)) $form_data['rI_8']  = $_POST['rI_8'];
    if (array_key_exists('rI_9',  $_POST)) $form_data['rI_9']  = $_POST['rI_9'];
    if (array_key_exists('rI_10', $_POST)) $form_data['rI_10'] = $_POST['rI_10'];
    if (array_key_exists('rI_11', $_POST)) $form_data['rI_11'] = $_POST['rI_11'];
    if (array_key_exists('rI_12', $_POST)) $form_data['rI_12'] = $_POST['rI_12'];
    if (array_key_exists('rJ_1',  $_POST)) $form_data['rJ_1']  = $_POST['rJ_1'];
    if (array_key_exists('rJ_2',  $_POST)) $form_data['rJ_2']  = $_POST['rJ_2'];
    if (array_key_exists('rJ_3',  $_POST)) $form_data['rJ_3']  = $_POST['rJ_3'];
    if (array_key_exists('rJ_4',  $_POST)) $form_data['rJ_4']  = $_POST['rJ_4'];
    if (array_key_exists('rJ_5',  $_POST)) $form_data['rJ_5']  = $_POST['rJ_5'];
    if (array_key_exists('rJ_6',  $_POST)) $form_data['rJ_6']  = $_POST['rJ_6'];
    if (array_key_exists('rJ_7',  $_POST)) $form_data['rJ_7']  = $_POST['rJ_7'];
    if (array_key_exists('rJ_8',  $_POST)) $form_data['rJ_8']  = $_POST['rJ_8'];
    if (array_key_exists('rJ_9',  $_POST)) $form_data['rJ_9']  = $_POST['rJ_9'];
    if (array_key_exists('rJ_10', $_POST)) $form_data['rJ_10'] = $_POST['rJ_10'];
    if (array_key_exists('rJ_11', $_POST)) $form_data['rJ_11'] = $_POST['rJ_11'];
    if (array_key_exists('rJ_12', $_POST)) $form_data['rJ_12'] = $_POST['rJ_12'];
    if (array_key_exists('rK',    $_POST)) $form_data['rK']    = $_POST['rK'];
    if (array_key_exists('rL',    $_POST)) $form_data['rL']    = $_POST['rL'];
    if (array_key_exists('rM',  $_POST)) {
      print_r($_POST);
      foreach ($_POST['rM'] as $i => $value) {
        $rM_N = "rM_" . ($i+1);
        $form_data[$rM_N]  = $value;
      }//foreach
    }//if
    if (array_key_exists('rN',    $_POST)) $form_data['rN']    = $_POST['rN'];
    if (array_key_exists('rZ',    $_POST)) $form_data['rZ']    = $_POST['rZ'];
//  }//if

  if ($form_data['stage_no'] == 1) {
  }//if

  if ($form_data['stage_no'] == 2) {
  }//if

  if ($form_data['stage_no'] == 3) {
  }//if

  if ($form_data['stage_no'] == 4) {
  }//if

  if ($form_data['stage_no'] == 5) {
  }//if

  if ($form_data['stage_no'] == 6) {
  }//if

  if ($form_data['stage_no'] == 7) {
  }//if

  if ($form_data['stage_no'] == 8) {
  }//if

  if ($form_data['stage_no'] == 9) {
  }//if

  if ($form_data['stage_no'] == 10) {
  }//if


  if (!file_exists("../datafiles")) {
    mkdir("../datafiles");
  }//if
  switch ($form_data['stage_no']) {
    case  0: $file_name = "../datafiles/DataFile0.dat"; break;
    case  1: $file_name = "../datafiles/DataFile1.dat"; break;
    case  2: $file_name = "../datafiles/DataFile2.dat"; break;
    case  3: $file_name = "../datafiles/DataFile3.dat"; break;
    case  4: $file_name = "../datafiles/DataFile4.dat"; break;
    case  5: $file_name = "../datafiles/DataFile5.dat"; break;
    case  6: $file_name = "../datafiles/DataFile6.dat"; break;
    case  7: $file_name = "../datafiles/DataFile7.dat"; break;
    case  8: $file_name = "../datafiles/DataFile8.dat"; break;
    case  9: $file_name = "../datafiles/DataFile9.dat"; break;
    case 10: $file_name = "../datafiles/DataFile10.dat"; break;
    default: $file_name = "../datafiles/DataFile.dat"; break;
  }//switch
  $file = @fopen($file_name, "a");
  if ($file) {
    flock($file, LOCK_EX);
    if (filesize($file_name) == 0) {
      fputcsv($file, array_keys($form_data), ";");
    }//if
    fputcsv($file, $form_data, ";");
    flock($file, LOCK_UN);
    fclose($file);

    $survey_id = $form_data['survey_id'];
    $stage_no  = $form_data['stage_no'];
    if ($stage_no == -1) $stage_no = "_";
    $intv_num  = $form_data['intv_num'];
    $user_id   = $form_data['user_id'];
    $file_name = "../datafiles/tmp/$survey_id$stage_no($intv_num)$user_id.dat";
    if (file_exists($file_name)) {
      if (file_exists($file_name . ".saved")) {
        unlink($file_name . ".saved");
      }//if
      $file = fopen($file_name, "a");
      if ($file) {
        flock($file, LOCK_EX);
        fputs($file, "SAVED:" . date("Y-m-d H:i:s"));
        flock($file, LOCK_UN);
        fclose($file);
      }//if
      rename($file_name, $file_name . ".saved");
    }//if
  }//if
}//if

?>
