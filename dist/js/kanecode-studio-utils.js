class KCUtils {
	uuid = (t=8) => crypto.getRandomValues(new Uint8Array(t)).reduce(((t,e)=>t+=(e&=63)<36?e.toString(36):e<62?(e-26).toString(36).toUpperCase():e<63?'_':'-'),'');
	sheetToString = (sheet) => sheet.cssRules ? Array.from(sheet.cssRules).map(rule => (rule.cssText || '')).join('\n') : '';
	addStyle = (sheet, sheetElement, selector, attribute, value, priority) => {
		let response = false;
		[].some.call(sheet.rules, (rule) => {
			if (selector === rule.selectorText) {
				response = true;
				return true;
			}
		});
		if (!response) { try { sheet.addRule(selector) } catch {} }
		response = false;
		[].some.call(sheet.rules, (rule) => {
			if (selector === rule.selectorText) {
				rule.style.setProperty(attribute, value, priority);
				sheetElement.innerHTML = this.sheetToString(sheet);
				response = true;
				return true;
			}
		});
		return response;
	};
	getStyle = (sheet, selector, attribute) => {
		let value = false;
		[].some.call(sheet.rules, (rule) => {
			if (selector === rule.selectorText)
				return [].some.call(rule.style, (style) => {
					if (attribute === style)
						value = rule.style.getPropertyValue(attribute);
				});
		});
		return value;
	};
	removeStyle = (sheet, selector, attribute) => {
		let value = false;
		[].some.call(sheet.rules, (rule) => {
			if (selector === rule.selectorText)
				return [].some.call(rule.style, (style) => {
					if (attribute === style)
						if (rule.style.removeProperty(attribute) !== undefined)
							value = true;
				});
		});
		return value;
	};
};
const kc_utils = new KCUtils();

class KCStudio_Color {
	constructor(color = '#fff') {
		this.color = color;
	}

	set rgba(color) {
		if (this.getColorType(color) !== 'rgba')
			throw new Error('Invalid color type');
		color = color.replace(/\s/g, '').toLowerCase().replace('rgba(', '').replace(')', '');
		const rgba = color.split(',');
		this.#a = parseFloat(rgba[3]);
		this.#r = parseInt(rgba[0]);
		this.#g = parseInt(rgba[1]);
		this.b = parseInt(rgba[2]);
	}

	get rgba() {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
	}

	set hsla(color) {
		if (this.getColorType(color) !== 'hsla')
			throw new Error('Invalid color type');
		color = color.replace(/\s/g, '').toLowerCase().replace('hsla(', '').replace(')', '');
		const hsla = color.split(',');
		this.#a = parseFloat(hsla[3]);
		this.#h = parseInt(hsla[0]);
		this.#s = parseInt(hsla[1]);
		this.l = parseInt(hsla[2]);
	}

	get hsla() {
		return `hsla(${this.h}, ${this.s}, ${this.l}, ${this.a})`;
	}

	set hsva(color) {
		if (this.getColorType(color) !== 'hsva')
			throw new Error('Invalid color type');
		color = color.replace(/\s/g, '').toLowerCase().replace('hsva(', '').replace(')', '');
		const hsva = color.split(',');
		this.#a = parseFloat(hsva[3]);
		this.#h = parseInt(hsva[0]);
		this.#s = parseInt(hsva[1]);
		this.v = parseInt(hsva[2]);
	}

	get hsva() {
		return `hsva(${this.h}, ${this.s}%, ${this.v}%, ${this.a})`;
	}

	set rgb(color) {
		if (this.getColorType(color) !== 'rgb')
			throw new Error('Invalid color type');
		color = color.replace(/\s/g, '').toLowerCase().replace('rgb(', '').replace(')', '');
		const rgb = color.split(',');
		this.#a = 1;
		this.#r = parseInt(rgb[0]);
		this.#g = parseInt(rgb[1]);
		this.b = parseInt(rgb[2]);
	}

	get rgb() {
		return `rgb(${this.r}, ${this.g}, ${this.b})`;
	}

	set hsl(color) {
		if (this.getColorType(color) !== 'hsl')
			throw new Error('Invalid color type');
		color = color.replace(/\s/g, '').toLowerCase().replace('hsl(', '').replace(')', '');
		const hsl = color.split(',');
		this.#a = 1;
		this.#h = parseInt(hsl[0]);
		this.#s = parseInt(hsl[1]);
		this.l = parseInt(hsl[2]);
	}

	get hsl() {
		return `hsl(${this.h}, ${parseInt(this.s)}%, ${parseInt(this.l)}%)`;
	}

	set hsv(color) {
		if (this.getColorType(color) !== 'hsv')
			throw new Error('Invalid color type');
		color = color.replace(/\s/g, '').toLowerCase().replace('hsv(', '').replace(')', '');
		const hsv = color.split(',');
		this.#a = 1;
		this.#h = parseInt(hsv[0]);
		this.#s = parseInt(hsv[1]);
		this.v = parseInt(hsv[2]);
	}

	get hsv() {
		return `hsl(${this.h}, ${parseInt(this.s)}%, ${parseInt(this.v)}%)`;
	}

	set hex(color) {
		if (this.getColorType(color) !== 'hex')
			throw new Error('Invalid color type');
		color = color.replace(/\s/g, '').toLowerCase().replace('#', '');
		switch (color.length) {
			case 3:
				this.#a = 1;
				this.#r = parseInt(color[0] + color[0], 16);
				this.#g = parseInt(color[1] + color[1], 16);
				this.b = parseInt(color[2] + color[2], 16);
				break;
			case 4:
				this.#a = parseFloat(parseInt(color[3] + color[3], 16) / 255);
				this.#r = parseInt(color[0] + color[0], 16);
				this.#g = parseInt(color[1] + color[1], 16);
				this.b = parseInt(color[2] + color[2], 16);
				break;
			case 6:
				this.#a = 1;
				this.#r = parseInt(color[0] + color[1], 16);
				this.#g = parseInt(color[2] + color[3], 16);
				this.b = parseInt(color[4] + color[5], 16);
				break;
			case 8:
				this.#a = parseFloat(parseInt(color[6] + color[7], 16) / 255);
				this.#r = parseInt(color[0] + color[1], 16);
				this.#g = parseInt(color[2] + color[3], 16);
				this.b = parseInt(color[4] + color[5], 16);
				break;
		}
	}

