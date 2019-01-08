<!DOCTYPE html>
<html>
<head>
  <title>Tabela realizacji wywiadów</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
  <meta http-equiv="Cache-Control" content="post-check=0, pre-check=0">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Tabela realizacji wywiadów">
  <meta name="keywords" content="programowanie, strony internetowe, C++, Java Script, HTML, Php">
  <meta name="author" content="AZetKa studio">
  <link rel="stylesheet" type="text/css" href="../_css_/badania.css">
</head>
<body>

<?php
$script = htmlspecialchars($_SERVER['PHP_SELF']);
$waitingstr  = "waiting";
$startedstr  = "started";
$completestr = "complete";

function sortTab (&$table, $tab_width, $tab_len, $sort_pos, $sort_dir="asc") {
  if ($sort_pos < $tab_width) {
    $sort_f = $sort_dir === "asc";
    while ($sort_f) {
      $sort_f = false;
      for ($i = 0; $i < $tab_len - 1; $i++) {
        if ($table[$i+1][$sort_pos] < $table[$i][$sort_pos]) {
          $sort_f = true;
          for ($j = 0; $j < $tab_width; $j++) {
            $cn = "c" . $j;
            $$cn = $table[$i+1][$j];
            $table[$i+1][$j] = $table[$i][$j];
            $table[$i][$j] = $$cn;
          }//for
        }//if
      }//for
    }//while
    $sort_f = $sort_dir === "desc";
    while ($sort_f) {
      $sort_f = false;
      for ($i = $tab_len - 1; 0 < $i ; $i--) {
        if ($table[$i-1][$sort_pos] < $table[$i][$sort_pos]) {
          $sort_f = true;
          for ($j = 0; $j < $tab_width; $j++) {
            $cn = "c" . $j;
            $$cn = $table[$i-1][$j];
            $table[$i-1][$j] = $table[$i][$j];
            $table[$i][$j] = $$cn;
          }//for
        }//if
      }//for
    }//while
  }//if
}//function sortTab


