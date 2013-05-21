// Copyright 2011-2013 Phil Buchanan
//
// RGBTONE is a simple HEX to RGB (and vise versa)
// color converting app. It also allows you to
// save colors for later using local storage.
// 
// @version 2.2.1

(function() {
	'use strict';
	
	var colors = {
		valid: false,
		hex: '',
		rgb: {},
		saved: []
	},
	
	settings = {
		maxSave: 6,
		shorthand: true
	},
	
	hexInput    = document.getElementById('hex'),
	rgbInput    = document.getElementById('rgb'),
	preview     = document.getElementById('preview'),
	pcolor      = document.getElementById('previewcolor'),
	ptitle      = document.getElementById('previewtitle'),
	savedColors = document.getElementById('savedcolors'),
	savedTitle  = document.getElementById('savedtitle'),
	saveBtn     = document.getElementById('save'),
	resetBtn    = document.getElementById('reset'),
	
	
	
	// Initialization
	//
	// Creates event listeners and displays recent
	// saved colors
	
	init = function() {
	
		if (!settings.shorthand) {
			document.getElementById('shorthand').style.display = 'none';
		}
		
		hexInput.addEventListener('keyup', getRgbValue);
		rgbInput.addEventListener('keyup', getHexValue);
		hexInput.addEventListener('click', function() {hexInput.select();});
		rgbInput.addEventListener('click', function() {rgbInput.select();});
		resetBtn.addEventListener('click', reset);
		
		displaySavedColors();
	
	},
	
	
	
	// Array Contains
	//
	// Helper function that returns true if the given
	// array contains the object, else false.
	
	contains = function contains(arr, obj) {
	
		var i = 0;
		while (i < arr.length) {
			if (arr[i] === obj) {return true;}
			i += 1;
		}
		return false;
	
	},
	
	
	
	// Update App Display
	//
	// Updates all aspects of the app display
	// including input fields and color chips.
	//
	// @param  mode  the mode that needs to be updated (HEX or RGB)
	
	updateApp = function(mode) {
	
		if (colors.valid) {
		
			if (mode === 'hex') {
				hexInput.value = colors.hex;
			}
			else if (mode === 'rgb') {
				rgbInput.value = colors.rgb.r + ', ' + colors.rgb.g + ', ' + colors.rgb.b;
			}
			
			showSaveBtn();
			pcolor.style.background = '#' + colors.hex;
			ptitle.innerHTML = '#' + colors.hex;
			preview.className = '';
		
		}
		else {
		
			hideSaveBtn();
			preview.className = 'transparent';
		
		}
	
	},
	
	
	
	// Get RGB Value
	//
	// Gets the RGB values for the HEX input string
	// and calls to update the app display.
	
	getRgbValue = function() {
	
		var pattern;
		
		colors.hex = hexInput.value.replace(/\s|#/g, '');
		
		if (settings.shorthand) {
			pattern = /^([0-9a-f]{3}|[0-9a-f]{6})$/i;
		}
		else {
			pattern = /^([0-9a-f]{6})$/i;
		}
		if (pattern.test(colors.hex)) {
			colors.valid = true;
			colors.rgb = hexToRgb(colors.hex);
		}
		else {
			rgbInput.value = '';
			colors.valid = false;
		}
		updateApp('rgb');
	
	},
	
	
	
	// HEX to RGB Converter
	//
	// @param  hex     a valid HEX code to convert (shorthand accepted)
	// return  object  an object of RGB values
	
	hexToRgb = function(hex) {
	
		if (hex.length === 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}
		
		return {
			r: parseInt(hex.slice(0, 2), 16),
			g: parseInt(hex.slice(2, 4), 16),
			b: parseInt(hex.slice(4, 6), 16)
		};
	
	},
	
	
	
	// Get HEX Value
	//
	// Gets the HEX value for the RGB input string
	// and calls to update the app display.
	
	getHexValue = function() {
	
		var r, g, b, rgb;
		
		rgb = rgbInput.value.replace(/\s/g, '').split(',', 3);
		
		r = parseInt(rgb[0], 10);
		g = parseInt(rgb[1], 10);
		b = parseInt(rgb[2], 10);
		
		if (checkColor(r) && checkColor(g) && checkColor(b)) {
			colors.hex = rgbToHex(r, g, b);
			colors.valid = true;
		}
		else {
			hexInput.value = '';
			colors.valid = false;
		}
		updateApp('hex');
	
	},
	
	
	
	// Check Color Value
	//
	// Returns true if a color value falls within the
	// valid color value range (0-255).
	
	checkColor = function(n) {
	
		return (/^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/.test(n)) ? true : false;
	
	},
	
	
	
	// RGB to HEX Converter
	//
	// @param  r       the red value
	// @param  g       the green value
	// @param  b       the blue value
	// return  string  the HEX string
	
	rgbToHex = function(r, g, b) {
	
		var hr, hg, hb;
		
		hr = componentToHex(r);
		hg = componentToHex(g);
		hb = componentToHex(b);
		
		if (settings.shorthand) {
			if (hr[0] === hr[1] && hg[0] === hg[1] && hb[0] === hb[1]) {
				hr = hr[0];
				hg = hg[0];
				hb = hb[0];
			}
		}
		
		return hr + hg + hb;
	
	},
	
	
	
	// Component Color Value to HEX
	//
	// Converts a single color value to HEX.
	//
	// @param  color   the color value to convert
	// return  string  the HEX value string
	
	componentToHex = function(color) {
	
		var hex = color.toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	
	},
	
	
	
	// Save Colour
	//
	// Saves six color values (in a single string) to
	// local storage for later retrieval and display.
	
	save = function() {
	
		if (colors.hex !== null) {
		
			while (colors.saved.length >= settings.maxSave) {
				colors.saved.pop();
			}
			colors.saved.unshift(colors.hex);
			
			localStorage.setItem('colors', JSON.stringify(colors.saved));
			
			hideSaveBtn();
			appendSavedColor(colors.hex, colors.rgb);
		
		}
	
	},
	
	
	
	// Hide Save Button
	//
	// Hides the save button that allows a color to
	// be saved to local storage.
	
	hideSaveBtn = function() {
	
		preview.removeEventListener('click', save);
		saveBtn.style.display = 'none';
		preview.style.cursor = 'default';
	
	},
	
	
	
	// Show Save Button
	//
	// Shows the save button that allows a color to
	// be saved to local storage.
	
	showSaveBtn = function() {
	
		if (!contains(colors.saved, colors.hex)) {
			preview.addEventListener('click', save);
			saveBtn.style.display = 'block';
			preview.style.cursor = 'pointer';
		}
	
	},
	
	
	
	// Retrieve Saved Colours
	//
	// Retrieves any saved colors from local storage
	// and puts them into the colors.saved array.
	// Returns true if there are saved colors,
	// else false.
	
	getSavedColors = function() {
	
		var retrievedColors = localStorage.getItem('colors');
		
		if (retrievedColors !== null) {
			colors.saved = JSON.parse(retrievedColors);
			return true;
		}
		return false;
	
	},
	
	
	
	// Display Saved Colors
	
	displaySavedColors = function() {
	
		var i;
		
		getSavedColors();
		
		for (i = colors.saved.length - 1; i >= 0; i -= 1) {
			appendSavedColor(colors.saved[i], hexToRgb(colors.saved[i]));
		}
	
	},
	
	
	
	// Append Saved Color
	//
	// Appends a new saved color to the block of
	// color chips.
	//
	// @param  hex  the hex color value string
	// @param  rgb  an object of rgb color values
	
	appendSavedColor = function(hex, rgb) {
	
		var chip = document.createElement('div'),
			color = document.createElement('div'),
			info = document.createElement('div'),
			hexString = document.createElement('p'),
			rgbString = document.createElement('p');
		
		while (savedColors.children.length >= settings.maxSave) {
			savedColors.removeChild(savedColors.lastChild);
		}
		
		chip.className = 'recent-preview';
		color.className = 'color-area';
		color.style.backgroundColor = '#' + hex;
		info.className = 'chip-info';
		hexString.style.fontWeight = 'bold';
		hexString.textContent = '#' + hex;
		rgbString.textContent = rgb.r + ', ' + rgb.g + ', ' + rgb.b;
		
		info.appendChild(hexString);
		info.appendChild(rgbString);
		chip.appendChild(color);
		chip.appendChild(info);
		
		savedColors.insertBefore(chip, savedColors.firstChild);
		
		if (colors.saved.length > 0) {savedTitle.className = '';}
	
	},
	
	
	
	// Reset Saved Colors
	//
	// Removes all local storage data and refreshes
	// the window.
	
	reset = function() {
	
		if (confirm('Are you sure you want to remove all saved colors?')) {
			localStorage.clear();
			location.reload();
		}
	
	};
	
	
	
	// Initialize the app
	
	init();

}());