	get hex() {
		return `#${parseInt(this.r).toString(16).padStart(2, '0')}${parseInt(this.g).toString(16).padStart(2, '0')}${parseInt(this.b).toString(16).padStart(2, '0')}`;
	}

	set color(color) {
		switch (this.getColorType(color)) {
			case 'hex': this.hex = color; break;
			case 'rgb': this.rgb = color; break;
			case 'hsl': this.hsl = color; break;
			case 'hsv': this.hsv = color; break;
			case 'rgba': this.rgba = color; break;
			case 'hsla': this.hsla = color; break;
			case 'hsva': this.hsva = color; break;
			default: throw new Error('Invalid color type');
		}
	}

	get color() {
		if (this.a === 1)
			return this.rgb;
		else
			return this.rgba;
	}

	set alpha(value) {
		if (typeof value !== 'number')
			throw new Error('Invalid alpha value');
		if (value < 0 || value > 1)
			throw new Error('Invalid alpha value');
		this.#a = value;
	}
	get alpha() { return this.#a; }
	set a(value) { this.alpha = value; }
	get a() { return this.alpha; }

	set red(value) {
		if (typeof value !== 'number')
			throw new Error('Invalid red value');
		if (value < 0 || value > 255)
			throw new Error('Invalid red value');
		this.#r = value;
		this.#rgbToHsl();
		this.#rgbToHsv();
	}
	get red() { return this.#r; }
	set r(value) { this.red = value; }
	get r() { return this.red; }

	set green(value) {
		if (typeof value !== 'number')
			throw new Error('Invalid green value');
		if (value < 0 || value > 255)
			throw new Error('Invalid green value');
		this.#g = value;
		this.#rgbToHsl();
		this.#rgbToHsv();
	}
	get green() { return this.#g; }
	set g(value) { this.green = value; }
	get g() { return this.green; }

	set blue(value) {
		if (typeof value !== 'number')
			throw new Error('Invalid blue value');
		if (value < 0 || value > 255)
			throw new Error('Invalid blue value');
		this.#b = value;
		this.#rgbToHsl();
		this.#rgbToHsv();
	}
	get blue() { return this.#b; }
	set b(value) { this.blue = value; }
	get b() { return this.blue; }

	set hue(value) {
		if (typeof value !== 'number')
			throw new Error('Invalid hue value');
		if (value < 0 || value > 360)
			throw new Error('Invalid hue value');
		this.#h = value;
		this.#hsvToRgb();
	}
	get hue() { return this.#h; }
	set h(value) { this.hue = value; }
	get h() { return this.hue; }

	set saturation(value) {
		if (typeof value !== 'number')
			throw new Error('Invalid saturation value');
		if (value < 0 || value > 100)
			throw new Error('Invalid saturation value');
		this.#s = value;
		this.#hsvToRgb();
		this.#hsvToHsl();
	}
	get saturation() { return this.#s; }
	set s(value) { this.saturation = value; }
	get s() { return this.saturation; }

	set value(value) {
		if (typeof value !== 'number')
			throw new Error('Invalid value value');
		if (value < 0 || value > 100)
			throw new Error('Invalid value value');
		this.#v = value;
		this.#hsvToRgb();
		this.#hsvToHsl();
	}
	get value() { return this.#v; }
	set v(value) { this.value = value; }
	get v() { return this.value; }

	set lightness(value) {
		if (typeof value !== 'number')
			throw new Error('Invalid lightness value');
		if (value < 0 || value > 100)
			throw new Error('Invalid lightness value');
		this.#l = value;
		this.#hslToRgb();
		this.#hslToHsv();
	}
	get lightness() { return this.#l; }
	set l(value) { this.lightness = value; }
	get l() { return this.lightness; }


	/**
	 * Converts RGB (Red, Green, Blue) to HSL (Hue, Saturation, Lightness)
	 * @param {number} r - Red value (0-255)
	 * @param {number} g - Green value (0-255)
	 * @param {number} b - Blue value (0-255)
	 * @returns {object} - HSL object with h (0-360), s (0-100), l (0-100)
	 * @example
	 * const hsl = rgbToHsl(255, 0, 0);
	 * console.log(hsl); // { h: 0, s: 100, l: 50 }
	 */
	rgbToHsl(r, g, b) {
		const rgb = { r: r, g: g, b: b };
		const hsl = { h: 0, s: 0, l: 0 };

		// Catch invalid RGB values
		for (const key in rgb) {
			if (typeof rgb[key] !== 'number')
				throw new Error('Invalid RGB value');
			if (rgb[key] < 0 || rgb[key] > 255)
				throw new Error('Invalid RGB value');
		}

		// Convert RGB to HSL
		r /= 255;
		g /= 255;
		b /= 255;
		const l = Math.max(r, g, b);
		const s = l - Math.min(r, g, b);
		const h = s ? l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s : 0;
		hsl.h = 60 * h < 0 ? 60 * h + 360 : 60 * h;
		hsl.s = 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0);
		hsl.l = (100 * (2 * l - s)) / 2;
		return hsl;
	}

	/**
	 * Converts HSL (Hue, Saturation, Lightness) to RGB (Red, Green, Blue)
	 * @param {number} h - Hue value (0-360)
	 * @param {number} s - Saturation value (0-100)
	 * @param {number} l - Lightness value (0-100)
	 * @returns {object} - RGB object with r (0-255), g (0-255), b (0-255)
	 * @example
	 * const rgb = hslToRgb(0, 100, 50);
	 * console.log(rgb); // { r: 255, g: 0, b: 0 }
	 */
	hslToRgb(h, s, l) {
		const hsl = { h: h, s: s, l: l };
		const rgb = { r: 0, g: 0, b: 0 };

		// Catch invalid HSL values
		if (typeof hsl.h !== 'number')
			throw new Error('Invalid HSL value');
		if (hsl.h < 0 || hsl.h > 360)
			throw new Error('Invalid HSL value');
		for (const key in hsl) {
			if (key === 'h')
				continue;
			if (typeof hsl[key] !== 'number')
				throw new Error('Invalid HSL value');
			if (hsl[key] < 0 || hsl[key] > 100)
				throw new Error('Invalid HSL value');
		}
		
		// Convert HSL to RGB
		s /= 100;
		l /= 100;
		const k = n => (n + h / 30) % 12;
		const a = s * Math.min(l, 1 - l);
		const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
		rgb.r = 255 * f(0);
		rgb.g = 255 * f(8);
		rgb.b = 255 * f(4);
		return rgb;
	};

	/**
	 * Converts RGB (Red, Green, Blue) to HSV (Hue, Saturation, Value)
	 * @param {number} r - Red value (0-255)
	 * @param {number} g - Green value (0-255)
	 * @param {number} b - Blue value (0-255)
	 * @returns {object} - HSV object with h (0-360), s (0-100), v (0-100)
	 * @example
	 * const hsv = rgbToHsv(255, 0, 0);
	 * console.log(hsv); // { h: 0, s: 100, v: 100 }
	 */
	rgbToHsv(r, g, b) {
		const rgb = { r: r, g: g, b: b };
		const hsv = { h: 0, s: 0, v: 0 };

		// Catch invalid RGB values
		for (const key in rgb) {
			if (typeof rgb[key] !== 'number')
				throw new Error('Invalid RGB value');
			if (rgb[key] < 0 || rgb[key] > 255)
				throw new Error('Invalid RGB value');
		}

		// Convert RGB to HSV
		r /= 255;
		g /= 255;
		b /= 255;
		const v = Math.max(r, g, b);
		const n = v - Math.min(r, g, b);
		const h = n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
		hsv.h = 60 * (h < 0 ? h + 6 : h);
		hsv.s = v && (n / v) * 100;
		hsv.v = v * 100;
		return hsv;
	}

	/**
	 * Converts HSV (Hue, Saturation, Value) to RGB (Red, Green, Blue)
	 * @param {number} h - Hue value (0-360)
	 * @param {number} s - Saturation value (0-100)
	 * @param {number} v - Value value (0-100)
	 * @returns {object} - RGB object with r (0-255), g (0-255), b (0-255)
	 * @example
	 * const rgb = hsvToRgb(0, 100, 100);
	 * console.log(rgb); // { r: 255, g: 0, b: 0 }
	 */
	hsvToRgb(h, s, v) {
		const hsv = { h: h, s: s, v: v };
		const rgb = { r: 0, g: 0, b: 0 };

		// Catch invalid HSV values
		if (typeof hsv.h !== 'number')
			throw new Error('Invalid HSV value');
		if (hsv.h < 0 || hsv.h > 360)
			throw new Error('Invalid HSV value');
		for (const key in hsv) {
			if (key === 'h')
				continue;
			if (typeof hsv[key] !== 'number')
				throw new Error('Invalid HSV value');
			if (hsv[key] < 0 || hsv[key] > 100)
				throw new Error('Invalid HSV value');
		}
		
		// Convert HSV to RGB
		s /= 100;
		v /= 100;
		const k = (n) => (n + h / 60) % 6;
		const f = (n) => v * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
		rgb.r = 255 * f(5);
		rgb.g = 255 * f(3);
		rgb.b = 255 * f(1);
		return rgb;
	}

	/**
	 * Converts HSL (Hue, Saturation, Lightness) to HSV (Hue, Saturation, Value)
	 * @param {number} h - Hue value (0-360)
	 * @param {number} s - Saturation value (0-100)
	 * @param {number} l - Lightness value (0-100)
	 * @returns {object} - HSV object with h (0-360), s (0-100), v (0-100)
	 * @example
	 * const hsv = hslToHsv(0, 100, 50);
	 * console.log(hsv); // { h: 0, s: 100, v: 50 }
	 */
	hslToHsv(h, s, l) {
		const rgb = this.hslToRgb(h, s, l);
		const hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);
		return { h: h, s: hsv.s, v: hsv.v };
	}

	/**
	 * Converts HSV (Hue, Saturation, Value) to HSL (Hue, Saturation, Lightness)
	 * @param {number} h - Hue value (0-360)
	 * @param {number} s - Saturation value (0-100)
	 * @param {number} v - Value value (0-100)
	 * @returns {object} - HSL object with h (0-360), s (0-100), l (0-100)
	 * @example
	 * const hsl = hsvToHsl(0, 100, 50);
	 * console.log(hsl); // { h: 0, s: 100, l: 50 }
	 */
	hsvToHsl(h, s, v) {
		const rgb = this.hsvToRgb(h, s, v);
		const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
		return { h: h, s: s, l: hsl.l };
	}

	getColorType(color) {
		if (this.isRgba(color))
			return 'rgba';
		if (this.isHsla(color))
			return 'hsla';
		if (this.isHsva(color))
			return 'hsva';
		if (this.isRgb(color))
			return 'rgb';
		if (this.isHsl(color))
			return 'hsl';
		if (this.isHsv(color))
			return 'hsv';
		if (this.isHex(color))
			return 'hex';
		return undefined;
	}

	isHex = (color) => {
		if (typeof color !== 'string')
			return false;
		color = color.trim().toUpperCase();
		if (!color.startsWith('#'))
			return false;
		color = color.substring(1);
		if (![3, 4, 6, 8].includes(color.length))
			return false;
		if (!color.match(/^[0-9A-F]+$/))
			return false;
		return true;
	}

	isRgb = (color) => {
		if (typeof color !== 'string')
			return false;
		color = color.trim().toLowerCase();
		if (!color.startsWith('rgb'))
			return false;
		color = color.replace(/\s/g, '');
		if (!color.startsWith('rgb(') || !color.endsWith(')'))
			return false;
		color = color.substring(4, color.length - 1);
		const parts = color.split(',');
		if (parts.length !== 3)
			return false;
		for (let i = 0; i < parts.length; i++) {
			if (!parts[i].trim().match(/^[0-9.]+$/))
				return false;
			if (isNaN(parts[i]) || parseFloat(parts[i]) < 0 || parseFloat(parts[i]) > 255)
				return false;
		}
		return true;
	}

	isRgba = (color) => {
		if (typeof color !== 'string')
			return false;
		color = color.trim().toLowerCase();
		if (!color.startsWith('rgba'))
			return false;
		color = color.replace(/\s/g, '');
		if (!color.startsWith('rgba(') || !color.endsWith(')'))
			return false;
		color = color.substring(5, color.length - 1);
		const parts = color.split(',');
		if (parts.length !== 4)
			return false;
			for (let i = 0; i < parts.length - 1; i++) {
				if (!parts[i].trim().match(/^[0-9.]+$/))
					return false;
				if (isNaN(parts[i]) || parseFloat(parts[i]) < 0 || parseFloat(parts[i]) > 255)
					return false;
			}
		if (isNaN(parseFloat(parts[3])) || parseFloat(parts[3]) < 0 || parseFloat(parts[3]) > 1)
			return false;
		return true;
	}
	
	isHsl = (color) => {
		if (typeof color !== 'string')
			return false;
		color = color.trim().toLowerCase();
		if (!color.startsWith('hsl'))
			return false;
		color = color.replace(/\s/g, '');
		if (!color.startsWith('hsl(') || !color.endsWith(')'))
			return false;
		color = color.substring(4, color.length - 1);
		const parts = color.split(',');
		if (parts.length !== 3)
			return false;
		if (!parts[0].trim().match(/^[0-9.]+$/))
			return false;
		if (isNaN(parts[0]) || parseFloat(parts[0]) < 0 || parseFloat(parts[0]) > 360)
			return false;
		for (let i = 1; i < parts.length; i++) {
			if (!parts[i].trim().match(/^[0-9.]+%$/))
				return false;
			parts[i] = parts[i].substring(0, parts[i].length - 1);
			if (isNaN(parts[i]) || parseInt(parts[i]) < 0 || parseInt(parts[i]) > 100)
				return false;
		}
		return true;
	}

	isHsla = (color) => {
		if (typeof color !== 'string')
			return false;
		color = color.trim().toLowerCase();
		if (!color.startsWith('hsla'))
			return false;
		color = color.replace(/\s/g, '');
		if (!color.startsWith('hsla(') || !color.endsWith(')'))
			return false;
		color = color.substring(5, color.length - 1);
		const parts = color.split(',');
		if (parts.length !== 4)
			return false;
		if (!parts[0].trim().match(/^[0-9.]+$/))
			return false;
		if (isNaN(parts[0]) || parseInt(parts[0]) < 0 || parseInt(parts[0]) > 360)
			return false;
		for (let i = 1; i < parts.length - 1; i++) {
			if (!parts[i].trim().match(/^[0-9.]+%$/))
				return false;
			parts[i] = parts[i].substring(0, parts[i].length - 1);
			if (isNaN(parts[i]) || parseInt(parts[i]) < 0 || parseInt(parts[i]) > 100)
				return false;
		}
		if (isNaN(parseFloat(parts[3])) || parseFloat(parts[3]) < 0 || parseFloat(parts[3]) > 1)
			return false;
		return true;
	}

	isHsv = (color) => {
		if (typeof color !== 'string')
			return false;
		color = color.trim().toLowerCase();
		if (!color.startsWith('hsv'))
			return false;
		color = color.replace(/\s/g, '');
		if (!color.startsWith('hsv(') || !color.endsWith(')'))
			return false;
		color = color.substring(4, color.length - 1);
		const parts = color.split(',');
		if (parts.length !== 3)
			return false;
		if (!parts[0].trim().match(/^[0-9.]+$/))
			return false;
		if (isNaN(parts[0]) || parseInt(parts[0]) < 0 || parseInt(parts[0]) > 360)
			return false;
		for (let i = 1; i < parts.length; i++) {
			if (!parts[i].trim().match(/^[0-9.]+%$/))
				return false;
			parts[i] = parts[i].substring(0, parts[i].length - 1);
			if (isNaN(parts[i]) || parseInt(parts[i]) < 0 || parseInt(parts[i]) > 100)
				return false;
		}
		return true;
	}

	isHsva = (color) => {
		if (typeof color !== 'string')
			return false;
		color = color.trim().toLowerCase();
		if (!color.startsWith('hsva'))
			return false;
		color = color.replace(/\s/g, '');
		if (!color.startsWith('hsva(') || !color.endsWith(')'))
			return false;
		color = color.substring(5, color.length - 1);
		const parts = color.split(',');
		if (parts.length !== 4)
			return false;
		if (!parts[0].trim().match(/^[0-9.]+$/))
			return false;
		if (isNaN(parts[0]) || parseInt(parts[0]) < 0 || parseInt(parts[0]) > 360)
			return false;
		for (let i = 1; i < parts.length - 1; i++) {
			if (!parts[i].trim().match(/^[0-9.]+%$/))
				return false;
			parts[i] = parts[i].substring(0, parts[i].length - 1);
			if (isNaN(parts[i]) || parseInt(parts[i]) < 0 || parseInt(parts[i]) > 100)
				return false;
		}
		if (isNaN(parseFloat(parts[3])) || parseFloat(parts[3]) < 0 || parseFloat(parts[3]) > 1)
			return false;
		return true;
	}

	#rgbToHsl = () => {
		const hsl = this.rgbToHsl(this.r, this.g, this.b);
		this.#h = hsl.h;
		this.#s = hsl.s;
		this.#l = hsl.l;
	}

	#rgbToHsv = () => {
		const hsv = this.rgbToHsv(this.r, this.g, this.b);
		this.#h = hsv.h;
		this.#s = hsv.s;
		this.#v = hsv.v;
	}

	#hslToRgb = () => {
		const rgb = this.hslToRgb(this.h, this.s, this.l);
		this.#r = rgb.r;
		this.#g = rgb.g;
		this.#b = rgb.b;
	}

	#hsvToRgb = () => {
		const rgb = this.hsvToRgb(this.h, this.s, this.v);
		this.#r = rgb.r;
		this.#g = rgb.g;
		this.#b = rgb.b;
	}

	#hsvToHsl = () => {
		const hsl = this.hsvToHsl(this.h, this.s, this.v);
		this.#h = hsl.h;
		this.#s = hsl.s;
		this.#l = hsl.l;
	}

	#hslToHsv = () => {
		const hsv = this.hslToHsv(this.h, this.s, this.l);
		this.#h = hsv.h;
		this.#s = hsv.s;
		this.#v = hsv.v;
	}

