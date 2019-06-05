<!DOCTYPE html>
<html>
<head>
  <title>Częściowe dane z wywiadów</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
  <meta http-equiv="Cache-Control" content="post-check=0, pre-check=0">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Cześciowe dane z wywiadów">
  <meta name="keywords" content="programowanie, strony internetowe, C++, Java Script, HTML, Php">
  <meta name="author" content="AZetKa studio">
  <link rel="stylesheet" type="text/css" href="../css/badania.css">
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
        echo "<div class='resultsshow-table'>";
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

show("./data/DataFile.dat");
show("./data/DataFile0.dat");
show("./data/DataFile1.dat");
show("./data/DataFile2.dat");
show("./data/DataFile3.dat");
show("./data/DataFile4.dat");
show("./data/DataFile5.dat");
show("./data/DataFile6.dat");
show("./data/DataFile7.dat");
show("./data/DataFile8.dat");
show("./data/DataFile9.dat");
show("./data/DataFile10.dat");

?>

</body>
</html>
