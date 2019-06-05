<?php
//zapiszSurveyLog?stage_no= &user_id= &int_no= &agent= &extra=
if (array_key_exists('survey_id', $_GET) &&
    array_key_exists('stage_no', $_GET) &&
    array_key_exists('user_id',  $_GET) &&
    array_key_exists('int_no',   $_GET) &&
    array_key_exists('agent',    $_GET) &&
    array_key_exists('extra',    $_GET)) {
  $survey_id = $_GET['survey_id'];
  $req_stage_no = $_GET['stage_no'];
  $req_user_id  = $_GET['user_id' ];
  $req_intv_num = $_GET['int_no'  ];
  $req_agent    = $_GET['agent'   ];
  if (array_key_exists('HTTP_USER_AGENT', $_SERVER)) $req_agent = $_SERVER['HTTP_USER_AGENT'];
  $req_extra    = $_GET['extra'   ];
  $serv_REMOTE_HOST = "--";
  $serv_REMOTE_PORT = "--";
  if (array_key_exists('REMOTE_HOST', $_SERVER)) $serv_REMOTE_HOST = $_SERVER['REMOTE_HOST'];
  if (array_key_exists('REMOTE_PORT', $_SERVER)) $serv_REMOTE_PORT = $_SERVER['REMOTE_PORT'];
  if (!file_exists("../$survey_id/data")) {
    @mkdir("../$survey_id/data");
  }//if
  $file_name = "../$survey_id/data/surveyLogFile.dat";
  $file = @fopen($file_name, "a");
  if ($file) {
    flock($file, LOCK_EX);
    fwrite($file, date("Y-m-d H:i:s") .
                  ";$req_stage_no;$req_user_id;$req_intv_num" .
                  ";\"$req_agent\";\"$req_extra\";$serv_REMOTE_HOST;$serv_REMOTE_PORT\n");
    flock($file, LOCK_UN);
    fclose($file);
  }//if
}//if

?>
