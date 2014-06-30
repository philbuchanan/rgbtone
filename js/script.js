// Copyright 2011-2013 Phil Buchanan
//
// RGBTONE is a simple HEX to RGB (and vise versa)
// color converting app. It also allows you to
// save colors for later using local storage.
// 
// @version 3.0

function Converter() {
	var _self = this;
	
	this.body = document.body;
	this.hexInput = document.getElementById('hex');
	this.rgbInput = document.getElementById('rgb');
	
	(function() {
		var color = new Color();
		
		_self.hexInput.addEventListener('keyup', color.getRgbValue.bind(color));
		_self.rgbInput.addEventListener('keyup', color.getHexValue.bind(color));
	}());
};

function Color() {
	this.valid = false;
	this.hex = '';
	this.rgb = {};
};

Color.prototype.getRgbValue = function() {
	var pattern = /^([0-9a-f]{6})$/i;
	
	this.hex = converter.hexInput.value.replace(/\s|#/g, '');
	
	/*if (settings.shorthand) {
		pattern = /^([0-9a-f]{3}|[0-9a-f]{6})$/i;
	}*/
	
	if (pattern.test(this.hex)) {
		this.valid = true;
		this.rgb = hexToRgb(this.hex);
	}
	else {
		converter.rgbInput.value = '';
		this.valid = false;
	}
	
	console.log(this);
	//updateApp('rgb');
};

Color.prototype.hexToRgb = function(hex) {
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	
	return {
		r: parseInt(hex.slice(0, 2), 16),
		g: parseInt(hex.slice(2, 4), 16),
		b: parseInt(hex.slice(4, 6), 16)
	};
};
	
Color.prototype.getHexValue = function() {
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
};
	
Color.prototype.checkColor = function(n) {
	return (/^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/.test(n)) ? true : false;
};
	
Color.prototype.rgbToHex = function(r, g, b) {
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
};
	
Color.prototype.componentToHex = function(color) {
	var hex = color.toString(16);
	return hex.length === 1 ? '0' + hex : hex;
};

var converter = new Converter();