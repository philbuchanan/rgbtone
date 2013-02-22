<!doctype html>
<html>
<head>
	<meta charset="utf-8" />
	<title>Colours</title>
	
	<style type="text/css">
		html, body, div {
			margin: 0;
			padding: 0;
		}
		div {
			float: left;
			width: 15px;
			height: 15px;
		}
	</style>
</head>
<body>
<a href="/">
<?php

$colors = file_get_contents("colors.txt");
$colors_arr = array_reverse(explode(', ', $colors));

foreach ($colors_arr as $color) {
	?>
	
	<div style="background:#<?php echo $color; ?>;"></div>
	
	<?php
}

?>
</a>
</body>
</html>