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
var pcolor      = document.getElementById('previewcolor');
var ptitle      = document.getElementById('previewtitle');
var saveBtn     = document.getElementById('save');
var savedTitle  = document.getElementById('savedtitle');
var savedColors = document.getElementById('savedcolors');

var maxSave = 6;
var colors  = [];

var ajaxRequest;

window.onload = init();



/**
 * Initialization
 * 
 * Creates event listeners and displays recent
 * saved colors.
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
 */

function getRgbValue() {

	var value = hexInput.value;
	value = value.replace('#', '');
	
	if (value.length === 3) {
		var r = value.substr(0, 1);
		var g = value.substr(1, 1);
		var b = value.substr(2, 1);
		var hexValue = r + r + g + g + b + b;
	}
	else if (value.length === 6) {
		var hexValue = value;
	}
	
	if (hexValue) {
	
		var rgbValues = hexToRgb(hexValue);
		if (rgbValues) {
			rgbInput.value = rgbValues['r'] + ', ' + rgbValues['g'] + ', ' + rgbValues['b'];
			pcolor.style.background = '#' + hexValue;
			ptitle.innerHTML = '#' + value;
			preview.classList.remove('transparent');
		}
	
	}
	else {
		preview.classList.add('transparent');
	}

}



/**
 * HEX to RGB Converter
 * 
 * @param  hex  the HEX code to convert
 * return  array of RGB values
 */

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
 */

function getHexValue() {

	var value = rgbInput.value;
	
	value = value.replace(' ', '');
	var rgb = value.split(",", 3);
	
	var r = checkColorValue(rgb[0]);
	var g = checkColorValue(rgb[1]);
	var b = checkColorValue(rgb[2]);
	
	if (r !== false && g !== false && b !== false) {
		
		var hexValue = rgbToHex(r, g, b);
		hexInput.value = hexValue;
		pcolor.style.background = '#' + hexValue;
		ptitle.innerHTML = '#' + hexValue;
		preview.classList.remove('transparent');
	
	}
	else {
	
		preview.classList.add('transparent');
	
	}
	
}



/**
 * Check Color Value
 * 
 * @param  n  the number to check
 * return  returns the fixed number, or false if NaN
 */

function checkColorValue(n) {

	n = parseInt(Math.round(n), 10);
	if (isNaN(n)) return false;
	else if (n > 255) return 255;
	else if (n < 0) return 0;
	else return n;

}



/**
 * RGB to HEX Converter
 * 
 * @param  r  the red value
 * @param  g  the green value
 * @param  b  the blue value
 * return  the HEX string
 */

function rgbToHex(r, g, b) {
	
	var hr = componentToHex(r);
	var hg = componentToHex(g);
	var hb = componentToHex(b);
	
	if (hr.substr(0, 1) == hr.substr(1, 1)) {
		if (hg.substr(0, 1) == hg.substr(1, 1)) {
			if (hb.substr(0, 1) == hb.substr(1, 1)) {
				hr = componentToHex(r).substr(0, 1);
				hg = componentToHex(g).substr(0, 1);
				hb = componentToHex(b).substr(0, 1);
			}
		}
	}
	
	return hr + hg + hb;

}



/**
 * Color Value to HEX
 * 
 * Converts an color value to its HEX version.
 * 
 * @param  c  the color value to convert
 * return     the hex value
 */
		
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
	
	if (i > 0) savedTitle.classList.remove('hide');
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