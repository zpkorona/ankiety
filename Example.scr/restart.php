<!DOCTYPE html>
<html>
<head>
  <title>restart wywiadów</title>
  <meta http-equiv="Content-Type" content="text/html">
  <meta charset="utf-8" />
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">
  <meta http-equiv="Cache-Control" content="post-check=0, pre-check=0">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Tabela realizacji wywiadów">
  <meta name="keywords" content="programowanie, strony internetowe, C++, Java Script, HTML, Php">
  <meta name="author" content="AZetKa studio">
  <link rel="stylesheet" type="text/css" href="../css/badania.css">
</head>
<body>

<?php
$script = htmlspecialchars($_SERVER['PHP_SELF']);
//echo "script=$script";
$autoi_file_name = "./data/intvnums_autoi.txt";
$table_file_name = "./data/intvnums_table.txt";
$m_tab_file_name = "./data/intvnums_m_tab.txt";
$startedstr__ = "started____________";
$waitingstr__ = "waiting____________";
$waitingstr  = "waiting";
$startedstr  = "started";
$completestr = "complete";

function sortTab (&$table, $tab_width, $tab_len, $sort_pos, $sort_dir="asc") {
  if ($sort_pos < $tab_width) {
    $sort_f = $sort_dir === "asc";
    while ($sort_f) {
      $sort_f = false;
      for ($i = 0; $i < $tab_len - 1; $i++)
        if ($table[$i+1][$sort_pos] < $table[$i][$sort_pos]) {
          $sort_f = true;
          for ($j = 0; $j < $tab_width; $j++) {
            $cn = "c" . $j;
            $$cn = $table[$i+1][$j];
            $table[$i+1][$j] = $table[$i][$j];
            $table[$i][$j] = $$cn;
          }//for
        }//if
    }//while
    $sort_f = $sort_dir === "desc";
    while ($sort_f) {
      $sort_f = false;
      for ($i = $tab_len - 1; 0 < $i ; $i--)
        if ($table[$i-1][$sort_pos] < $table[$i][$sort_pos]) {
          $sort_f = true;
          for ($j = 0; $j < $tab_width; $j++) {
            $cn = "c" . $j;
            $$cn = $table[$i-1][$j];
            $table[$i-1][$j] = $table[$i][$j];
            $table[$i][$j] = $$cn;
          }//for
        }//if
    }//while
  }//if
}//function sortTab


