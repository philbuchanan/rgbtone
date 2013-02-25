/**
 * Copyright 2011 Phil Buchanan
 * 
 * RGBTONE is a simple HEX to RGB (and vise versa)
 * color converting app. It also allows you to
 * save colors for later using local storage.
 * 
 * @version 2.1
 */



var color  = null;
var colors = [];

var maxSave = 6;

var hexInput    = document.getElementById('hex');
var rgbInput    = document.getElementById('rgb');
var preview     = document.getElementById('preview');
var pcolor      = document.getElementById('previewcolor');
var ptitle      = document.getElementById('previewtitle');
var savedColors = document.getElementById('savedcolors');
var savedTitle  = document.getElementById('savedtitle');
var saveBtn     = document.getElementById('save');

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
	hexInput.addEventListener('click', function() {hexInput.select();});
	rgbInput.addEventListener('click', function() {rgbInput.select();});
	
	if (retrieveColors()) {
		ajaxRequest = ajaxRequest();
		displayRecents();
	}
	
	hexInput.focus();

}



/**
 * Get RGB Value
 * 
 * Gets the RGB string for a given HEX value and
 * prints it to the RGB input.
 */

function getRgbValue() {

	var value = /^([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hexInput.value.replace(/#/g, ''));
	
	if (value) {
	
		color = value[0];
		
		var rgb = hexToRgb(color);
		if (color.length === 3) {
			var r = color[0] + color[0];
			var g = color[1] + color[1];
			var b = color[2] + color[2];
			rgb = hexToRgb(r + g + b);
		}
		
		rgbInput.value = rgb.r + ', ' + rgb.g + ', ' + rgb.b;
		showSwatch();
	
	}
	else {
	
		color = null;
		rgbInput.value = null;
		hideSwatch();
	
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
		color = hexValue;
		hexInput.value = hexValue;
		showSwatch();
	
	}
	else {
	
		color = null;
		hexInput.value = null;
		hideSwatch();
	
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
	
	if (hr.substr(0, 1) === hr.substr(1, 1)) {
		if (hg.substr(0, 1) === hg.substr(1, 1)) {
			if (hb.substr(0, 1) === hb.substr(1, 1)) {
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
	return hex.length === 1 ? "0" + hex : hex;

}



/**
 * Display Color Swatch
 */

function showSwatch() {

	if (!contains(colors, color)) {
		preview.addEventListener('click', save);
		preview.style.cursor = 'pointer';
		saveBtn.style.display = 'block';
	}
	else {
		saveBtn.style.display = 'none';
	}
	pcolor.style.background = '#' + color;
	ptitle.innerHTML = '#' + color;
	preview.classList.remove('transparent');

}



/**
 * Hide Color Swatch
 */

function hideSwatch() {

	preview.removeEventListener('click', save);
	preview.classList.add('transparent');
	preview.removeAttribute('style');

}



/**
 * Save Colour
 * 
 * Saves six color values (in a single string) to
 * local storage for later retrieval and display.
 */

function save() {

	if (color !== null) {
	
		if (colors.length >= maxSave) colors.pop();
		colors.unshift(color);
		
		localStorage.setItem('colors', JSON.stringify(colors));
		
		displayRecents();
		saveColors(color);
		
		preview.removeEventListener('click', save);
		saveBtn.style.display = 'none';
		preview.style.cursor = 'default';
	
	}

}



/**
 * Array Contains
 * 
 * Returns true if the given array contains the 
 * object, else false.
 */

function contains(arr, obj) {

	var i = arr.length;
	while (i--) {
		if (arr[i] === obj) return true;
	}
	return false;

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
	
	var s = localStorage.getItem('colors');
	
	if (s !== null) colors = JSON.parse(s);
	else colors = [];
	
	return true;

}



/**
 * Display Recent Colors
 * 
 * Displays all saved colors.
 */

function displayRecents() {

	var string = '';
	var last = '';
	
	for (var i = 0; i < colors.length; i++) {
	
		var rgb = hexToRgb(colors[i]);
		
		if (i === 5) last = ' last';
		string += '<div class="recent-preview' + last + '">';
		string += '<div class="color-area" style="background: #' + colors[i] + '"></div>';
		string += '<div class="chip-info">';
		string += '<p><strong>#' + colors[i] + '</strong></p>';
		string += '<p>' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + '</p>';
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