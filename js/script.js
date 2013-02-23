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

var maxSave = 6;
var colors  = [];

var ajaxRequest;

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
	hexInput.addEventListener('click', function() {hexInput.select()});
	rgbInput.addEventListener('click', function() {rgbInput.select()});
	saveBtn.addEventListener('click', save);
	
	if (retrieveColors()) {
		ajaxRequest = ajaxRequest();
		displayRecents();
	}

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
 * Saves six color values (in a sinlge string) to
 * local storage for later retrieval and display.
 */

function save() {

	var value  = hexInput.value;
	
	if (colors.length >= maxSave) colors.pop();
	colors.unshift(value);
	
	localStorage.setItem('colors', JSON.stringify(colors));
	
	displayRecents();
	saveColors(value);

}



/**
 * Retrieve Colours
 *
 * Retrieves any saved colors from local storage
 * and puts them into the colors array or creates
 * a new array if no colors are saved.
 * 
 * return  false if local storage isn't supported, else true
 */

function retrieveColors() {

	if (typeof Storage === 'undefined') return false;
	
	var s = localStorage.getItem('colors');
	console.log(s);
	
	if (s !== null) colors = JSON.parse(s);
	else colors = new Array();
	
	return true;

}



/**
 * Display Recent Colors
 * 
 * Displays all saved colors.
 */

function displayRecents() {

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





/**
 * New Ajax Request
 * 
 * Creates a new Ajax object.
 */

function ajaxRequest() {

	if (window.XMLHttpRequest) return new XMLHttpRequest();
	else return false;

}



/**
 * Save Colors to Server
 * 
 * Uses the existing Ajax object to save the new
 * color to the global colors.txt file on the server.
 */

function saveColors(value) {
	
	ajaxRequest.open('GET', 'colors/colors.php?color=' + value, true);
	ajaxRequest.send(null);

}