/**
 * Copyright 2011 Phil Buchanan
 *
 * RGBTONE is a simple HEX to RGB (and vise versa)
 * color converting app. It also allows you to
 * save colors for later using local storage.
 *
 * @version 2.0
 */



var hexInput    = document.getElementById('hex');
var rgbInput    = document.getElementById('rgb');
var preview     = document.getElementById('preview');
var title       = document.getElementById('previewtitle');
var saveBtn     = document.getElementById('save');
var savedColors = document.getElementById('savedcolors');

window.onload = init();



/**
 * Initialization
 * 
 * Creates event listeners and displays recent
 * saved colors
 */

function init() {

	hexInput.addEventListener('keyup', getRgbValue);
	rgbInput.addEventListener('keyup', getHexValue);
	saveBtn.addEventListener('click', save);
	
	displayRecents();

}



/**
 * Get RGB Value
 *
 * Gets the RGB string for a given HEX value and
 * prints it to the RGB input.
 * 
 * @param  value  the hex value to convert
 */

function getRgbValue() {

	var value = hexInput.value;
	
	if (value.length === 3) var fullvalue = value.substr(0, 1) + value.substr(0, 1) + value.substr(1, 1) + value.substr(1, 1) + value.substr(2, 1) + value.substr(2, 1);
	else var fullvalue = value;
	
	if (hexToRgb(fullvalue)) {
	
		var rgbValues = hexToRgb(fullvalue);
		rgbInput.value = rgbValues['r'] + ', ' + rgbValues['g'] + ', ' + rgbValues['b'];
		preview.style.background = '#' + fullvalue;
		title.innerHTML = '#' + value;
		saveBtn.className = '';
	
	}

}

function hexToRgb(hex) {

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
	
}



/**
 * Get HEX Value
 *
 * Gets the HEX value for a given RGB string and
 * prints it to the HEX input.
 * 
 * @param  value  the rgb value string to convert
 */

function getHexValue() {

	var value = rgbInput.value;
	
	value.replace(/\s+/g, ' ');
	var rgbArray = value.split(",");
	
	if (rgbArray[0] > 255) rgbArray[0] = 255;
	if (rgbArray[1] > 255) rgbArray[1] = 255;
	if (rgbArray[2] > 255) rgbArray[2] = 255;
	
	if (rgbArray[0] < 0) rgbArray[0] = 0;
	if (rgbArray[1] < 0) rgbArray[1] = 0;
	if (rgbArray[2] < 0) rgbArray[2] = 0;
	
	if (rgbToHex(parseInt(rgbArray[0]), parseInt(rgbArray[1]), parseInt(rgbArray[2]))) {
		
		var hexValue = rgbToHex(parseInt(rgbArray[0]), parseInt(rgbArray[1]), parseInt(rgbArray[2]));
		hexInput.value = hexValue;
		preview.style.background = '#' + hexValue;
		title.innerHTML = '#' + hexValue;
		saveBtn.className = '';
	
	}
	
}

function rgbToHex(r, g, b) {

	if (isNaN(r)) r = 255;
	if (isNaN(g)) g = 255;
	if (isNaN(b)) b = 255;
	
	var hr = componentToHex(r);
	var hg = componentToHex(g);
	var hb = componentToHex(b);
	
	if (hr.substr(0, 1) == hr.substr(1, 1)) {
		if (hg.substr(0, 1) == hg.substr(1, 1)) {
			if (hb.substr(0, 1) == hb.substr(1, 1)) {
				var hr = componentToHex(r).substr(0, 1);
				var hg = componentToHex(g).substr(0, 1);
				var hb = componentToHex(b).substr(0, 1);
			}
		}
	}
	
	return hr + hg + hb;

}
		
function componentToHex(c) {

	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;

}



/**
 * Save Colour
 *
 * Saves the colour value to a cookie for later 
 * retrieval and display.
 * 
 * @param  value  the hex value string to convert
 */

function save() {

	var value  = hexInput.value;
	var colors = localStorage.getItem('colors');
	
	if (colors !== null) var colors = JSON.parse(colors);
	else var colors = new Array();
	
	if (colors.length > 5) colors.pop();
	colors.unshift(value);
	
	localStorage.setItem('colors', JSON.stringify(colors));
	saveColors(value);
	//location.reload();

}



function displayRecents() {

	var colors = JSON.parse(localStorage.getItem('colors'));
	var string = '';
	
	for (var i = 0; i < colors.length; i++) {
	
		if (i === 5) var last = ' last';
		else var last = '';
		string += '<div class="recent-preview' + last + '">';
		string += '<div class="color-area" style="background: #' + colors[i] + '"></div>';
		string += '<div class="text-area">';
		string += '<p class="label">Preview</p>';
		string += '<p class="value">#' + colors[i] + '</p>';
		string += '</div></div>';
		
	}
	
	savedColors.innerHTML = string;

}





/* AJAX Stuff */

function ajaxRequest() {

	var activexmodes = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];
	
	// IE
	if (window.ActiveXObject) {
		for (var i = 0; i < activexmodes.length; i++) {
			try {
				return new ActiveXObject(activexmodes[i])
			}
			catch(e) {}
		}
	}
	// If Mozilla, Safari etc
	else if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	}
	else {
		return false;
	}

}

function saveColors(value) {

	ajaxRequest = ajaxRequest();
	ajaxRequest.onreadystatechange = function() {
		if (ajaxRequest.readyState == 4){
			if (ajaxRequest.status == 200 || window.location.href.indexOf('http') == -1) {
				// Success
				//document.getElementById("result").innerHTML = ajaxRequest.responseText
			}
			else {
				// Error
			}
		}
	}
	
	ajaxRequest.open('GET', 'colors/colors.php?color=' + value, true);
	ajaxRequest.send(null);

}

