<!DOCTYPE html>
<html>
<head>
  <title>Przejście do kolejnego etapu</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate" />
  <meta http-equiv="Cache-Control" content="post-check=0, pre-check=0" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Przejście do kolejnego etapu" />
  <meta name="keywords" content="programowanie, strony internetowe, C++, Java Script, HTML, Php" />
  <meta name="author" content="AZetKa studio" />
  <link rel="stylesheet" type="text/css" href="../css/badania.css" />
</head>
<body>
<div class='question-text'>

<?php
$intv_num = -1;
$next_srv = "Example.tst";
$file_dir = "../$next_srv/data/";
$file_name = "intvnums_table.txt";
$waitingstr  = "waiting____________";

function isTableIntvNumWaiting ($req_user_id, $req_intv_num, $file, $fsize) {
  global $waitingstr;
  $req_intv_num_found = false;
  $req_intv_num_match = false;
  $file_pos = 0;
  $intv_num = -1;
  $user_id  = -1;
  $status   = -1;
  rewind($file);
  while(!$req_intv_num_found && !$req_intv_num_match && ($file_pos = ftell($file)) < $fsize) {
    $line = fgets($file);
    parse_str($line, $params);
    if (array_key_exists('intv_num', $params) && array_key_exists('user_id', $params) && array_key_exists('status', $params)) {
      $intv_num = trim($params['intv_num']);
      $user_id  = trim($params['user_id']);
      $status   = trim($params['status']);
      //echo "intv_num=$intv_num, user_id=$user_id, status=$status,<br>";
      if ($req_intv_num === $intv_num) {
        $req_intv_num_found = true;
        $req_intv_num_match = $req_user_id === $user_id && $status == $waitingstr;
      }//if
    }//if
  }//while
  if (!$req_intv_num_match) {
    $req_intv_num = -1;
  }//if
  return $req_intv_num_match? 2 : ($req_intv_num_found? 1 : 0);
}//isTableIntvNumWaiting      ok             wykorzystany   nie ma


if (array_key_exists('user_id', $_GET) &&
    array_key_exists('int_no',  $_GET)) {
  $user_id  = $_GET['user_id'];
  $intv_num = $_GET['int_no'];
  if ($user_id != -1 && $intv_num != -1) {
    //dla użytkowników Wawa.. i Krak..
    echo "<p>Wprowadzona została ankieta nr <b>$intv_num</b> przez użytkownika <b><em>$user_id</em></b>.</p>";
    if (!file_exists($file_dir)) {
      mkdir($file_dir);
    }//if
    $file_name = $file_dir . $file_name;
    $intv_num_status = -1;
    if (file_exists($file_dir)) {
      if (file_exists($file_name)) {
        $file = fopen($file_name, "r+");
        $fsize = filesize($file_name);
      }//if
      else {
        $file = fopen($file_name, "c+");
        $intv_num_status = 0;
      }//else
    }//if
    else {
      $file = false;
    }//else
    if ($file) {
      flock($file, LOCK_EX);
      if (strlen($user_id) == 9 && preg_match("/(AlmWawa\d\d)|(AlmKrak\d\d)|(AlmKato\d\d)|(AlmWroc\d\d)|(AlmGdan\d\d)/", $user_id) === 1) {
        $user___ = preg_replace("/\d/", ".", $user_id);
      }//if
      else {
        $user___ = "";
      }//else
      if ($intv_num_status == 0) {
        echo "<p style='color:green;'><em>Pliku z identyfikatorami został utworzony.</em></p>";
      }//if
      else {
        $intv_num_status = isTableIntvNumWaiting($user_id, $intv_num, $file, $fsize);
        if ($intv_num_status == 0) {
          fseek($file, $fsize);//to jest zbędne
        }//if
        else {
          if ($intv_num_status == 1 && $user___ != "") {
            $intv_num_status = isTableIntvNumWaiting($user___, $intv_num, $file, $fsize);
          }//if
          if ($intv_num_status == 1) {//jest $intv_num
            echo "<p style='color:red;'><em>Numer ankiety testowej <b>$intv_num</b> został już wykorzystany.</em></p>";
            echo "<p>Dziękujemy za udział w badaniu.</p>";
          }//if
          if ($intv_num_status == 2) {//$user_id, $intv_num zgodne
            echo "<p style='color:green;'><em>Ankieta numer <b>$intv_num</b> już oczekuje na wypełnienie przez użytkownika <b>$user_id</b>.</em></p>";
          }//if
        }//else
      }//else

      if ($intv_num_status == 0) {
        if ($user___ != "") {
          echo "<p style='color:blue;'><em>Identyfikator użytkownika <b>$user_id</b> zostaje zapamiętany jako <b>$user___</b>, aby każdy użytkownik tego typu mógł kontynuować badanie.</em></p>";
          fwrite($file, "intv_num=$intv_num&user_id=$user___&status=$waitingstr\n");
        }//if
        else {
          fwrite($file, "intv_num=$intv_num&user_id=$user_id&status=$waitingstr\n");
        }//else
      }//if

      flock($file, LOCK_UN);
      fclose($file);
      if ($intv_num_status != 1) {
        $link = "http://" . $_SERVER['SERVER_NAME'] . "/$next_srv/?uid=$user_id&ino=$intv_num";
        echo "<p>Aby kontynuować badanie, przechodząc do testu, należy kliknąć poniższy link:</p>";
        echo "<p><a href='$link'>$link</a> </p>";
        echo "<p>wpisująć ''$intv_num' jako numer ankiety.</p>";
        echo "<p>Miłej zabawy!</p>";
      }//if
    }//if
    else {
      echo "<p>Dziękujemy za udział w badaniu.";
      echo "(<span style='color:red;'><em>Błąd otwarcia pliku z numerami ankiet testowych: $file_dir$file_name.</em></span>)";
      echo "</p>";
    }//else
  }//if
  else {
    echo "<p>Dziękujemy za udział w badaniu.";
    echo "(<span style='color:red;'><em>user_id = -1 lub int_no = -1</em></span>)";
    echo "</p>";
  }//else
}//if
else {
  echo "<p>Dziękujemy za udział w badaniu.";
  echo "(<span style='color:red;'><em>brak user_id lub int_no</em></span>)";
  echo "</p>";
}//else
?>

</div>
</body>
</html>
