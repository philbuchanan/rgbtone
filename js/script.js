/**
 * Copyright 2011-2014 Phil Buchanan
 * 
 * RGBTONE is a simple HEX to RGB (and vise versa) color converting app.
 * It also allows you to save colors for later using local storage.
 * 
 * @version 3.0
 */

function Converter() {
	this.settings = {
		shorthand: true,
		maxSave: 10
	};
	
	this.body = document.body;
	this.form = document.getElementById('form');
	this.hexInput = document.getElementById('hex');
	this.rgbInput = document.getElementById('rgb');
	
	this.savedColors = this.getSavedColors() || [];
	this.displaySavedColors();
	
	(function() {
		var color = new Color();
		
		this.hexInput.addEventListener('keyup', color.getRgbValue.bind(color));
		this.rgbInput.addEventListener('keyup', color.getHexValue.bind(color));
		this.hexInput.addEventListener('click', this.selectInput);
		this.rgbInput.addEventListener('click', this.selectInput);
		this.form.addEventListener('submit', function(event) {
			event.preventDefault();
			this.saveColor.call(this, color);
		}.bind(this));
	}).call(this);
};

Converter.prototype.updateApp = function(color, mode) {
	var inputTextColor = this.getContrast(color.hex);
	
	if (color.valid) {
		if (mode === 'hex') {
			this.hexInput.value = color.hex;
		}
		else if (mode === 'rgb') {
			this.rgbInput.value = color.rgb.r + ', ' + color.rgb.g + ', ' + color.rgb.b;
		}
		
		this.body.style.backgroundColor = '#' + color.hex;
		this.hexInput.className = this.rgbInput.className = inputTextColor;
	}
	else {
		this.body.removeAttribute('style');
		this.hexInput.className = this.rgbInput.className = 'dark';
	}
}

Converter.prototype.getSavedColors = function() {
	var retrievedColors = localStorage.getItem('colors');
	
	if (retrievedColors !== null) {
		return JSON.parse(retrievedColors);
	}
	return false;
};

Converter.prototype.saveColor = function(color) {
	if (color.valid === true) {
		while (this.savedColors.length >= this.settings.maxSave) {
			this.savedColors.pop();
		}
		this.savedColors.unshift(color);
		
		localStorage.setItem('colors', JSON.stringify(this.savedColors));
		this.displaySavedColors();
	}
};

Converter.prototype.displaySavedColors = function() {
	var _self = this,
		savedColorsNode = document.getElementById('saved-colors'),
		domFrag = document.createDocumentFragment();
	
	this.savedColors.forEach(function(color, i, arr) {
		var colorNode = document.createElement('div'),
			colorText = document.createElement('p');
		
		colorNode.className = 'color ' + _self.getContrast(color.hex);
		colorNode.style.backgroundColor = '#' + color.hex;
		colorText.innerHTML = '#' + color.hex + '<br/>' + color.rgb.r + ', ' + color.rgb.g + ', ' + color.rgb.b;
		colorNode.appendChild(colorText);
		
		domFrag.appendChild(colorNode);
	});
	
	while (savedColorsNode.firstChild) {
    	savedColorsNode.removeChild(savedColorsNode.firstChild);
	}
	savedColorsNode.appendChild(domFrag);
};

Converter.prototype.selectInput = function() {
	this.select();
}

Converter.prototype.getContrast = function(hex) {
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	return (parseInt(hex, 16) > 0xffffff / 2) ? 'dark' : 'light';
};

function Color() {
	this.hex = '';
	this.rgb = {};
};

Color.prototype.getRgbValue = function() {
	var pattern = /^([0-9a-f]{6})$/i;
	
	this.hex = converter.hexInput.value.replace(/\s|#/g, '');
	
	if (converter.settings.shorthand) {
		pattern = /^([0-9a-f]{3}|[0-9a-f]{6})$/i;
	}
	
	if (pattern.test(this.hex)) {
		this.valid = true;
		this.rgb = this.hexToRgb();
	}
	else {
		converter.rgbInput.value = '';
		this.valid = false;
	}
	
	converter.updateApp(this, 'rgb');
};

Color.prototype.hexToRgb = function() {
	if (this.hex.length === 3) {
		this.hex = this.hex[0] + this.hex[0] + this.hex[1] + this.hex[1] + this.hex[2] + this.hex[2];
	}
	
	return {
		r: parseInt(this.hex.slice(0, 2), 16),
		g: parseInt(this.hex.slice(2, 4), 16),
		b: parseInt(this.hex.slice(4, 6), 16)
	};
};
	
Color.prototype.getHexValue = function() {
	var r, g, b;
	
	this.rgb = converter.rgbInput.value.replace(/\s/g, '').split(',', 3);
	
	r = parseInt(this.rgb[0], 10);
	g = parseInt(this.rgb[1], 10);
	b = parseInt(this.rgb[2], 10);
	
	if (this.checkColor(r) && this.checkColor(g) && this.checkColor(b)) {
		this.hex = this.rgbToHex(r, g, b);
		this.valid = true;
	}
	else {
		converter.hexInput.value = '';
		this.valid = false;
	}
	converter.updateApp(this, 'hex');
};
	
Color.prototype.checkColor = function(n) {
	return (/^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/.test(n)) ? true : false;
};
	
Color.prototype.rgbToHex = function(r, g, b) {
	var hr, hg, hb;
	
	hr = this.componentToHex(r);
	hg = this.componentToHex(g);
	hb = this.componentToHex(b);
	
	if (converter.settings.shorthand) {
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