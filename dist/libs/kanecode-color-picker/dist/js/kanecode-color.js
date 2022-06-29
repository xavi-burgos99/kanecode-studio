class KCColor {
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
		return `hsva(${this.h}, ${this.s}, ${this.v}, ${this.a})`;
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
		return `#${this.r.toString(16).padStart(2, '0')}${this.g.toString(16).padStart(2, '0')}${this.b.toString(16).padStart(2, '0')}`;
	}

	set color(color) {
		console.log(color);
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
		if (value < 0 || value > 255 || value % 1 !== 0)
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
		if (value < 0 || value > 255 || value % 1 !== 0)
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
		if (value < 0 || value > 255 || value % 1 !== 0)
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
		if (value < 0 || value > 360 || value % 1 !== 0)
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
		if (value < 0 || value > 100 || value % 1 !== 0)
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
		if (value < 0 || value > 100 || value % 1 !== 0)
			throw new Error('Invalid value value');
		this.#v = value;
		this.#hsvToRgb();
		this.#rgbToHsl();
	}
	get value() { return this.#v; }
	set v(value) { this.value = value; }
	get v() { return this.value; }

	set lightness(value) {
		if (typeof value !== 'number')
			throw new Error('Invalid lightness value');
		if (value < 0 || value > 100 || value % 1 !== 0)
			throw new Error('Invalid lightness value');
		this.#l = value;
		this.#hslToRgb();
		this.#rgbToHsv();
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
			if (rgb[key] < 0 || rgb[key] > 255 || rgb[key] % 1 !== 0)
				throw new Error('Invalid RGB value');
		}

		// Convert RGB to HSL
		r /= 255;
		g /= 255;
		b /= 255;
		const l = Math.max(r, g, b);
		const s = l - Math.min(r, g, b);
		const h = s
			? l === r
				? (g - b) / s
				: l === g
				? 2 + (b - r) / s
				: 4 + (r - g) / s
			: 0;
		
		hsl.h = parseInt(60 * h < 0 ? 60 * h + 360 : 60 * h);
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
		if (typeof h !== 'number')
				throw new Error('Invalid HSL value');
		if (h < 0 || h > 360 || h % 1 !== 0)
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

		rgb.r = Math.round(f(0) * 255);
		rgb.g = Math.round(f(8) * 255);
		rgb.b = Math.round(f(4) * 255);
		return rgb;
	}

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
			if (rgb[key] < 0 || rgb[key] > 255 || rgb[key] % 1 !== 0)
				throw new Error('Invalid RGB value');
		}

		// Convert RGB to HSV
		r /= 255;
		g /= 255;
		b /= 255;
		const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
		const h = n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;

		hsv.h = Math.round(60 * (h < 0 ? h + 6 : h));
		hsv.s = Math.round(v && (n / v) * 100);
		hsv.v = Math.round(v * 100);
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
		if (typeof h !== 'number')
				throw new Error('Invalid HSV value');
		if (h < 0 || h > 360 || h % 1 !== 0)
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

		rgb.r = Math.round(f(5) * 255);
		rgb.g = Math.round(f(3) * 255);
		rgb.b = Math.round(f(1) * 255);
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
		const hsl = { h: h, s: s, l: l };

		// Catch invalid HSL values
		if (typeof h !== 'number')
				throw new Error('Invalid HSL value');
		if (h < 0 || h > 360 || h % 1 !== 0)
			throw new Error('Invalid HSL value');
		for (const key in hsl) {
			if (key === 'h')
				continue;
			if (typeof hsl[key] !== 'number')
				throw new Error('Invalid HSL value');
			if (hsl[key] < 0 || hsl[key] > 100)
				throw new Error('Invalid HSL value');
		}

		// Convert HSL to HSV
		const rgb = this.hslToRgb(h, s, l);
		return this.rgbToHsv(rgb.r, rgb.g, rgb.b);
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
		const hsv = { h: h, s: s, v: v };

		// Catch invalid HSV values
		if (typeof h !== 'number')
				throw new Error('Invalid HSV value');
		if (h < 0 || h > 360 || h % 1 !== 0)
			throw new Error('Invalid HSV value');
		for (const key in hsv) {
			if (key === 'h')
				continue;
			if (typeof hsv[key] !== 'number')
				throw new Error('Invalid HSV value');
			if (hsv[key] < 0 || hsv[key] > 100)
				throw new Error('Invalid HSV value');
		}

		// Convert HSV to HSL
		const rgb = this.hsvToRgb(h, s, v);
		return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
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
			if (!parts[i].match(/^\d+$/))
				return false;
			if (parseInt(parts[i]) < 0 || parseInt(parts[i]) > 255)
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
			if (!parts[i].match(/^\d+$/))
				return false;
			if (parseInt(parts[i]) < 0 || parseInt(parts[i]) > 255)
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
		if (!parts[0].match(/^\d+$/))
			return false;
		if (parseInt(parts[0]) < 0 || parseInt(parts[0]) > 360)
			return false;
		for (let i = 1; i < parts.length; i++) {
			if (!parts[i].match(/^\d+%$/))
				return false;
			parts[i] = parts[i].substring(0, parts[i].length - 1);
			if (parseInt(parts[i]) < 0 || parseInt(parts[i]) > 100)
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
		if (!parts[0].match(/^\d+$/))
			return false;
		if (parseInt(parts[0]) < 0 || parseInt(parts[0]) > 360)
			return false;
		for (let i = 1; i < parts.length - 1; i++) {
			if (!parts[i].match(/^\d+%$/))
				return false;
			parts[i] = parts[i].substring(0, parts[i].length - 1);
			if (parseInt(parts[i]) < 0 || parseInt(parts[i]) > 100)
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
		if (!parts[0].match(/^\d+$/))
			return false;
		if (parseInt(parts[0]) < 0 || parseInt(parts[0]) > 360)
			return false;
		for (let i = 1; i < parts.length; i++) {
			if (!parts[i].match(/^\d+%$/))
				return false;
			parts[i] = parts[i].substring(0, parts[i].length - 1);
			if (parseInt(parts[i]) < 0 || parseInt(parts[i]) > 100)
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
		if (!parts[0].match(/^\d+$/))
			return false;
		if (parseInt(parts[0]) < 0 || parseInt(parts[0]) > 360)
			return false;
		for (let i = 1; i < parts.length - 1; i++) {
			if (!parts[i].match(/^\d+%$/))
				return false;
			parts[i] = parts[i].substring(0, parts[i].length - 1);
			if (parseInt(parts[i]) < 0 || parseInt(parts[i]) > 100)
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