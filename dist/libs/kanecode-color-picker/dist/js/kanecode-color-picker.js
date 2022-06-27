class KCColorPicker {
	constructor(element, options) {
		if (!element instanceof HTMLElement)
			return false;
		if (!['object', 'undefined'].includes(typeof options))
			options = {};
			// Todo: add validation for options
		
		this.#target = element;
		this.#element = null;
		this.#options = options;

		this.#red = 255;
		this.#green = 255;
		this.#blue = 255;
		this.#hue = 0;
		this.#saturation = 100;
		this.#lightness = 50;
		this.#alpha = 100;

		this.#hex = '#ffffff';
		this.#rgb = 'rgb(255,255,255)';
		this.#hsl = 'hsl(0,0%,100%)';
		this.#rgba = 'rgba(255,255,255,1)';
		this.#hsla = 'hsla(0,0%,100%,1)';

		this.init();
	}

	create() {
		this.#element = document.createElement('div');
		this.element.classList.add('kc-color-picker');
		this.element.innerHTML = `
			<div class="kc-color-picker-wrapper">
				<div class="kc-color-picker-canvas-wrapper">
					<div class="kc-color-picker-canvas">
						<div class="kc-color-picker-canvas-pointer"></div>
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
								<input type="number" min="0" max="360" step="5" value="0" name="kc-color-picker-hue"/>
								<span>H</span>
							</div>
						</div>
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="100" step="2" value="100" name="kc-color-picker-saturation"/>
								<span>S</span>
							</div>
						</div>
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="100" step="2" value="50" name="kc-color-picker-lightness"/>
								<span>L</span>
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
								<input type="number" min="0" max="100" step="2" value="100" name="kc-color-picker-alpha"/>
								<span>A</span>
							</div>
						</div>
					</div>
				</div>
			</div>`;

		const canvas = this.element.querySelector('.kc-color-picker-canvas');
		const canvasPointer = this.element.querySelector('.kc-color-picker-canvas-pointer');
		const hueBar = this.element.querySelector('.kc-color-picker-hue');
		const hueBarPointer = this.element.querySelector('.kc-color-picker-hue-pointer');
		const alphaBar = this.element.querySelector('.kc-color-picker-alpha');
		const alphaBarPointer = this.element.querySelector('.kc-color-picker-alpha-pointer');

		canvas.style.background = `linear-gradient(180deg, transparent 0%, black 100%),linear-gradient(-90deg, transparent 0%, white 100%), hsl(0, 100%, 50%)`;
		const gradientPrefixes = ['webkit', 'moz', 'ms', 'o'];
		gradientPrefixes.forEach(prefix => {
			alphaBar.children[0].style.background = `-${prefix}-linear-gradient(top, white, transparent)`;
		});
		
		const initCanvasPointer = (e) => {
			e.preventDefault();
			e.stopPropagation();
			document.body.classList.add('kc-color-picker-dragging');
			const coords = { x: null, y: null };
			const percentage = { x: null, y: null };

			const getCoords = (e) => {
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

			const getPercentage = () => {
				const canvasRect = canvas.getBoundingClientRect();
				percentage.x = (coords.x - canvasRect.left) / canvasRect.width;
				percentage.y = (coords.y - canvasRect.top) / canvasRect.height;
				percentage.x = Math.max(0, Math.min(percentage.x, 1));
				percentage.y = Math.max(0, Math.min(percentage.y, 1));
			}

			const setCanvasPointer = () => {
				if (isNaN(percentage.x) || isNaN(percentage.y))
					return false;
				if (percentage.x < 0 || percentage.x > 1 || percentage.y < 0 || percentage.y > 1)
					return false;
				canvasPointer.style.left = `${percentage.x * 100}%`;
				canvasPointer.style.top = `${percentage.y * 100}%`;
				return true;
			}

			getCoords(e);
			getPercentage();
			setCanvasPointer();

			const setColor = () => {
				const saturation = percentage.x;
				const value = 1 - percentage.y;
				const hsl = this.hsvToHsl(this.hue, saturation, value);
				this.#saturation = Math.round(hsl[1] * 100);
				this.#lightness = Math.round(hsl[2] * 100);
				this.#hslToRgb();
				this.refreshValues();
				this.refreshInputs();

				alphaBar.children[0].style.background = `linear-gradient(0, transparent 0%, ${this.rgb} 100%)`;
			}

			const drag = (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (!getCoords(e))
					return false;
				getPercentage(e);
				setCanvasPointer();
				setColor();
				return true;
			}

			const drop = (e) => {
				e.preventDefault();
				e.stopPropagation();
				document.body.classList.remove('kc-color-picker-dragging');
				
				setColor();

				document.removeEventListener('mousemove', drag);
				document.removeEventListener('touchmove', drag);
				document.removeEventListener('mouseup', drop);
				document.removeEventListener('touchend', drop);
				return true;
			}

			document.addEventListener('mousemove', drag);
			document.addEventListener('touchmove', drag);
			document.addEventListener('mouseup', drop);
			document.addEventListener('touchend', drop);
		}
		canvas.addEventListener('mousedown', initCanvasPointer);
		canvas.addEventListener('touchstart', initCanvasPointer);

		const initHueBar = (e) => {
			e.preventDefault();
			e.stopPropagation();
			document.body.classList.add('kc-color-picker-dragging');
			const coords = { y: null };
			const percentage = { y: null };

			const getCoords = (e) => {
				switch (e.type) {
					case 'mousedown':
					case 'mousemove':
						coords.y = e.pageY;
						break;
					case 'touchstart':
					case 'touchmove':
						coords.y = e.touches[0].pageY;
						break;
					default:
						return false;
				}
				const hueBarRect = hueBar.getBoundingClientRect();
				coords.y += hueBarRect.top - hueBar.offsetTop;
				return true;
			}

			const getPercentage = () => {
				const hueBarRect = hueBar.getBoundingClientRect();
				percentage.y = (coords.y - hueBarRect.top) / hueBarRect.height;
				percentage.y = Math.max(0, Math.min(percentage.y, 1));
			}

			const setHueBarPointer = () => {
				if (isNaN(percentage.y))
					return false;
				if (percentage.y < 0 || percentage.y > 1)
					return false;
				hueBarPointer.style.top = `${percentage.y * 100}%`;
				return true;
			}

			getCoords(e);
			getPercentage();
			setHueBarPointer();

			const setColor = () => {
				this.#hue = Math.round(percentage.y * 360);
				this.#hslToRgb();
				this.refreshValues();
				this.refreshInputs();
				
				canvas.style.background = `linear-gradient(180deg, transparent 0%, black 100%),linear-gradient(-90deg, transparent 0%, white 100%), hsl(${this.hue}, 100%, 50%)`;
				alphaBar.children[0].style.background = `linear-gradient(to bottom, hsl(${this.hue},${this.saturation}%,${this.lightness}%), transparent 100%)`;
			}

			const drag = (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (!getCoords(e))
					return false;
				getPercentage(e);
				setHueBarPointer();
				setColor();
				return true;
			}

			const drop = (e) => {
				e.preventDefault();
				e.stopPropagation();
				document.body.classList.remove('kc-color-picker-dragging');

				setColor();

				document.removeEventListener('mousemove', drag);
				document.removeEventListener('touchmove', drag);
				document.removeEventListener('mouseup', drop);
				document.removeEventListener('touchend', drop);
				return true;
			}

			document.addEventListener('mousemove', drag);
			document.addEventListener('touchmove', drag);
			document.addEventListener('mouseup', drop);
			document.addEventListener('touchend', drop);
		}
		hueBar.addEventListener('mousedown', initHueBar);
		hueBar.addEventListener('touchstart', initHueBar);

		const hueBarWheel = (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.hue += e.deltaY * 0.1;
		}

		hueBar.addEventListener('wheel', hueBarWheel);
		hueBar.addEventListener('mousewheel', hueBarWheel);
		hueBar.addEventListener('DOMMouseScroll', hueBarWheel);

		const initAlphaBar = (e) => {
			e.preventDefault();
			e.stopPropagation();
			document.body.classList.add('kc-color-picker-dragging');
			const coords = { y: null };
			const percentage = { y: null };

			const getCoords = (e) => {
				switch (e.type) {
					case 'mousedown':
					case 'mousemove':
						coords.y = e.pageY;
						break;
					case 'touchstart':
					case 'touchmove':
						coords.y = e.touches[0].pageY;
						break;
					default:
						return false;
				}
				const alphaBarRect = alphaBar.getBoundingClientRect();
				coords.y += alphaBarRect.top - alphaBar.offsetTop;
				return true;
			}

			const getPercentage = () => {
				const alphaBarRect = alphaBar.getBoundingClientRect();
				percentage.y = (coords.y - alphaBarRect.top) / alphaBarRect.height;
				percentage.y = Math.max(0, Math.min(percentage.y, 1));
			}

			const setAlphaBarPointer = () => {
				if (isNaN(percentage.y))
					return false;
				if (percentage.y < 0 || percentage.y > 1)
					return false;
				alphaBarPointer.style.top = `${percentage.y * 100}%`;
				return true;
			}

			getCoords(e);
			getPercentage();
			setAlphaBarPointer();

			const setColor = () => {
				this.#alpha = Math.round((1 - percentage.y) * 100);
				this.refreshValues();
				this.refreshInputs();
			}

			const drag = (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (!getCoords(e))
					return false;
				getPercentage(e);
				setAlphaBarPointer();
				return true;
			}

			const drop = (e) => {
				e.preventDefault();
				e.stopPropagation();
				document.body.classList.remove('kc-color-picker-dragging');

				setColor();

				document.removeEventListener('mousemove', drag);
				document.removeEventListener('touchmove', drag);
				document.removeEventListener('mouseup', drop);
				document.removeEventListener('touchend', drop);
				return true;
			}

			document.addEventListener('mousemove', drag);
			document.addEventListener('touchmove', drag);
			document.addEventListener('mouseup', drop);
			document.addEventListener('touchend', drop);
		}
		alphaBar.addEventListener('mousedown', initAlphaBar);
		alphaBar.addEventListener('touchstart', initAlphaBar);

		const alphaBarWheel = (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.alpha = Math.max(0, Math.min(this.alpha - e.deltaY * 0.0003, 1));
		}

		alphaBar.addEventListener('wheel', alphaBarWheel);
		alphaBar.addEventListener('mousewheel', alphaBarWheel);
		alphaBar.addEventListener('DOMMouseScroll', alphaBarWheel);

		const inputR = this.element.querySelector('input[name="kc-color-picker-red"]');
		const inputG = this.element.querySelector('input[name="kc-color-picker-green"]');
		const inputB = this.element.querySelector('input[name="kc-color-picker-blue"]');
		const inputH = this.element.querySelector('input[name="kc-color-picker-hue"]');
		const inputS = this.element.querySelector('input[name="kc-color-picker-saturation"]');
		const inputL = this.element.querySelector('input[name="kc-color-picker-lightness"]');
		const inputA = this.element.querySelector('input[name="kc-color-picker-alpha"]');
		const inputHex = this.element.querySelector('input[name="kc-color-picker-hex"]');

		this.element.querySelectorAll('input').forEach((input) => {
			const type = input.type;
			input.addEventListener('focus', (e) => {
				input.oldValue = input.value;
			});
			switch (type) {
				case 'text':
					switch (input.name) {
						case 'kc-color-picker-hex':
							input.addEventListener('input', (e) => {
								e.preventDefault();
								e.stopPropagation();
								let value = input.value;
								value = value.toUpperCase();
								input.value = value;
								if (value.length > 8 || (!value.match(/^[0-9A-F]{0,8}$/) && value !== '')) {
									input.value = input.oldValue;
									return;
								}
								input.oldValue = value;
								if (this.#identifyColorType(`#${value}`) !== 'hex')
									return;
								
								this.#hex = value;
								switch (value.length) {
									case 3:
										this.#red = this.#hexToDec(value.substr(0, 1) + value.substr(0, 1));
										this.#green = this.#hexToDec(value.substr(1, 1) + value.substr(1, 1));
										this.#blue = this.#hexToDec(value.substr(2, 1) + value.substr(2, 1));
										this.#alpha = 100;
										break;
									case 4:
										this.#red = this.#hexToDec(value.substr(0, 1) + value.substr(0, 1));
										this.#green = this.#hexToDec(value.substr(1, 1) + value.substr(1, 1));
										this.#blue = this.#hexToDec(value.substr(2, 1) + value.substr(2, 1));
										this.#alpha = parseInt(this.#hexToDec(value.substr(3, 1) + value.substr(3, 1)) / 2.55);
										break;
									case 6:
										this.#red = this.#hexToDec(value.substr(0, 2));
										this.#green = this.#hexToDec(value.substr(2, 2));
										this.#blue = this.#hexToDec(value.substr(4, 2));
										this.#alpha = 100;
										break;
									case 8:
										this.#red = this.#hexToDec(value.substr(0, 2));
										this.#green = this.#hexToDec(value.substr(2, 2));
										this.#blue = this.#hexToDec(value.substr(4, 2));
										this.#alpha = parseInt(this.#hexToDec(value.substr(6, 2)) / 2.55);
										break;
								}
								this.#rgbToHsl();
								this.refreshValues();
								this.refreshCanvas();
								inputR.value = this.red;
								inputG.value = this.green;
								inputB.value = this.blue;
								inputH.value = this.hue;
								inputS.value = this.saturation;
								inputL.value = this.lightness;
								inputA.value = this.alpha;
							});
							break;
					}
					break;

				case 'number':
					const min = input.min || 0;
					const max = input.max || 1;
					input.addEventListener('input', (e) => {
						let value = parseInt(input.value);
						if (isNaN(value))
							value = min;
						if (value < min)
							value = min;
						if (value > max)
							value = max;
						if (input.value !== value.toString())
							input.value = value;
					});
					switch (input.name) {
						case 'kc-color-picker-red':
							input.addEventListener('input', (e) => {
								e.preventDefault();
								e.stopPropagation();
								this.#red = parseInt(input.value);;
								this.#rgbToHsl();
								this.refreshValues();
								this.refreshCanvas();
								inputH.value = this.hue;
								inputS.value = this.saturation;
								inputL.value = this.lightness;
								inputA.value = this.alpha;
								inputHex.value = `${this.#decToHex(this.red)}${this.#decToHex(this.green)}${this.#decToHex(this.blue)}`;
							});
							break;
						case 'kc-color-picker-green':
							input.addEventListener('input', (e) => {
								e.preventDefault();
								e.stopPropagation();
								this.#green = parseInt(input.value);;
								this.#rgbToHsl();
								this.refreshValues();
								this.refreshCanvas();
								inputH.value = this.hue;
								inputS.value = this.saturation;
								inputL.value = this.lightness;
								inputA.value = this.alpha;
								inputHex.value = `${this.#decToHex(this.red)}${this.#decToHex(this.green)}${this.#decToHex(this.blue)}`;
							});
							break;
						case 'kc-color-picker-blue':
							input.addEventListener('input', (e) => {
								e.preventDefault();
								e.stopPropagation();
								this.#blue = parseInt(input.value);;
								this.#rgbToHsl();
								this.refreshValues();
								this.refreshCanvas();
								inputH.value = this.hue;
								inputS.value = this.saturation;
								inputL.value = this.lightness;
								inputA.value = this.alpha;
								inputHex.value = `${this.#decToHex(this.red)}${this.#decToHex(this.green)}${this.#decToHex(this.blue)}`;
							});
							break;
						case 'kc-color-picker-hue':
							input.addEventListener('input', (e) => {
								e.preventDefault();
								e.stopPropagation();
								this.#hue = parseInt(input.value);;
								this.#hslToRgb();
								this.refreshValues();
								this.refreshCanvas();
								inputR.value = this.red;
								inputG.value = this.green;
								inputB.value = this.blue;
								inputA.value = this.alpha;
								inputHex.value = `${this.#decToHex(this.red)}${this.#decToHex(this.green)}${this.#decToHex(this.blue)}`;
							});
							break;
						case 'kc-color-picker-saturation':
							input.addEventListener('input', (e) => {
								e.preventDefault();
								e.stopPropagation();
								this.#saturation = parseInt(input.value);;
								this.#hslToRgb();
								this.refreshValues();
								this.refreshCanvas();
								inputR.value = this.red;
								inputG.value = this.green;
								inputB.value = this.blue;
								inputH.value = this.hue;
								inputA.value = this.alpha;
								inputHex.value = `${this.#decToHex(this.red)}${this.#decToHex(this.green)}${this.#decToHex(this.blue)}`;
							});
							break;
						case 'kc-color-picker-lightness':
							input.addEventListener('input', (e) => {
								e.preventDefault();
								e.stopPropagation();
								this.#lightness = parseInt(input.value);
								this.#hslToRgb();
								this.refreshValues();
								this.refreshCanvas();
								inputR.value = this.red;
								inputG.value = this.green;
								inputB.value = this.blue;
								inputH.value = this.hue;
								inputS.value = this.saturation;
								inputA.value = this.alpha;
								inputHex.value = `${this.#decToHex(this.red)}${this.#decToHex(this.green)}${this.#decToHex(this.blue)}`;
							});
							break;
						case 'kc-color-picker-alpha':
							input.addEventListener('input', (e) => {
								e.preventDefault();
								e.stopPropagation();
								this.#alpha = parseInt(input.value);
								this.refreshValues();
								this.refreshCanvas();
								inputHex.value = `${this.#decToHex(this.red)}${this.#decToHex(this.green)}${this.#decToHex(this.blue)}`;
							});
							break;
					}			
					break;
			}

			input.addEventListener('focus', (e) => {
				input.select();
			});
		});
	}

	hsvToHsl(hue, saturation, value) {
		const lightness = (2 - saturation) * value / 2;
		return [hue, saturation, lightness];
	}

	rgbToHsv(red, green, blue) {
		const max = Math.max(red, green, blue);
		const min = Math.min(red, green, blue);
		const value = max;
		let saturation = 0;
		let hue = 0;
		if (max !== min) {
			const d = max - min;
			saturation = (max === 0 ? 0 : d / max);
			switch (max) {
				case red:
					hue = (green - blue) / d + (green < blue ? 6 : 0);
					break;
				case green:
					hue = (blue - red) / d + 2;
					break;
				case blue:
					hue = (red - green) / d + 4;
					break;
			}
			hue /= 6;
		}
		return [hue, saturation, value];
	}

	hslToRgb(hue, saturation, lightness) {
		let r, g, b;
		if (saturation === 0) {
			r = g = b = lightness;
		} else {
			const hueToRgb = (p, q, t) => {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			}
			const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
			const p = 2 * lightness - q;
			r = hueToRgb(p, q, hue + 1 / 3);
			g = hueToRgb(p, q, hue);
			b = hueToRgb(p, q, hue - 1 / 3);
		}
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	rgbToHsl(r, g, b) {
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
		return [
			60 * h < 0 ? 60 * h + 360 : 60 * h,
			100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
			(100 * (2 * l - s)) / 2,
		];
	};

	#hslToRgb() {
		const rgb = this.hslToRgb(this.hue / 360, this.saturation / 100, this.lightness / 100);
		this.#red = rgb[0];
		this.#green = rgb[1];
		this.#blue = rgb[2];
	}

	#rgbToHsl() {
		const hsl = this.rgbToHsl(this.red, this.green, this.blue);
		this.#hue = Math.round(hsl[0]);
		this.#saturation = Math.round(hsl[1]);
		this.#lightness = Math.round(hsl[2]);
	}

	init() {
		this.create();
		this.render();
	}

	refresh() {
		this.refreshCanvas();
		this.refreshInputs();
	}

	refreshCanvas() {
		const canvas = this.element.querySelector('.kc-color-picker-canvas');
		const canvasPointer = this.element.querySelector('.kc-color-picker-canvas-pointer');
		const hueBarPointer = this.element.querySelector('.kc-color-picker-hue-pointer');
		const alphaBar = this.element.querySelector('.kc-color-picker-alpha');
		const alphaBarPointer = this.element.querySelector('.kc-color-picker-alpha-pointer');

		canvas.style.background = `linear-gradient(180deg, transparent 0%, black 100%), linear-gradient(-90deg, transparent 0%, white 100%), hsl(${this.hue}, 100%, 50%)`;
		
		// Canvas is represented by a square using hsv color space
		// We need to position the pointer on the canvas based on the current color values (hue, saturation, lightness)
		// We have only the values of saturation and lightness, in percentage

		// x = sa
		
		// Now, x is represented by cursor position left, y is represented by cursor position top, using the commented results before.
		canvasPointer.style.left = `${this.saturation}%`;
		

		hueBarPointer.style.top = `${this.hue / 3.60}%`;
		alphaBar.children[0].style.background = `linear-gradient(to bottom, hsl(${this.hue},${this.saturation}%,${this.lightness}%), transparent 100%)`;
		alphaBarPointer.style.top = `${(100 - this.alpha)}%`;
	}

	refreshInputs() {
		const inputR = this.element.querySelector('[name="kc-color-picker-red"]');
		const inputG = this.element.querySelector('[name="kc-color-picker-green"]');
		const inputB = this.element.querySelector('[name="kc-color-picker-blue"]');
		const inputH = this.element.querySelector('[name="kc-color-picker-hue"]');
		const inputS = this.element.querySelector('[name="kc-color-picker-saturation"]');
		const inputL = this.element.querySelector('[name="kc-color-picker-lightness"]');
		const inputA = this.element.querySelector('[name="kc-color-picker-alpha"]');
		const inputHex = this.element.querySelector('[name="kc-color-picker-hex"]');

		inputR.value = this.red;
		inputG.value = this.green;
		inputB.value = this.blue;
		inputH.value = this.hue;
		inputS.value = this.saturation;
		inputL.value = this.lightness;
		inputA.value = this.alpha;
		inputHex.value = `${this.#decToHex(this.red)}${this.#decToHex(this.green)}${this.#decToHex(this.blue)}`;
	}

	refreshValues() {
		this.#hex = `#${this.#decToHex(this.#red)}${this.#decToHex(this.#green)}${this.#decToHex(this.#blue)}${this.#decToHex(Math.round(this.#alpha * 255))}`;
		this.#rgb = `rgb(${this.#red}, ${this.#green}, ${this.#blue})`;
		this.#rgba = `rgba(${this.#red}, ${this.#green}, ${this.#blue}, ${this.#alpha})`;
		this.#hsl = `hsl(${this.#hue}, ${this.#saturation}%, ${this.#lightness}%)`;
		this.#hsla = `hsla(${this.#hue}, ${this.#saturation}%, ${this.#lightness}%, ${this.#alpha})`;
	}

	render() {
		if (typeof this.target?.append !== 'function')
			return false;
		if (this.element === null)
			return false;
		this.target.append(this.element);
		return true;
	}

	#decToHex(dec) {
		if (dec < 0)
			return '00';
		if (dec > 255)
			return 'ff';
		return dec.toString(16).padStart(2, '0').toUpperCase();
	}

	#hexToDec(hex) {
		return parseInt(hex, 16);
	}

	#identifyColorType(color) {
		if (typeof color !== 'string')
			return false;
		if (color.startsWith('#')) {
			color = color.substring(1);
			if ([3, 4, 6, 8].includes(color.length) && color.match(/^[0-9a-fA-F]+$/i))
				return 'hex';
		}
		if (color.startsWith('rgb(') && color.endsWith(')')) {
			color = color.substring(4).substring(0, color.length - 5);
			const colorArray = color.split(',');
			if (color.match(/^[0-9,]+$/) && colorArray.length === 3) {
				for (let i = 0; i < colorArray.length; i++) {
					if (isNaN(colorArray[i]) || colorArray[i] < 0 || colorArray[i] > 255)
						return false;
				}
				return 'rgb';
			}
		}
		if (color.startsWith('rgba(') && color.endsWith(')')) {
			color = color.substring(5).substring(0, color.length - 6);
			const colorArray = color.split(',');
			if (color.match(/^[0-9,.]+$/) && colorArray.length === 4) {
				for (let i = 0; i < colorArray.length - 1; i++) {
					if (isNaN(colorArray[i]) || colorArray[i] < 0 || colorArray[i] > 255)
						return false;
				}
				if (isNaN(colorArray[3]) || colorArray[3] < 0 || colorArray[3] > 1)
					return false;
				return 'rgba';
			}
		}
		if (color.startsWith('hsl(') && color.endsWith(')')) {
			color = color.substring(4).substring(0, color.length - 5).replaceAll(' ', '');
			const colorArray = color.split(',');
			if (color.match(/^[0-9,%]+$/) && colorArray.length === 3) {
				if (isNaN(colorArray[0]) || colorArray[0] < 0 || colorArray[0] > 360 || colorArray[0].includes('%'))
					return false;
				for (let i = 1; i < colorArray.length; i++) {
					const number = colorArray[i].replace('%', '');
					if (isNaN(number) || number < 0 || number > 100 || !colorArray[i].includes('%'))
						return false;
				}
				return 'hsl';
			}
		}
		if (color.startsWith('hsla(') && color.endsWith(')')) {
			color = color.substring(5).substring(0, color.length - 6).replaceAll(' ', '');
			const colorArray = color.split(',');
			if (color.match(/^[0-9,.%]+$/) && colorArray.length === 4) {
				if (isNaN(colorArray[0]) || colorArray[0] < 0 || colorArray[0] > 360 || colorArray[0].includes('%') || colorArray[0].includes('.'))
					return false;
				for (let i = 1; i < 3; i++) {
					const number = colorArray[i].replace('%', '');
					if (isNaN(number) || number < 0 || number > 100 || !colorArray[i].includes('%') || colorArray[i].includes('.'))
						return false;
				}
				if (isNaN(colorArray[3]) || colorArray[3] < 0 || colorArray[3] > 1 || colorArray[3].includes('%'))
					return false;
				return 'hsla';
			}
		}

		return false;
	}

	get hue() { return this.#hue; }
	get saturation() { return this.#saturation; }
	get lightness() { return this.#lightness; }
	get red() { return this.#red; }
	get green() { return this.#green; }
	get blue() { return this.#blue; }
	get alpha() { return this.#alpha; }

	get hex() { return this.#hex; }
	get rgb() { return this.#rgb; }
	get hsl() { return this.#hsl; }
	get rgba() { return this.#rgba; }
	get hsla() { return this.#hsla; }

	get options() { return this.#options; }
	get target () { return this.#target; }
	get element() { return this.#element; }

	get color() {
		const defaultType = this.options.defaultType;
		if (['hex', 'rgb', 'hsl', 'rgba', 'hsla'].indexOf(defaultType) === -1) {
			const redHex = this.#decToHex(this.#red);
			const greenHex = this.#decToHex(this.#green);
			const blueHex = this.#decToHex(this.#blue);
			if (this.alpha === 0)
				return 'rgba(0, 0, 0, 0)';
			if (redHex[0] === redHex[1] && greenHex[0] === greenHex[1] && blueHex[0] === blueHex[1]) {
				return this.hex;
			}
			return this.rgba;
		}
		switch (defaultType) {
			case 'hex': return this.hex;
			case 'rgb': return this.rgb;
			case 'hsl': return this.hsl;
			case 'rgba': return this.rgba;
			case 'hsla': return this.hsla;
		}
		return this.rgba;
	}


	set hsl(value) {
		if (this.#identifyColorType(value) !== 'hsl')
			return false;
		value = value.replace('hsl(', '').replace(')', '').replaceAll(' ', '').replaceAll('%', '').split(',');
		this.#hue = value[0];
		this.#saturation = value[1];
		this.#lightness = value[2];
		this.#hslToRgb();
		this.refreshValues();
		this.refresh();
		return true;
	}
	set rgb(value) {
		if (this.#identifyColorType(value) !== 'rgb')
			return false;
		value = value.replace('rgb(', '').replace(')', '').replaceAll(' ', '').split(',');
		this.#red = value[0];
		this.#green = value[1];
		this.#blue = value[2];
		this.#rgbToHsl();
		this.refreshValues();
		this.refresh();
		return true;
	}
	set hex(value) {
		if (this.#identifyColorType(value) !== 'hex')
			return false;
		value = value.replace('#', '');
		switch (value.length) {
			case 3:
				this.#red = this.#hexToDec(value.substring(0, 1) + value.substring(0, 1));
				this.#green = this.#hexToDec(value.substring(1, 2) + value.substring(1, 2));
				this.#blue = this.#hexToDec(value.substring(2, 3) + value.substring(2, 3));
				this.#alpha = 1;
				break;
			case 6:
				this.#red = this.#hexToDec(value.substring(0, 2));
				this.#green = this.#hexToDec(value.substring(2, 4));
				this.#blue = this.#hexToDec(value.substring(4, 6));
				this.#alpha = 1;
				break;
			case 8:
				this.#red = this.#hexToDec(value.substring(0, 2));
				this.#green = this.#hexToDec(value.substring(2, 4));
				this.#blue = this.#hexToDec(value.substring(4, 6));
				this.#alpha = this.#hexToDec(value.substring(6, 8)) / 256;
				break;
			default:
				return false;
		}
		this.#rgbToHsl();
		this.refreshValues();
		this.refresh();
		return true;
	}
	set rgba(value) {
		if (this.#identifyColorType(value) !== 'rgba')
			return false;
		value = value.replace('rgba(', '').replace(')', '').replaceAll(' ', '').split(',');
		this.#red = value[0];
		this.#green = value[1];
		this.#blue = value[2];
		this.#alpha = value[3];
		this.#rgbToHsl();
		this.refreshValues();
		this.refresh();
		return true;
	}
	set hsla(value) {
		if (this.#identifyColorType(value) !== 'hsla')
			return false;
		value = value.replace('hsla(', '').replace(')', '').replaceAll(' ', '').split(',');
		this.#hue = parseInt(value[0]);
		this.#saturation = parseInt(value[1]);
		this.#lightness = parseInt(value[2]);
		this.#alpha = parseFloat(value[3]);
		this.#hslToRgb();
		this.refreshValues();
		this.refresh();
		return true;
	}

	set hue(value) {
		if (typeof value !== 'number' || value < 0 || value > 360)
			return false;
		this.#hue = value;
		this.#hslToRgb();
		this.refreshValues();
		this.refresh();
		return true;
	}
	set saturation(value) {
		if (typeof value !== 'number' || value < 0 || value > 1)
			return false;
		this.#saturation = Math.round(value * 100);
		this.#hslToRgb();
		this.refreshValues();
		this.refresh();
		return true;
	}
	set lightness(value) {
		if (typeof value !== 'number' || value < 0 || value > 1)
			return false;
		this.#lightness = Math.round(value * 100);
		this.#hslToRgb();
		this.refreshValues();
		this.refresh();
		return true;
	}
	set red(value) {
		if (typeof value !== 'number' || value < 0 || value > 255)
			return false;
		this.#red = Math.round(value);
		this.#rgbToHsl();
		this.refreshValues();
		this.refresh();
		return true;
	}
	set green(value) {
		if (typeof value !== 'number' || value < 0 || value > 255)
			return false;
		this.#green = Math.round(value);
		this.#rgbToHsl();
		this.refreshValues();
		this.refresh();
		return true;
	}
	set blue(value) {
		if (typeof value !== 'number' || value < 0 || value > 255)
			return false;
		this.#blue = Math.round(value);
		this.#rgbToHsl();
		this.refreshValues();
		this.refresh();
		return true;
	}
	set alpha(value) {
		if (typeof value !== 'number' || value < 0 || value > 1)
			return false;
		this.#alpha = value;
		this.refreshValues();
		this.refresh();
		return true;
	}

	set color(value) {
		const colorType = this.options.colorType;
		if (!colorType)
			return false;
		switch (this.#identifyColorType(value)) {
			case 'hex':
				this.hex = value;
				break;
			case 'rgb':
				this.rgb = value;
				break;
			case 'hsl':
				this.hsl = value;
				break;
			case 'rgba':
				this.rgba = value;
				break;
			case 'hsla':
				this.hsla = value;
			default:
				return false;
		}
		this.refresh();
		return true;
	}


	#red = 255;
	#green = 255;
	#blue = 255;
	#hue = 0;
	#saturation = 100;
	#lightness = 50;
	#alpha = 100;

	#hex = '#FFFFFF';
	#rgb = 'rgb(255,255,255)';
	#hsl = 'hsl(0,100%,50%)';
	#rgba = 'rgba(255,255,255,1)';
	#hsla = 'hsla(0,100%,50%,1)';

	#target = null;
	#element = null;
	#options = {
		defaultType: undefined,
		wait: false,
		color: undefined,
		onChange: undefined,
	};
}