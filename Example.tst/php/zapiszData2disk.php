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

  //foreach($_POST as $name => $value)
  //  $form_data[$name] = $value;

//ZAMIANA
//^    \$form_data\[('.*')\] += "";
//    if (array_key_exists($1,  $_POST)) $form_data[$1]  = $_POST[$1];
    if (array_key_exists('tp1_ord',  $_POST)) $form_data['tp1_ord']  = $_POST['tp1_ord'];
    if (array_key_exists('tp1_name', $_POST)) $form_data['tp1_name'] = $_POST['tp1_name'];
    if (array_key_exists('tp1_q1',   $_POST)) $form_data['tp1_q1']   = $_POST['tp1_q1'];
    if (array_key_exists('tp1_q2',   $_POST)) $form_data['tp1_q2']   = $_POST['tp1_q2'];
    if (array_key_exists('tp1_q3',   $_POST)) $form_data['tp1_q3']   = $_POST['tp1_q3'];
    if (array_key_exists('tp2_ord',  $_POST)) $form_data['tp2_ord']  = $_POST['tp2_ord'];
    if (array_key_exists('tp2_name', $_POST)) $form_data['tp2_name'] = $_POST['tp2_name'];
    if (array_key_exists('tp2_q1',   $_POST)) $form_data['tp2_q1']   = $_POST['tp2_q1'];
    if (array_key_exists('tp2_q2',   $_POST)) $form_data['tp2_q2']   = $_POST['tp2_q2'];
    if (array_key_exists('tp2_q3',   $_POST)) $form_data['tp2_q3']   = $_POST['tp2_q3'];
    if (array_key_exists('q7',       $_POST)) $form_data['q7']       = $_POST['q7'];
    if (array_key_exists('q8_1',     $_POST)) $form_data['q8_1']     = $_POST['q8_1'];
    if (array_key_exists('q8_2',     $_POST)) $form_data['q8_2']     = $_POST['q8_2'];
    if (array_key_exists('q8_3',     $_POST)) $form_data['q8_3']     = $_POST['q8_3'];
    if (array_key_exists('q8_4',     $_POST)) $form_data['q8_4']     = $_POST['q8_4'];
    if (array_key_exists('q8_5',     $_POST)) $form_data['q8_5']     = $_POST['q8_5'];
    if (array_key_exists('q8_6',     $_POST)) $form_data['q8_6']     = $_POST['q8_6'];
    if (array_key_exists('q8_7',     $_POST)) $form_data['q8_7']     = $_POST['q8_7'];
    if (array_key_exists('q8_8',     $_POST)) $form_data['q8_8']     = $_POST['q8_8'];
    if (array_key_exists('q8_9',     $_POST)) $form_data['q8_9']     = $_POST['q8_9'];
    if (array_key_exists('q8_10',    $_POST)) $form_data['q8_10']    = $_POST['q8_10'];
    if (array_key_exists('q8_11',    $_POST)) $form_data['q8_11']    = $_POST['q8_11'];
    if (array_key_exists('q8_12',    $_POST)) $form_data['q8_12']    = $_POST['q8_12'];
    print_r($_POST);
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


  if (!file_exists("../data")) {
    mkdir("../data");
  }//if
  switch ($form_data['stage_no']) {
    case  0: $file_name = "../data/DataFile0.dat"; break;
    case  1: $file_name = "../data/DataFile1.dat"; break;
    case  2: $file_name = "../data/DataFile2.dat"; break;
    case  3: $file_name = "../data/DataFile3.dat"; break;
    case  4: $file_name = "../data/DataFile4.dat"; break;
    case  5: $file_name = "../data/DataFile5.dat"; break;
    case  6: $file_name = "../data/DataFile6.dat"; break;
    case  7: $file_name = "../data/DataFile7.dat"; break;
    case  8: $file_name = "../data/DataFile8.dat"; break;
    case  9: $file_name = "../data/DataFile9.dat"; break;
    case 10: $file_name = "../data/DataFile10.dat"; break;
    default: $file_name = "../data/DataFile.dat"; break;
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
    $file_name = "../data/tmp/$survey_id$stage_no($intv_num)$user_id.dat";
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