$file_name = "_dat_/intvnums_autoi.txt";
if (file_exists($file_name)) {
  $file = fopen($file_name, "r");
  if ($file) {
    flock($file, LOCK_SH);
    $fsize = filesize($file_name);

    $l_p_char = "&#8597;";
    $ino_char = "&#8597;";
    $uid_char = "&#8597;";
    $sta_char = "&#8597;";
    $l_p_chdir = "l_p";
    $ino_chdir = "ino";
    $uid_chdir = "uid";
    $sta_chdir = "sta";
    if (isset($_POST['autoi_sortby'])) {
      //echo "jest POST sortby = " . $_POST['autoi_sortby'] . "<br>";
      $sortby = $_POST['autoi_sortby'];
      if ($sortby === "l_p") { $l_p_char = "&#8595;"; $l_p_chdir = "p_l"; }
      if ($sortby === "p_l") $l_p_char = "&#8593;";
      if ($sortby === "ino") { $ino_char = "&#8595;"; $ino_chdir = "oni"; }
      if ($sortby === "oni") $ino_char = "&#8593;";
      if ($sortby === "uid") { $uid_char = "&#8595;"; $uid_chdir = "diu"; }
      if ($sortby === "diu") $uid_char = "&#8593;";
      if ($sortby === "sta") { $sta_char = "&#8595;"; $sta_chdir = "ats"; }
      if ($sortby === "ats") $sta_char = "&#8593;";
    }//if
    else {
      $sortby = "l_p";
      $l_p_char = "&#8595;";
      $l_p_chdir = "p_l";//na odwrót bo juz jest l_p
    }//else
    echo "<form name='sort_autoi_form' action='$script' method='post'><input type='text' name='autoi_sortby' value='' hidden>";
    echo "<hr><div class='surveyshow-table'>";
    echo "  <div onclick=\"submit()\">";
    echo "    <div><button onclick=\"document.sort_autoi_form.autoi_sortby.value='$l_p_chdir'\">l.p. $l_p_char</button></div>" .
         "    <div><button onclick=\"document.sort_autoi_form.autoi_sortby.value='$ino_chdir'\">Numer $ino_char</button></div>" .
         "    <div><button onclick=\"document.sort_autoi_form.autoi_sortby.value='$uid_chdir'\">Użytkownik $uid_char</button></div>" .
         "    <div><button onclick=\"document.sort_autoi_form.autoi_sortby.value='$sta_chdir'\">Status $sta_char</button></div>";
    echo "  </div>";

    $lp = 0;
    $autoi_tab = array (array(0, 0, 0, 0));
//wczytanie do tabeli
    while(ftell($file) < $fsize && !feof($file)) {
      $line = fgets($file);
      parse_str($line, $params);
      $autoi_tab[$lp][0] = $lp + 1;
      $autoi_tab[$lp][1] = "--";
      $autoi_tab[$lp][2] = "--";
      $autoi_tab[$lp][3] = "--";
      if (array_key_exists('intv_num', $params)) $autoi_tab[$lp][1] = trim($params['intv_num']);
      if (array_key_exists('user_id', $params))  $autoi_tab[$lp][2] = trim($params['user_id']);
      if (array_key_exists('status', $params))   $autoi_tab[$lp][3] = trim($params['status'], "_ \n");
      if ($autoi_tab[$lp][3] == $waitingstr) {
        $autoi_tab[$lp][3] = "<span class='waiting-intvnum'>" . $autoi_tab[$lp][3] . "</span>";
      }//if
      else {
        if ($autoi_tab[$lp][3] == $startedstr) {
          $autoi_tab[$lp][3] = "<span class='started-intvnum'>" . $autoi_tab[$lp][3] . "</span>";
        }//if
        else {
          $autoi_tab[$lp][3] = "<span class='complete-intvnum'>" . $autoi_tab[$lp][3] . "</span>";
        }//else
      }//else
      $lp++;
//echo "<div><div>" . $autoi_tab[$lp][0] . "</div><div>" . $autoi_tab[$lp][1] . "</div><div>" . $autoi_tab[$lp][2] . "</div><div>" . $autoi_tab[$lp][3] . "</div></div>";
    }//while
    $autoi_tab_len = $lp;
//echo "<hr />";

    //if ($sortby === "l_p") sortTab4($autoi_tab, $autoi_tab_len, 0);//-- to jest zawsze
    if ($sortby === "p_l") sortTab($autoi_tab, 4, $autoi_tab_len, 0, "desc");
    if ($sortby === "ino" || $sortby === "uid" || $sortby === "diu" || $sortby === "sta" || $sortby === "ats") sortTab($autoi_tab, 4, $autoi_tab_len, 1);
    if ($sortby === "oni") sortTab($autoi_tab, 4, $autoi_tab_len, 1, "desc");
    if ($sortby === "uid") sortTab($autoi_tab, 4, $autoi_tab_len, 2);
    if ($sortby === "diu") sortTab($autoi_tab, 4, $autoi_tab_len, 2, "desc");
    if ($sortby === "sta") sortTab($autoi_tab, 4, $autoi_tab_len, 3);
    if ($sortby === "ats") sortTab($autoi_tab, 4, $autoi_tab_len, 3, "desc");

    for ($j = 0; $j < $autoi_tab_len; $j++) {
      echo "<div><div>" . $autoi_tab[$j][0] . "</div><div>" . $autoi_tab[$j][1] ."</div><div>" . $autoi_tab[$j][2] . "</div><div>" . $autoi_tab[$j][3] ."</div></div>";
    }//for

    echo "</div><hr>";
    echo "</form>";
    flock($file, LOCK_UN);
    fclose($file);
  }//if
}//if