if (isset($_POST['autoi_sortby']) && $_POST['autoi_sortby'] == "__RESTART__" && isset($_POST['autoi_ident_to_restart'])) {
  $req_intv_num = trim($_POST['autoi_ident_to_restart']);
  $file = @fopen($autoi_file_name, "r+");
  if ($file) {
    flock($file, LOCK_EX);
    $fsize = filesize($autoi_file_name);
    $req_intv_num_found = false;
    $file_pos = 0;
    $intv_num = -1;
    $user_id  = -1;
    $status   = -1;
    while (!$req_intv_num_found && ($file_pos = ftell($file)) < $fsize) {
      $line = fgets($file);
      parse_str($line, $params);
      if (array_key_exists('intv_num', $params) && array_key_exists('user_id', $params) && array_key_exists('status', $params)) {
        $intv_num = trim($params['intv_num']);
        $user_id  = trim($params['user_id']);
        $status   = trim($params['status']);
        $req_intv_num_found = $req_intv_num == $intv_num && ($status == $startedstr__ || $status == $waitingstr__);
        if ($req_intv_num_found && isset($_POST['autoi_hash_user_id'])) {
          $i = trim($_POST['autoi_hash_user_id']);
          if (0 < $i) {
            $len = strlen($user_id);
            if ($len < $i) {
              $i = $len;
            }//if
            while ($i) {
              $user_id[$len - $i] = '~';
              $i--;
            }//while
          }//if
        }//if
      }//if
    }//while
    if ($req_intv_num_found) {
      fseek($file, $file_pos);
      fwrite($file, "intv_num=$req_intv_num&user_id=$user_id&status=$waitingstr__\n");
    }//if
    flock($file, LOCK_UN);
    fclose($file);
  }//if
} else if (isset($_POST['table_sortby']) && $_POST['table_sortby'] == "__RESTART__" && isset($_POST['table_ident_to_restart'])) {
  $req_intv_num = trim($_POST['table_ident_to_restart']);
  $file = @fopen($table_file_name, "r+");
  if ($file) {
    flock($file, LOCK_EX);
    $fsize = filesize($table_file_name);
    $req_intv_num_found = false;
    $file_pos = 0;
    $intv_num = -1;
    $user_id  = -1;
    $status   = -1;
    while (!$req_intv_num_found && ($file_pos = ftell($file)) < $fsize) {
      $line = fgets($file);
      parse_str($line, $params);
      if (array_key_exists('intv_num', $params) && array_key_exists('user_id', $params) && array_key_exists('status', $params)) {
        $intv_num = trim($params['intv_num']);
        $user_id  = trim($params['user_id']);
        $status   = trim($params['status']);
        $req_intv_num_found = $req_intv_num == $intv_num && $status == $startedstr__;
        if ($req_intv_num_found) {
          $user_id = $user_id;
        }
      }//if
    }//while
    if ($req_intv_num_found) {
      fseek($file, $file_pos);
      fwrite($file, "intv_num=$req_intv_num&user_id=$user_id&status=$waitingstr__");
    }//if
    flock($file, LOCK_UN);
    fclose($file);
  }//if
} else if (isset($_POST['m_tab_sortby']) && $_POST['m_tab_sortby'] == "__RESTART__" && isset($_POST['m_tab_ident_to_restart'])) {
  $req_intv_num = trim($_POST['m_tab_ident_to_restart']);
  $file = @fopen($m_tab_file_name, "r+");
  if ($file) {
    flock($file, LOCK_EX);
    $fsize = filesize($m_tab_file_name);
    $req_intv_num_found = false;
    $file_pos = 0;
    $intv_num = -1;
    $user_id  = -1;
    $statusN = "status$req_stage_no";
    while (!$req_intv_num_found && !$req_intv_num_match && ($file_pos = ftell($file)) < $fsize) {
      $line = fgets($file);
      parse_str($line, $params);
      if (array_key_exists('intv_num', $params) && array_key_exists('user_id', $params)) {
        $intv_num = trim($params['intv_num']);
        $user_id  = trim($params['user_id']);
        if ($req_intv_num === $intv_num) {
          $req_intv_num_found = true;
          //echo "$intv_num, $user_id, $statusN,<hr>";
          if ($req_user_id === $user_id && array_key_exists($statusN, $params)) {
            $req_intv_num_match = trim($params[$statusN]) == $waitingstr || trim($params[$statusN]) == $startedstr;
          }//if
        }//if
      }//if
    }//while
    if ($req_intv_num_match) {
      $file_pos += strlen("intv_num=$req_intv_num&user_id=$req_user_id") +
                   (strlen("&statusN=") + strlen($startedstr)) * ($req_stage_no - 1);
      fseek($file, $file_pos);
      fwrite($file, "&status$req_stage_no=$completestr");
      //echo "&status$req_stage_no=$completestr,<hr>";
    }//if
    else {
      $req_intv_num = -1;
    }//else
    flock($file, LOCK_UN);
    fclose($file);
  }//if
}//else


