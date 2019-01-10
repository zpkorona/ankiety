<!DOCTYPE html>
<html>
<head>
  <title>Log realizacji wywiadów</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Log realizacji wywiadów">
  <meta name="keywords" content="programowanie, strony internetowe, C++, Java Script, HTML, Php">
  <meta name="author" content="AZetKa studio">
  <link rel="stylesheet" type="text/css" href="../csstyles/badania.css">
</head>
<body>

<?php
$file_name = "./datafiles/surveyLogFile.dat";
if (file_exists($file_name)) {
  $file = fopen($file_name, "r");
  if ($file) {
    flock($file, LOCK_SH);
      $fsize = filesize($file_name);
      echo "<hr><div class='surveyshow-table'>";
      echo "<div>";
      echo "<div>l.p.</div>";
      echo "<div>data</div>";
      echo "<div>stage_no</div>";
      echo "<div>user_id</div>";
      echo "<div>int_no</div>";
      echo "<div>agent</div>";
      echo "<div>info</div>";
      echo "<div>REMOTE_HOST</div>";
      echo "<div>REMOTE_PORT</div>";
      echo "</div>";
      $lp = 0;
      while(ftell($file) < $fsize && !feof($file)) {
        $line = fgets($file);
        $values = str_getcsv($line, ";");
        $lp++;
        echo "<div><div>$lp</div>";
        foreach($values as $value) echo "<div>$value</div>";
        echo "</div>";
        }//while
      echo "</div><hr>";
    flock($file, LOCK_UN);
    fclose($file);
  }//if
}//if
?>

</body>
</html>
