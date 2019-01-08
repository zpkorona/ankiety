﻿<!DOCTYPE html>
<html>
<head>
  <title>Cześciowe dane z wywiadów</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Cześciowe dane z wywiadów">
  <meta name="keywords" content="programowanie, strony internetowe, C++, Java Script, HTML, Php">
  <meta name="author" content="AZetKa studio">
  <link rel="stylesheet" type="text/css" href="../_css_/badania.css">
</head>
<body>

<?php
function show ($file_name) {
  echo "<hr><em>$file_name</em><br>";
  if (file_exists($file_name)) {
    $file = fopen($file_name, "r");
    if ($file) {
      flock($file, LOCK_SH);
        $fsize = filesize($file_name);
        echo "<div class='surveyshow-table'>";
        echo "<div>";
        echo "</div>";
        $lp = 0;
        while(ftell($file) < $fsize && !feof($file)) {
          $line = fgets($file);
          $values = str_getcsv($line, ";");
          if ($lp == 0)
            echo "<div><div>l.p.</div>";
          else
            echo "<div><div>$lp</div>";
          //foreach($values as $value) echo "<div>$value</div>";
          echo "<div>$values[0]</div>";
          echo "<div>$values[1]</div>";
          echo "<div>$values[2]</div>";
          echo "<div>$values[4]</div>";
          echo "<div>$values[5]</div>";
          echo "<div>$values[6]</div>";
          echo "</div>";
          $lp++;
          }//while
        echo "</div>";
      flock($file, LOCK_UN);
      fclose($file);  
    }//if
  }//if
  echo "<hr>";
}//function

show("_dat_/DataFile.dat");
show("_dat_/DataFile0.dat");
show("_dat_/DataFile1.dat");
show("_dat_/DataFile2.dat");
show("_dat_/DataFile3.dat");
show("_dat_/DataFile4.dat");
show("_dat_/DataFile5.dat");
show("_dat_/DataFile6.dat");
show("_dat_/DataFile7.dat");
show("_dat_/DataFile8.dat");
show("_dat_/DataFile9.dat");
show("_dat_/DataFile10.dat");

?>

</body>
</html>