if (file_exists($autoi_file_name)) {
  $file = fopen($autoi_file_name, "r");
  if ($file) {
    flock($file, LOCK_SH);
    $fsize = filesize($autoi_file_name);

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
    echo "<form name='sort_autoi_form' action='$script' method='post'>" .
         "<input type='text' name='autoi_sortby' value='' hidden>";
    echo "<hr><div class='surveyshow-table'>";
    echo "  <div onclick='document.sort_autoi_form.submit()'>";
    echo "    <div onclick=\"document.sort_autoi_form.autoi_sortby.value='$sortby'\">&#8635;</div>" .
         "    <div onclick=\"document.sort_autoi_form.autoi_sortby.value='$l_p_chdir'\">l.p. $l_p_char</div>" .
         "    <div onclick=\"document.sort_autoi_form.autoi_sortby.value='$ino_chdir'\">Numer $ino_char</div>" .
         "    <div onclick=\"document.sort_autoi_form.autoi_sortby.value='$uid_chdir'\">Użytkownik $uid_char</div>" .
         "    <div onclick=\"document.sort_autoi_form.autoi_sortby.value='$sta_chdir'\">Status $sta_char</div>" .
         "    <div onclick='event.stopPropagation();'>" .
              "<i>numer =</i> <input type='text' name='autoi_ident_to_restart' style='width:6rem'/> &nbsp;&nbsp; " .
              "<i>hash uid</i> <input type='number' name='autoi_hash_user_id' value=0 style='width:2.5rem'/> &nbsp; " .
              " </div>" .
         "    <div onclick=\"document.sort_autoi_form.autoi_sortby.value='__RESTART__'\">" .
         "      <span style='border:2px solid green;padding:2px;'>RESTART</span></div>";
    echo "  </div>";

    $lp = 0;
    $autoi_tab = array (array(0, 0, 0, 0));
//wczytanie do tabeli
    while(ftell($file) < $fsize && !feof($file)) {
      $line = fgets($file);
      parse_str($line, $params);
      //if (array_key_exists('status', $params) && trim($params['status'], "_ \n") == $startedstr) {
        $autoi_tab[$lp][0] = $lp + 1;
        $autoi_tab[$lp][1] = "--";
        $autoi_tab[$lp][2] = "--";
        $autoi_tab[$lp][3] = "--";
        if (array_key_exists('intv_num', $params)) $autoi_tab[$lp][1] = trim($params['intv_num']);
        if (array_key_exists('user_id', $params))  $autoi_tab[$lp][2] = trim($params['user_id']);
        if (array_key_exists('status', $params))   $autoi_tab[$lp][3] = trim($params['status'], "_ \n");
        if ($autoi_tab[$lp][3] == $waitingstr)
          $autoi_tab[$lp][3] = "<span class='waiting-intvnum'>" . $autoi_tab[$lp][3] . "</span>";
        else
          if ($autoi_tab[$lp][3] == $startedstr)
            $autoi_tab[$lp][3] = "<span class='started-intvnum'>" . $autoi_tab[$lp][3] . "</span>";
          else
            $autoi_tab[$lp][3] = "<span class='complete-intvnum'>" . $autoi_tab[$lp][3] . "</span>";
        $lp++;
      //}//if
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
      $lp = $j + 1;
      echo "<div><div>$lp</div><div>" . $autoi_tab[$j][0] . "</div><div>" . $autoi_tab[$j][1] ."</div><div>" . $autoi_tab[$j][2] . "</div><div>" . $autoi_tab[$j][3] ."</div></div>";
    }//for

    echo "</div><hr>";
    echo "</form>";
    flock($file, LOCK_UN);
    fclose($file);
  }//if
}//if


if (file_exists($table_file_name)) {
  $file = fopen($table_file_name, "r");
  if ($file) {
    flock($file, LOCK_SH);
    $fsize = filesize($table_file_name);

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
    echo "<form name='sort_table_form' action='$script' method='post'>" .
         "<input type='text' name='table_sortby' value='' hidden>";
    echo "<hr><div class='surveyshow-table'>";
    echo "  <div onclick='document.sort_table_form.submit()'>";
    echo "    <div onclick=\"document.sort_table_form.autoi_sortby.value='$sortby'\">&#8635;</div>" .
         "    <div onclick=\"document.sort_table_form.table_sortby.value='$l_p_chdir'\">l.p. $l_p_char</div>" .
         "    <div onclick=\"document.sort_table_form.table_sortby.value='$ino_chdir'\">Numer $ino_char</div>" .
         "    <div onclick=\"document.sort_table_form.table_sortby.value='$uid_chdir'\">Użytkownik $uid_char</div>" .
         "    <div onclick=\"document.sort_table_form.table_sortby.value='$sta_chdir'\">Status $sta_char</div>";
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
      if ($table_tab[$lp][3] === $waitingstr)
        $table_tab[$lp][3] = "<span class='waiting-intvnum'>" . $table_tab[$lp][3] . "</span>";
      else
        if ($table_tab[$lp][3] === $startedstr)
          $table_tab[$lp][3] = "<span class='started-intvnum'>" . $table_tab[$lp][3] . "</span>";
        else
          $table_tab[$lp][3] = "<span class='complete-intvnum'>" . $table_tab[$lp][3] . "</span>";
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
      $lp = $j + 1;
      echo "<div><div>$lp</div><div>" . $table_tab[$j][0] . "</div><div>" . $table_tab[$j][1] ."</div><div>" . $table_tab[$j][2] . "</div><div>" . $table_tab[$j][3] ."</div></div>";
    }//for

    echo "</div><hr>";
    echo "</form>";
    flock($file, LOCK_UN);
    fclose($file);
  }//if
}//if


