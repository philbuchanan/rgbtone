<?php

writeColors($_GET['color']);

function writeColors($newcolor) {

	$currentlist = file_get_contents("colors.txt");
	if ($newcolor == substr($currentlist, -6)) {}
	elseif ($newcolor == substr($currentlist, -3)) {}
	else {
		$currentlist .= ', ' . $newcolor;
		$fl = fopen("colors.txt", "w+");
		fwrite($fl, $currentlist);
	}
	fclose($fl);

}

?>