$file_name = "_dat_/intvnums_table.txt";
if (file_exists($file_name)) {
  $file = fopen($file_name, "r");
  if ($file) {
    flock($file, LOCK_SH);
    $fsize = filesize($file_name);

    $l_p_char = "&#8597;";
    $ino_char = "&#8597;";
    $uid_char = "&#8597;";
    $sta_char = "&#8597;";
    $l_p_chdir = "l_p";
    $ino_chdir = "ino";
    $uid_chdir = "uid";
    $sta_chdir = "sta";
    if (isset($_POST['table_sortby'])) {
      //echo "jest POST sortby = " . $_POST['table_sortby'] . "<br>";
      $sortby = $_POST['table_sortby'];
      if ($sortby === "l_p") { $l_p_char = "&#8595;"; $l_p_chdir = "p_l"; }
      if ($sortby === "p_l") $l_p_char = "&#8593;";
      if ($sortby === "ino") { $ino_char = "&#8595;"; $ino_chdir = "oni"; }
      if ($sortby === "oni") $ino_char = "&#8593;";
      if ($sortby === "uid") { $uid_char = "&#8595;"; $uid_chdir = "diu"; }
      if ($sortby === "diu") $uid_char = "&#8593;";
      if ($sortby === "sta") { $sta_char = "&#8595;"; $sta_chdir = "ats"; }
      if ($sortby === "ats") $sta_char = "&#8593;";
    }//if
    else {
      $sortby = "l_p";
      $l_p_char = "&#8595;";
      $l_p_chdir = "p_l";//na odwrót bo juz jest l_p
    }//else
    echo "<form name='sort_table_form' action='$script' method='post'><input type='text' name='table_sortby' value='' hidden>";
    echo "<hr><div class='surveyshow-table'>";
    echo "  <div onclick=\"submit()\">";
    echo "    <div><button onclick=\"document.sort_table_form.table_sortby.value='$l_p_chdir'\">l.p. $l_p_char</button></div>" .
         "    <div><button onclick=\"document.sort_table_form.table_sortby.value='$ino_chdir'\">Numer $ino_char</button></div>" .
         "    <div><button onclick=\"document.sort_table_form.table_sortby.value='$uid_chdir'\">Użytkownik $uid_char</button></div>" .
         "    <div><button onclick=\"document.sort_table_form.table_sortby.value='$sta_chdir'\">Status $sta_char</button></div>";
    echo "</div>";

    $lp = 0;
    $table_tab = array (array(0, 0, 0, 0));
//wczytanie do tabeli
    while(ftell($file) < $fsize && !feof($file)) {
      $line = fgets($file);
      parse_str($line, $params);
      $table_tab[$lp][0] = $lp + 1;
      $table_tab[$lp][1] = "--";
      $table_tab[$lp][2] = "--";
      $table_tab[$lp][3] = "--";
      if (array_key_exists('intv_num', $params)) $table_tab[$lp][1] = trim($params['intv_num']);
      if (array_key_exists('user_id', $params))  $table_tab[$lp][2] = trim($params['user_id']);
      if (array_key_exists('status', $params))   $table_tab[$lp][3] = trim($params['status'], "_ \n");
      if ($table_tab[$lp][3] === $waitingstr) {
        $table_tab[$lp][3] = "<span class='waiting-intvnum'>" . $table_tab[$lp][3] . "</span>";
      }//if
      else {
        if ($table_tab[$lp][3] === $startedstr) {
          $table_tab[$lp][3] = "<span class='started-intvnum'>" . $table_tab[$lp][3] . "</span>";
        }//if
        else {
          $table_tab[$lp][3] = "<span class='complete-intvnum'>" . $table_tab[$lp][3] . "</span>";
        }//else
      }//else
      $lp++;
    //echo "<div><div>" . $autoi_tab[$lp][0] . "</div><div>" . $autoi_tab[$lp][1] . "</div><div>" . $autoi_tab[$lp][2] . "</div><div>" . $autoi_tab[$lp][3] . "</div></div>";
    }//while
    $table_tab_len = $lp;
    //echo "<hr />";

    //if ($sortby === "l_p") sortTab($table_tab, 4, $table_tab_len, 0);//-- to jest zawsze
    if ($sortby === "p_l") sortTab($table_tab, 4, $table_tab_len, 0, "desc");
    if ($sortby === "ino" || $sortby === "uid" || $sortby === "diu" || $sortby === "sta" || $sortby === "ats") sortTab($table_tab, 4, $table_tab_len, 1);
    if ($sortby === "oni") sortTab($table_tab, 4, $table_tab_len, 1, "desc");
    if ($sortby === "uid") sortTab($table_tab, 4, $table_tab_len, 2);
    if ($sortby === "diu") sortTab($table_tab, 4, $table_tab_len, 2, "desc");
    if ($sortby === "sta") sortTab($table_tab, 4, $table_tab_len, 3);
    if ($sortby === "ats") sortTab($table_tab, 4, $table_tab_len, 3, "desc");

    for ($j = 0; $j < $table_tab_len; $j++) {
      echo "<div><div>" . $table_tab[$j][0] . "</div><div>" . $table_tab[$j][1] ."</div><div>" . $table_tab[$j][2] . "</div><div>" . $table_tab[$j][3] ."</div></div>";
    }//for

    echo "</div><hr>";
    echo "</form>";
    flock($file, LOCK_UN);
    fclose($file);
  }//if
}//if


