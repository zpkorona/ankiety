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
    $form_data['rA']    = "";
    $form_data['rB']    = "";
    $form_data['rC']    = "";

  //foreach($_POST as $name => $value)
  //  $form_data[$name] = $value;

//ZAMIANA
//^    \$form_data\[('.*')\] += "";
//    if (array_key_exists($1,  $_POST)) $form_data[$1]  = $_POST[$1];
    if (array_key_exists('rA',    $_POST)) $form_data['rA']    = $_POST['rA'];
    if (array_key_exists('rB',    $_POST)) $form_data['rB']    = $_POST['rB'];
    if (array_key_exists('rC',    $_POST)) $form_data['rC']    = $_POST['rC'];
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