	#r = 255;
	#g = 255;
	#b = 255;
	#h = 360;
	#s = 0;
	#l = 1;
	#v = 1;
	#a = 1;
}

class KCStudio_ColorPicker {
	constructor(element, options = {}) {
		if (!element instanceof HTMLElement)
			return false;
		if (!['object', 'undefined'].includes(typeof options))
			options = {};
		
		this.#target = element;
		this.#element = null;
		this.#options = {
			default: undefined,
			samples: {
				enabled: true,
				colors: ['#FFF', '#CCC', '#888', '#444', '#000', '#F42', '#F82', '#FD2', '#8D2', '#2A0', '#06F', '#0CF', '#0EE', '#F6E', '#A0C', '#70D'],
				max: 16,
			},
			inputs: {
				alpha: true,
				enabled: true,
				hex: true,
				hsl: false,
				hsv: false,
				rgb: true,
			},
		};

		this.#kcc = new KCColor();
		
		if (typeof options.default === 'string')
			this.#options.default = options.default;
		if (typeof options.samples?.enabled === 'boolean')
			this.#options.samples.enabled = options.samples.enabled;
		if (Array.isArray(options.samples?.colors)) {
			this.#options.samples.colors = [];
			options.samples.colors.forEach(sample => {
				if (this.kcc.getColorType(sample))
					this.#options.samples.colors.push(sample);
			});
		}
		if (typeof options.samples?.max === 'number')
			this.#options.samples.max = (options.samples.max > 0) ? options.samples.max : 16;
		if (typeof options.onChange === 'function')
			this.#options.onChange = options.onchange;
		else if (typeof options.onchange === 'function')
			this.#options.onChange = options.onchange;
		if (typeof options.inputs?.alpha === 'boolean')
			this.#options.inputs.alpha = options.inputs.alpha;
		if (typeof options.inputs?.enabled === 'boolean')
			this.#options.inputs.enabled = options.inputs.enabled;
		if (typeof options.inputs?.hex === 'boolean')
			this.#options.inputs.hex = options.inputs.hex;
		if (typeof options.inputs?.hsl === 'boolean')
			this.#options.inputs.hsl = options.inputs.hsl;
		if (typeof options.inputs?.hsv === 'boolean')
			this.#options.inputs.hsv = options.inputs.hsv;
		if (typeof options.inputs?.rgb === 'boolean')
			this.#options.inputs.rgb = options.inputs.rgb;
		