$file_name = "_dat_/intvnums_m_tab.txt";
$stages_num = 7;
if (file_exists($file_name)) {
  $file = fopen($file_name, "r");
  if ($file) {
    flock($file, LOCK_SH);
    $fsize = filesize($file_name);

    $l_p_char = "&#8597;";
    $ino_char = "&#8597;";
    $uid_char = "&#8597;";
    $sta_char = "&#8597;";
    $sta1_char = "&#8597;";
    $sta2_char = "&#8597;";
    $sta3_char = "&#8597;";
    $sta4_char = "&#8597;";
    $sta5_char = "&#8597;";
    $sta6_char = "&#8597;";
    $sta7_char = "&#8597;";
    $sta8_char = "&#8597;";
    $sta9_char = "&#8597;";
    $sta10_char = "&#8597;";
    $l_p_chdir = "l_p";
    $ino_chdir = "ino";
    $uid_chdir = "uid";
    $sta1_chdir = "sta1";
    $sta2_chdir = "sta2";
    $sta3_chdir = "sta3";
    $sta4_chdir = "sta4";
    $sta5_chdir = "sta5";
    $sta6_chdir = "sta6";
    $sta7_chdir = "sta7";
    $sta8_chdir = "sta8";
    $sta9_chdir = "sta9";
    $sta10_chdir = "sta10";
    if (isset($_POST['m_tab_sortby'])) {
      //echo "jest POST sortby = " . $_POST['m_tab_sortby'] . "<br>";
      $sortby = $_POST['m_tab_sortby'];
      if ($sortby === "l_p") { $l_p_char = "&#8595;"; $l_p_chdir = "p_l"; }
      if ($sortby === "p_l") $l_p_char = "&#8593;";
      if ($sortby === "ino") { $ino_char = "&#8595;"; $ino_chdir = "oni"; }
      if ($sortby === "oni") $ino_char = "&#8593;";
      if ($sortby === "uid") { $uid_char = "&#8595;"; $uid_chdir = "diu"; }
      if ($sortby === "diu") $uid_char = "&#8593;";
      if ($sortby === "sta1") { $sta1_char = "&#8595;"; $sta1_chdir = "ats1"; }
      if ($sortby === "ats1") $sta1_char = "&#8593;";
      if ($sortby === "sta2") { $sta2_char = "&#8595;"; $sta2_chdir = "ats2"; }
      if ($sortby === "ats2") $sta2_char = "&#8593;";
      if ($sortby === "sta3") { $sta3_char = "&#8595;"; $sta3_chdir = "ats3"; }
      if ($sortby === "ats3") $sta3_char = "&#8593;";
      if ($sortby === "sta4") { $sta4_char = "&#8595;"; $sta4_chdir = "ats4"; }
      if ($sortby === "ats4") $sta4_char = "&#8593;";
      if ($sortby === "sta5") { $sta5_char = "&#8595;"; $sta5_chdir = "ats5"; }
      if ($sortby === "ats5") $sta5_char = "&#8593;";
      if ($sortby === "sta6") { $sta6_char = "&#8595;"; $sta6_chdir = "ats6"; }
      if ($sortby === "ats6") $sta6_char = "&#8593;";
      if ($sortby === "sta7") { $sta7_char = "&#8595;"; $sta7_chdir = "ats7"; }
      if ($sortby === "ats7") $sta7_char = "&#8593;";
      if ($sortby === "sta8") { $sta8_char = "&#8595;"; $sta8_chdir = "ats8"; }
      if ($sortby === "ats8") $sta8_char = "&#8593;";
      if ($sortby === "sta9") { $sta9_char = "&#8595;"; $sta9_chdir = "ats9"; }
      if ($sortby === "ats9") $sta9_char = "&#8593;";
      if ($sortby === "sta10") { $sta10_char = "&#8595;"; $sta10_chdir = "ats10"; }
      if ($sortby === "ats10") $sta10_char = "&#8593;";
    }//if
    else {
      $sortby = "l_p";
      $l_p_char = "&#8595;";
      $l_p_chdir = "p_l";//na odwrót bo juz jest l_p
    }//else
    //echo "sortby = " . $sortby . "<hr />";
    echo "<form name='sort_m_tab_form' action='$script' method='post'><input type='text' name='m_tab_sortby' value='' hidden>";
    echo "<hr><div class='surveyshow-table'>";
    echo "  <div onclick=\"submit()\">";
    echo "    <div><button onclick=\"document.sort_m_tab_form.m_tab_sortby.value='$l_p_chdir'\">l.p.&nbsp;$l_p_char</button></div>" .
         "    <div><button onclick=\"document.sort_m_tab_form.m_tab_sortby.value='$ino_chdir'\">Numer&nbsp;$ino_char</button></div>" .
         "    <div><button onclick=\"document.sort_m_tab_form.m_tab_sortby.value='$uid_chdir'\">Użytkownik&nbsp;$uid_char</button></div>";
    for ($i = 1; $i <= $stages_num; $i++) {
      $stan_chdir = "sta" . $i . "_chdir";
      $stan_char  = "sta" . $i . "_char";
      echo "    <div><button onclick=\"document.sort_m_tab_form.m_tab_sortby.value='" . $$stan_chdir . "'\">Etap&nbsp;$i&nbsp;" . $$stan_char . "</button></div>";
    }//for
    echo "</div>";
    $lp = 0;
    $m_tab_tab = array (array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
//wczytanie do tabeli
    while(ftell($file) < $fsize && !feof($file)) {
      $line = fgets($file);
      parse_str($line, $params);
      $m_tab_tab[$lp][0] = $lp + 1;
      $m_tab_tab[$lp][1] = "--";
      $m_tab_tab[$lp][2] = "--";
      for ($i = 1; $i <= $stages_num; $i++) {
        $m_tab_tab[$lp][$i + 2] = "--";
      }//for
      if (array_key_exists('intv_num', $params)) $m_tab_tab[$lp][1] = trim($params['intv_num']);
      if (array_key_exists('user_id', $params))  $m_tab_tab[$lp][2] = trim($params['user_id']);
      for ($i = 1; $i <= $stages_num; $i++) {
        if (array_key_exists("status$i", $params)) {
          $m_tab_tab[$lp][$i + 2] = trim($params["status$i"], "_ \n");
          if ($m_tab_tab[$lp][$i + 2] === $waitingstr) {
            $m_tab_tab[$lp][$i + 2] = "<span class='waiting-intvnum'>" . $m_tab_tab[$lp][$i + 2] . "</span>";
          }//if
          else {
            if ($m_tab_tab[$lp][$i + 2] === $startedstr) {
              $m_tab_tab[$lp][$i + 2] = "<span class='started-intvnum'>" . $m_tab_tab[$lp][$i + 2] . "</span>";
            }//if
            else {
              $m_tab_tab[$lp][$i + 2] = "<span class='complete-intvnum'>" . $m_tab_tab[$lp][$i + 2] . "</span>";
            }//else
          }//else
          //echo "<div>" . $m_tab_tab[$lp][$i + 2] . "</div>";
        }//if
      }//for
      $lp++;
      //echo "</div>";
    }//while
    $m_tab_tab_len = $lp;
    //echo "<hr />";

    //if ($sortby === "l_p") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 0);//-- to jest zawsze
    if ($sortby === "p_l") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 0, "desc");
    if ($sortby === "ino") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 1);
    if ($sortby === "oni") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 1, "desc");
    if ($sortby === "uid") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 2);
    if ($sortby === "diu") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 2, "desc");
    if ($sortby === "sta1") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 3);
    if ($sortby === "ats1") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 3, "desc");
    if ($sortby === "sta2") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 4);
    if ($sortby === "ats2") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 4, "desc");
    if ($sortby === "sta3") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 5);
    if ($sortby === "ats3") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 5, "desc");
    if ($sortby === "sta4") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 6);
    if ($sortby === "ats4") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 6, "desc");
    if ($sortby === "sta5") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 7);
    if ($sortby === "ats5") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 7, "desc");
    if ($sortby === "sta6") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 8);
    if ($sortby === "ats6") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 8, "desc");
    if ($sortby === "sta7") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 9);
    if ($sortby === "ats7") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 9, "desc");
    if ($sortby === "sta8") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 10);
    if ($sortby === "ats8") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 10, "desc");
    if ($sortby === "sta9") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 11);
    if ($sortby === "ats9") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 11, "desc");
    if ($sortby === "sta10") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 12);
    if ($sortby === "ats10") sortTab($m_tab_tab, $stages_num + 3, $m_tab_tab_len, 12, "desc");

    for ($j = 0; $j < $m_tab_tab_len; $j++) {
      echo "<div><div>" . $m_tab_tab[$j][0] . "</div><div>" . $m_tab_tab[$j][1] ."</div><div>" . $m_tab_tab[$j][2] . "</div>";
      for ($i = 0; $i < $stages_num; $i++) {
        echo "<div>" . $m_tab_tab[$j][$i + 3] ."</div>";
      }//for
      echo "</div>";
    }//for

    echo "</div><hr>";
    echo "</form>";
    flock($file, LOCK_UN);
    fclose($file);
  }//if
}//if
?>

</body>
</html>
