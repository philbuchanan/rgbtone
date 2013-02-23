<?php

if (isset($_GET['color'])) writeColors($_GET['color']);

function writeColors($newcolor) {

	$currentlist = file_get_contents("colors.txt");
	
	if (strlen($currentlist) == 0) $sep = '';
	else $sep =', ';
	
	if ($newcolor != substr($currentlist, -6) && $newcolor != substr($currentlist, -3)) {
		$currentlist .= $sep . $newcolor;
		$fl = fopen("colors.txt", "w+");
		fwrite($fl, $currentlist);
		fclose($fl);
	}

}

?>