		// Todo: add more options validation

		this.init();
	}

	addSample(color) {
		if (typeof color !== 'string')
			return false;
		if (!this.kcc.getColorType(color))
			return false;
		color = new KCColor(color).hex;

		if (this.samples.includes(color)) {
			this.samples.splice(this.samples.indexOf(color), 1);
			this.#samplesWrapper.querySelector(`[data-color="${color}"]`).remove();
		}
		if (this.samples.length >= this.options.samples.max) {
			this.#samplesWrapper.querySelector(`[data-color="${this.samples[0]}"]`).remove();
			this.samples.shift();
		}
		this.samples.push(color);
		const sample = document.createElement('div');
		sample.classList.add('kc-color-picker-sample');
		sample.dataset.color = color;
		sample.innerHTML = `<div class="kc-color-picker-sample-color"</div>`;
		sample.children[0].style.backgroundColor = color;
		
		const addBtn = this.#samplesWrapper.querySelector('.kc-color-picker-sample-add');
		if (addBtn)
			addBtn.before(sample);
		else
			this.#samplesWrapper.append(sample);

		sample.addEventListener('click', () => {
			this.color = color;
		});
		return color;
	}


	create() {
		this.#element = document.createElement('div');
		this.element.classList.add('kc-color-picker');
		this.element.innerHTML = `
			<div class="kc-color-picker-wrapper">
				<div class="kc-color-picker-canvas-wrapper">
					<div class="kc-color-picker-map">
						<div class="kc-color-picker-map-pointer"></div>
					</div>
					<div class="kc-color-picker-hue">
						<div class="kc-color-picker-hue-pointer"></div>
					</div>
					<div class="kc-color-picker-alpha">
						<span></span>
						<div class="kc-color-picker-alpha-pointer"></div>
					</div>
				</div>
				<div class="kc-color-picker-inputs-wrapper">
					<div class="kc-color-picker-label-row">
						<div class="kc-color-picker-label-col">
							<span>RGB</span>
						</div>
					</div>
					<div class="kc-color-picker-input-row">
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="255" step="5" value="255" name="kc-color-picker-red"/>
								<span>R</span>
							</div>
						</div>
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="255" step="5" value="255" name="kc-color-picker-green"/>
								<span>G</span>
							</div>
						</div>
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="255" step="5" value="255" name="kc-color-picker-blue"/>
								<span>B</span>
							</div>
						</div>
					</div>
					<div class="kc-color-picker-label-row">
						<div class="kc-color-picker-label-col">
							<span>HSL</span>
						</div>
					</div>
					<div class="kc-color-picker-input-row">
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="360" step="5" value="0" name="kc-color-picker-hue-1"/>
								<span>H</span>
							</div>
						</div>
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="100" step="1" value="0" name="kc-color-picker-saturation-1"/>
								<span>S</span>
							</div>
						</div>
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="100" step="1" value="100" name="kc-color-picker-lightness"/>
								<span>L</span>
							</div>
						</div>
					</div>
					<div class="kc-color-picker-label-row">
						<div class="kc-color-picker-label-col">
							<span>HSV</span>
						</div>
					</div>
					<div class="kc-color-picker-input-row">
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="360" step="5" value="0" name="kc-color-picker-hue-2"/>
								<span>H</span>
							</div>
						</div>
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="100" step="1" value="0" name="kc-color-picker-saturation-2"/>
								<span>S</span>
							</div>
						</div>
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="100" step="1" value="100" name="kc-color-picker-value"/>
								<span>V</span>
							</div>
						</div>
					</div>
					<div class="kc-color-picker-label-row">
						<div class="kc-color-picker-label-col kc-color-picker-label-col-8">
							<span>HEX</span>
						</div>
						<div class="kc-color-picker-label-col kc-color-picker-label-col-4">
							<span>Alpha</span>
						</div>
					</div>
					<div class="kc-color-picker-input-row">
						<div class="kc-color-picker-input-col kc-color-picker-input-col-8">
							<div class="kc-color-picker-input">
								<input type="text" value="FFFFFF" name="kc-color-picker-hex"/>
								<span>#</span>
							</div>
						</div>
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="100" step="1" value="100" name="kc-color-picker-alpha"/>
								<span>A</span>
							</div>
						</div>
					</div>
				</div>
				<div class="kc-color-picker-samples-wrapper">
					<div class="kc-color-picker-sample-add">
				</div>
			</div>`;

		this.#inputs = {};
		this.#inputs.r   = this.element.querySelector('input[name="kc-color-picker-red"]');
		this.#inputs.g   = this.element.querySelector('input[name="kc-color-picker-green"]');
		this.#inputs.b   = this.element.querySelector('input[name="kc-color-picker-blue"]');
		this.#inputs.h1  = this.element.querySelector('input[name="kc-color-picker-hue-1"]');
		this.#inputs.s1  = this.element.querySelector('input[name="kc-color-picker-saturation-1"]');
		this.#inputs.l   = this.element.querySelector('input[name="kc-color-picker-lightness"]');
		this.#inputs.h2  = this.element.querySelector('input[name="kc-color-picker-hue-2"]');
		this.#inputs.s2  = this.element.querySelector('input[name="kc-color-picker-saturation-2"]');
		this.#inputs.v   = this.element.querySelector('input[name="kc-color-picker-value"]');
		this.#inputs.hex = this.element.querySelector('input[name="kc-color-picker-hex"]');
		this.#inputs.a   = this.element.querySelector('input[name="kc-color-picker-alpha"]');

		this.#canvas = {};
		this.#canvas.map = this.element.querySelector('.kc-color-picker-map');
		this.#canvas.hueBar = this.element.querySelector('.kc-color-picker-hue');
		this.#canvas.alphaBar = this.element.querySelector('.kc-color-picker-alpha');
		
		this.#pointers = {};
		this.#pointers.map = this.element.querySelector('.kc-color-picker-map-pointer');
		this.#pointers.hueBar = this.element.querySelector('.kc-color-picker-hue-pointer');
		this.#pointers.alphaBar = this.element.querySelector('.kc-color-picker-alpha-pointer');

		this.#samplesWrapper = this.element.querySelector('.kc-color-picker-samples-wrapper');
		this.#samplesWrapper.children[0].addEventListener('click', () => { this.addSample(this.kcc.hex); });
		
		this.refresh();

		const coords = { x: 0, y: 0 };
		const percentages = { x: 0, y: 0 };

		const getCoords = (e, canvas) => {
			switch (e.type) {
				case 'mousedown':
				case 'mousemove':
					coords.x = e.pageX;
					coords.y = e.pageY;
					break;
				case 'touchstart':
				case 'touchmove':
					coords.x = e.touches[0].pageX;
					coords.y = e.touches[0].pageY;
					break;
				default:
					return false;
			}
			const canvasRect = canvas.getBoundingClientRect();
			coords.x += canvasRect.left - canvas.offsetLeft;
			coords.y += canvasRect.top - canvas.offsetTop;
			return true;
		}

		const getPercentages = (canvas) => {
			const canvasRect = canvas.getBoundingClientRect();
			percentages.x = (coords.x - canvasRect.left) / canvasRect.width;
			percentages.y = (coords.y - canvasRect.top) / canvasRect.height;
			percentages.x = Math.max(0, Math.min(percentages.x, 1));
			percentages.y = Math.max(0, Math.min(percentages.y, 1));
		}

		const initDrag = (e, canvas, drag, drop) => {
			document.body.classList.add('kc-color-picker-dragging');
			
			const onDrag = (e) => {
				e.preventDefault();
				e.stopPropagation();
				getCoords(e, canvas);
				getPercentages(canvas);
				if (drag) drag();
			};

			onDrag(e);

			const onDrop = (e) => {
				e.preventDefault();
				e.stopPropagation();
				document.body.classList.remove('kc-color-picker-dragging');
				document.removeEventListener('mousemove', onDrag);
				document.removeEventListener('touchmove', onDrag);
				document.removeEventListener('mouseup', onDrop);
				document.removeEventListener('touchend', onDrop);
				if (drop) drop();
			};

			document.addEventListener('mousemove', onDrag);
			document.addEventListener('touchmove', onDrag);
			document.addEventListener('mouseup', onDrop);
			document.addEventListener('touchend', onDrop);
		};

		const onCanvasPointerDown = (e) => {
			initDrag(e, this.#canvas.map, () => {
				this.#pointers.map.style.left = `${percentages.x * 100}%`;
				this.#pointers.map.style.top = `${percentages.y * 100}%`;
				this.kcc.hsva = `hsva(${this.kcc.h}, ${percentages.x * 100}%, ${(1 - percentages.y) * 100}%, ${this.kcc.a})`;
				this.refresh(['alpha-bar', 'inputs']);
			});
		};

		const onHueBarPointerDown = (e) => {
			initDrag(e, this.#canvas.hueBar, () => {
				this.#pointers.hueBar.style.top = `${percentages.y * 100}%`;
				this.kcc.h = Math.round(percentages.y * 360);
				this.refresh(['map', 'alpha-bar', 'inputs']);
			});
		};

		const onAlphaBarPointerDown = (e) => {
			initDrag(e, this.#canvas.alphaBar, () => {
				this.#pointers.alphaBar.style.top = `${percentages.y * 100}%`;
				this.kcc.a = Math.round((1 - percentages.y) * 100) / 100;
				this.refresh(['inputs']);
			});
		};

		this.#canvas.map.addEventListener('mousedown', onCanvasPointerDown);
		this.#canvas.map.addEventListener('touchstart', onCanvasPointerDown);
		this.#canvas.hueBar.addEventListener('mousedown', onHueBarPointerDown);
		this.#canvas.hueBar.addEventListener('touchstart', onHueBarPointerDown);
		this.#canvas.alphaBar.addEventListener('mousedown', onAlphaBarPointerDown);
		this.#canvas.alphaBar.addEventListener('touchstart', onAlphaBarPointerDown);

		for (let k in this.inputs) {
			const input = this.inputs[k];
			input.addEventListener('focus', () => {
				input.select();
			});
			if (input.type === 'number') {
				const max = input.max || 1000;
				const min = input.min || 0;
				input.addEventListener('input', () => {
					const value = parseInt(input.value);
					if (isNaN(value)) {
						input.value = min;
					} else {
						input.value = Math.max(min, Math.min(max, value));
					}
				});
			}
		}
		this.inputs.r.addEventListener('input', () => {
			this.kcc.r = parseInt(this.inputs.r.value);
			this.refresh(['map', 'hue-bar', 'alpha-bar', 'inputs-hsl', 'inputs-hsv', 'input-hex']);
		});
		this.inputs.g.addEventListener('input', () => {
			this.kcc.g = parseInt(this.inputs.g.value);
			this.refresh(['map', 'hue-bar', 'alpha-bar', 'inputs-hsl', 'inputs-hsv', 'input-hex']);
		});
		this.inputs.b.addEventListener('input', () => {
			this.kcc.b = parseInt(this.inputs.b.value);
			this.refresh(['map', 'hue-bar', 'alpha-bar', 'inputs-hsl', 'inputs-hsv', 'input-hex']);
		});
		this.inputs.h1.addEventListener('input', () => {
			this.kcc.h = parseInt(this.inputs.h1.value);
			this.refresh(['map', 'hue-bar', 'alpha-bar', 'inputs-rgb', 'input-h2', 'input-hex']);
		});
		this.inputs.s1.addEventListener('input', () => {
			this.kcc.s = parseInt(this.inputs.s1.value);
			this.refresh(['map', 'hue-bar', 'alpha-bar', 'inputs-rgb', 'input-l', 'input-s2', 'input-hex']);
		});
		this.inputs.l.addEventListener('input', () => {
			this.kcc.l = parseInt(this.inputs.l.value);
			this.refresh(['map', 'hue-bar', 'alpha-bar', 'inputs-rgb', 'inputs-s', 'input-v', 'input-hex']);
		});
		this.inputs.h2.addEventListener('input', () => {
			this.kcc.h = parseInt(this.inputs.h2.value);
			this.refresh(['map', 'hue-bar', 'alpha-bar', 'inputs-rgb', 'input-h1', 'input-hex']);
		});
		this.inputs.s2.addEventListener('input', () => {
			this.kcc.s = parseInt(this.inputs.s2.value);
			this.refresh(['map', 'hue-bar', 'alpha-bar', 'inputs-rgb', 'input-s1', 'input-l', 'input-hex']);
		});
		this.inputs.v.addEventListener('input', () => {
			this.kcc.v = parseInt(this.inputs.v.value);
			this.refresh(['map', 'hue-bar', 'alpha-bar', 'inputs-rgb', 'input-l', 'input-hex']);
		});
		this.inputs.a.addEventListener('input', () => {
			this.kcc.a = parseInt(this.inputs.a.value) / 100;
			this.refresh(['alpha-bar', 'input-hex']);
		});

		this.inputs.hex.addEventListener('focus', () => {
			this.inputs.hex.oldValue = this.inputs.hex.value;
			delete this.inputs.hex.lastValue;
		});
		this.inputs.hex.addEventListener('input', () => {
			let value = this.inputs.hex.value.trim().toUpperCase();
			if (!value.match(/^[0-9A-F]{0,8}$/i)) {
				this.inputs.hex.value = this.inputs.hex.lastValue || this.inputs.hex.oldValue;
				return;
			}
			this.inputs.hex.value = value;
			this.inputs.hex.lastValue = value;
			if (this.kcc.getColorType(`#${value}`) === 'hex') {
				this.kcc.hex = `#${this.inputs.hex.value}`;
				this.inputs.hex.oldValue = value;
				delete this.inputs.hex.lastValue;
				this.refresh(['map', 'hue-bar', 'alpha-bar', 'inputs-rgb', 'inputs-hsl', 'inputs-hsv', 'input-a']);
			}
		});
		this.inputs.hex.addEventListener('focusout', () => {
			if (this.kcc.getColorType(`#${this.inputs.hex.value}`) !== 'hex')
				this.inputs.hex.value = this.inputs.hex.oldValue;
			delete this.inputs.hex.oldValue;
			delete this.inputs.hex.lastValue;
		});
	}

	init() {
		if (this.options.default) {
			if (this.kcc.getColorType(this.options.default))
				this.kcc.color = this.options.default;
		}
		this.create();

		if (!this.options.inputs.enabled)
			this.inputs.r.parentElement.parentElement.parentElement.parentElement.remove();
		else {
			if (!this.options.inputs.rgb) {
				this.inputs.r.parentElement.parentElement.parentElement.previousElementSibling.remove();
				this.inputs.r.parentElement.parentElement.parentElement.remove();
			}
			if (!this.options.inputs.hsl) {
				this.inputs.l.parentElement.parentElement.parentElement.previousElementSibling.remove();
				this.inputs.l.parentElement.parentElement.parentElement.remove();
			}
			if (!this.options.inputs.hsv) {
				this.inputs.v.parentElement.parentElement.parentElement.previousElementSibling.remove();
				this.inputs.v.parentElement.parentElement.parentElement.remove();
			}
			if (!this.options.inputs.hex && !this.options.inputs.a) {
				this.inputs.hex.parentElement.parentElement.parentElement.previousElementSibling.remove();
				this.inputs.hex.parentElement.parentElement.parentElement.remove();
			} else {
				if (!this.options.inputs.hex) {
					this.inputs.hex.parentElement.parentElement.parentElement.previousElementSibling.children[0].remove();
					this.inputs.hex.parentElement.parentElement.remove();
				}
				if (!this.options.inputs.alpha) {
					this.inputs.a.parentElement.parentElement.parentElement.previousElementSibling.children[1].remove();
					this.inputs.a.parentElement.parentElement.remove();
				}
			}
		}

		this.render();

		this.#options.samples.colors.forEach((sample) => {
			this.addSample(sample);
		});
	}

	refresh(element) {
		if (Array.isArray(element)) {
			for (let i = 0; i < element.length; i++) {
				this.refresh(element[i]);
			}
		} else if (typeof element === 'string') {
			switch (element) {
				case 'map':
					this.#canvas.map.style.background = `linear-gradient(180deg, transparent 0%, black 100%), linear-gradient(-90deg, transparent 0%, white 100%), hsl(${this.h}, 100%, 50%)`;
					this.#pointers.map.style.left = `${this.s}%`;
					this.#pointers.map.style.top = `${100 - this.v}%`;
					break;
				case 'hue-bar':
					this.#pointers.hueBar.style.top = `${this.kcc.h / 360 * 100}%`;
					break;
				case 'alpha-bar':
					this.#canvas.alphaBar.children[0].style.background = `linear-gradient(to bottom, hsl(${this.h},${this.s}%,${this.l}%), transparent 100%)`;
					this.#pointers.alphaBar.style.top = `${(1 - this.kcc.a) * 100}%`;
				break;
				case 'inputs':
					this.refresh(['inputs-rgb', 'inputs-hsl', 'inputs-hsv', 'input-hex', 'input-a']);
					break;
				case 'inputs-rgb':
					this.refresh(['input-r', 'input-g', 'input-b']);
					break;
				case 'inputs-hsl':
					this.refresh(['input-h1', 'input-s1', 'input-l']);
					break;
				case 'inputs-hsv':
					this.refresh(['input-h2', 'input-s2', 'input-v']);
					break;
				case 'inputs-h':
					this.refresh(['input-h1', 'input-h2']);
					break;
				case 'inputs-s':
					this.refresh(['input-s1', 'input-s2']);
					break;
				case 'input-h1':
					this.inputs.h1.value = parseInt(this.h);
					break;
				case 'input-s1':
					this.inputs.s1.value = parseInt(this.s);
					break;
				case 'input-l':
					this.inputs.l.value = parseInt(this.l);
					break;
				case 'input-h2':
					this.inputs.h2.value = parseInt(this.h);
					break;
				case 'input-s2':
					this.inputs.s2.value = parseInt(this.s);
					break;
				case 'input-v':
					this.inputs.v.value = parseInt(this.v);
					break;
				case 'input-r':
					this.inputs.r.value = parseInt(this.r);
					break;
				case 'input-g':
					this.inputs.g.value = parseInt(this.g);
					break;
				case 'input-b':
					this.inputs.b.value = parseInt(this.b);
					break;
				case 'input-hex':
					this.inputs.hex.value = this.hex.substr(1).toUpperCase();
					break;
				case 'input-a':
					this.inputs.a.value = parseInt(this.a * 100);
					break;
			}
		} else if (typeof element === 'undefined') {
			this.refresh(['map', 'hue-bar', 'alpha-bar', 'inputs']);
		}
	}

	render() {
		if (typeof this.target?.append !== 'function')
			return false;
		if (this.element === null)
			return false;
		this.target.append(this.element);
		return true;
	}
	set color(color) {
		this.kcc.color = color;
		this.refresh();
	}

	get element() { return this.#element; }
	get inputs() { return this.#inputs; }
	get kcc() { return this.#kcc; }
	get options() { return this.#options; }
	get samples() { return this.#samples; }
	get target() { return this.#target; }

	get r() { return this.kcc.r; }
	get g() { return this.kcc.g; }
	get b() { return this.kcc.b; }
	get h() { return this.kcc.h; }
	get s() { return this.kcc.s; }
	get l() { return this.kcc.l; }
	get v() { return this.kcc.v; }
	get a() { return this.kcc.a; }
	get hex() { return this.kcc.hex; }

	#canvas = {};
	#element = null;
	#inputs = {};
	#kcc = null;
	#options = {
		default: undefined,
	};
	#pointers = {};
	#samples = [];
	#samplesWrapper = null;
	#target = null;
}