$stages_num = 7;
if (file_exists($m_tab_file_name)) {
  $file = fopen($m_tab_file_name, "r");
  if ($file) {
    flock($file, LOCK_SH);
    $fsize = filesize($m_tab_file_name);

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
    echo "<form name='sort_m_tab_form' action='$script' method='post'>" .
         "<input type='text' name='m_tab_sortby' value='' hidden>";
    echo "<hr><div class='surveyshow-table'>";
    echo "  <div onclick='document.sort_m_tab_form.submit()'>";
    echo "    <div onclick=\"document.sort_m_tab_form.autoi_sortby.value='$sortby'\">&#8635;</div>" .
         "    <div onclick=\"document.sort_m_tab_form.m_tab_sortby.value='$l_p_chdir'\">l.p.&nbsp;$l_p_char</div>" .
         "    <div onclick=\"document.sort_m_tab_form.m_tab_sortby.value='$ino_chdir'\">Numer&nbsp;$ino_char</div>" .
         "    <div onclick=\"document.sort_m_tab_form.m_tab_sortby.value='$uid_chdir'\">Użytkownik&nbsp;$uid_char</div>";
    for ($i = 1; $i <= $stages_num; $i++) {
      $stan_chdir = "sta" . $i . "_chdir";
      $stan_char  = "sta" . $i . "_char";
      echo "    <div onclick=\"document.sort_m_tab_form.m_tab_sortby.value='" . $$stan_chdir . "'\">Etap&nbsp;$i&nbsp;" . $$stan_char . "</div>";
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
      for ($i = 1; $i <= $stages_num; $i++)
        $m_tab_tab[$lp][$i + 2] = "--";
      if (array_key_exists('intv_num', $params)) $m_tab_tab[$lp][1] = trim($params['intv_num']);
      if (array_key_exists('user_id', $params))  $m_tab_tab[$lp][2] = trim($params['user_id']);
      for ($i = 1; $i <= $stages_num; $i++)
        if (array_key_exists("status$i", $params)) {
          $m_tab_tab[$lp][$i + 2] = trim($params["status$i"], "_ \n");
        if ($m_tab_tab[$lp][$i + 2] === $waitingstr)
          $m_tab_tab[$lp][$i + 2] = "<span class='waiting-intvnum'>" . $m_tab_tab[$lp][$i + 2] . "</span>";
        else
          if ($m_tab_tab[$lp][$i + 2] === $startedstr)
            $m_tab_tab[$lp][$i + 2] = "<span class='started-intvnum'>" . $m_tab_tab[$lp][$i + 2] . "</span>";
          else
            $m_tab_tab[$lp][$i + 2] = "<span class='complete-intvnum'>" . $m_tab_tab[$lp][$i + 2] . "</span>";
        //echo "<div>" . $m_tab_tab[$lp][$i + 2] . "</div>";
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
      $lp = $j + 1;
      echo "<div><div>$lp</div><div>" . $m_tab_tab[$j][0] . "</div><div>" . $m_tab_tab[$j][1] ."</div><div>" . $m_tab_tab[$j][2] . "</div>";
      for ($i = 0; $i < $stages_num; $i++)
        echo "<div>" . $m_tab_tab[$j][$i + 3] ."</div>";
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
