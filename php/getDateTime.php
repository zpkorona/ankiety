<?php
$when = "";
if (array_key_exists('when', $_GET)) {
  $when =  htmlspecialchars($_GET['when']);
}//if
echo date("Y-m-d H:i:s");
?>
