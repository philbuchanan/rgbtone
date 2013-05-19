<?php

if (isset($_GET['color'])) writeColors($_GET['color']);

function writeColors($newcolor) {

	if (validateColor($newcolor)) {
	
		$currentlist = file_get_contents("colors.txt");
		
		if (strlen($currentlist) == 0) $sep = '';
		else $sep =',';
		
		if ($newcolor != substr($currentlist, -6) && $newcolor != substr($currentlist, -3)) {
			$currentlist .= $sep . $newcolor;
			$fl = fopen("colors.txt", "w+");
			fwrite($fl, $currentlist);
			fclose($fl);
		}
	
	}

}

function validateColor($color) {

	$regexs = array(
		'/^[a-f0-9]{3}$/',
		'/^[a-f0-9]{6}$/',
		'/^#[a-f0-9]{3}$/',
		'/^#[a-f0-9]{6}$/'
	);
	
	foreach ($regexs as $regex) {
		if (preg_match($regex, $color)) return true;
	}
	
	return false;

}

?>