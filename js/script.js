/**
 * Copyright 2011 Phil Buchanan
 * 
 * RGBTONE is a simple HEX to RGB (and vise versa)
 * color converting app. It also allows you to
 * save colors for later using local storage.
 * 
 * @version 2.1
 */



// Settings
var maxSave  = 6;
var globSave = false;

// Colors
var colors = [];
var hex    = null;
var rgb    = null;

var hexInput    = document.getElementById('hex');
var rgbInput    = document.getElementById('rgb');
var preview     = document.getElementById('preview');
var pcolor      = document.getElementById('previewcolor');
var ptitle      = document.getElementById('previewtitle');
var savedColors = document.getElementById('savedcolors');
var savedTitle  = document.getElementById('savedtitle');
var saveBtn     = document.getElementById('save');
var resetBtn    = document.getElementById('reset');

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
	resetBtn.addEventListener('click', reset);
	
	if (getSavedColors()) {
		displaySavedColors();
	}
	if (globSave) ajaxRequest = ajaxRequest();
	
	hexInput.focus();

}



/**
 * Get RGB Value
 * 
 * Gets the RGB string for a given HEX value and
 * prints it to the RGB input.
 */

function getRgbValue() {

	var valid = /^([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hexInput.value.replace(/#/g, ''));
	
	if (valid) {
		hex = valid[0];
		rgb = hexToRgb(hex);
		rgbInput.value = rgb.r + ', ' + rgb.g + ', ' + rgb.b;
		showSwatch();
	}
	else {
		hex = rgb = rgbInput.value = null;
		hideSwatch();
	}

}



/**
 * HEX to RGB Converter
 * 
 * @param  hex  the HEX code to convert (shorthand accepted)
 * return  array of RGB values
 */

function hexToRgb(value) {

	if (value.length === 3) {
		value = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
	}
	
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
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

	var r, g, b;
	var value = rgbInput.value.replace(/\s/g, '');
	
	rgb = value.split(",", 3);
	
	r = checkColor(rgb[0]);
	g = checkColor(rgb[1]);
	b = checkColor(rgb[2]);
	
	if (r && g && b) {
		hex = rgbToHex(r, g, b);
		hexInput.value = hex;
		showSwatch();
	}
	else {
		hex = rgb = hexInput.value = null;
		hideSwatch();
	}
	
}



/**
 * Check Color Value
 *
 * Checks to ensure that a color value falls
 * within the valid rgb value range (0-255).
 */

function checkColor(n) {

	var value = /^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/.test(n);
	return value ? parseInt(n) : false;

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

	var hr, hg, hb;
	
	hr = componentToHex(r);
	hg = componentToHex(g);
	hb = componentToHex(b);
	
	if (hr[0] === hr[1] && hg[0] === hg[1] && hb[0] === hb[1]) {
		hr = hr[0];
		hg = hg[0];
		hb = hb[0];
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

	var h = c.toString(16);
	return h.length === 1 ? "0" + h : h;

}



/**
 * Display Color Swatch
 */

function showSwatch() {

	if (!contains(colors, hex)) {
		preview.addEventListener('click', save);
		preview.style.cursor = 'pointer';
		saveBtn.style.display = 'block';
	}
	else {
		preview.removeEventListener('click', save);
		preview.style.cursor = 'default';
		saveBtn.style.display = 'none';
	}
	pcolor.style.background = '#' + hex;
	ptitle.innerHTML = '#' + hex;
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
 * Array Contains
 * 
 * Helper function that returns true if the given
 * array contains the object, else false.
 */

function contains(arr, obj) {

	var i = arr.length;
	while (i--) {
		if (arr[i] === obj) return true;
	}
	return false;

}



/**
 * Save Colour
 * 
 * Saves six color values (in a single string) to
 * local storage for later retrieval and display.
 */

function save() {

	if (hex !== null) {
	
		if (colors.length >= maxSave) colors.pop();
		colors.unshift(hex);
		
		localStorage.setItem('colors', JSON.stringify(colors));
		
		displaySavedColors();
		if (globSave) saveColors(hex);
		
		preview.removeEventListener('click', save);
		saveBtn.style.display = 'none';
		preview.style.cursor = 'default';
	
	}

}



/**
 * Retrieve Saved Colours
 *
 * Retrieves any saved colors from local storage
 * and puts them into the colors array. Returns
 * true if there are saved colors, else false.
 */

function getSavedColors() {

	var s = localStorage.getItem('colors');
	
	if (s !== null) {
		colors = JSON.parse(s);
		return true;
	}
	else {
		return false;
	}

}



/**
 * Display Saved Colors
 */

function displaySavedColors() {

	var string = '';
	var savedRgb = [];
	
	for (var i = 0; i < colors.length; i++) {
	
		savedRgb = hexToRgb(colors[i]);
		
		if (i === maxSave) break;
		if ((i + 1) % 6 === 0) var last = ' last';
		else var last = '';
		
		string += '<div class="recent-preview' + last + '">';
		string += '<div class="color-area" style="background: #' + colors[i] + '"></div>';
		string += '<div class="chip-info">';
		string += '<p><strong>#' + colors[i] + '</strong></p>';
		string += '<p>' + savedRgb.r + ', ' + savedRgb.g + ', ' + savedRgb.b + '</p>';
		string += '</div></div>';
	
	}
	
	if (i > 0) savedTitle.classList.remove('hide');
	savedColors.innerHTML = string;

}



/**
 * Reset Saved Colors
 * 
 * Removes all local storage data and refreshes
 * the window.
 */

function reset() {

	if (confirm('Are you sure you want to remove all saved colors?')) {
		localStorage.clear();
		location.reload();
	}

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