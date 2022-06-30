class KCColorPicker {
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
				colors: [],
				max: 16,
			},
		};

		this.#kcc = new KCColor();
		
		if (typeof options.default === 'string')
			this.#options.default = options.default;
		if (typeof options.samples?.enabled === 'boolean')
			this.#options.samples.enabled = options.samples.enabled;
		if (Array.isArray(options.samples?.colors))
			options.samples.colors.forEach(sample => {
				if (this.kcc.getColorType(sample))
					this.#options.samples.colors.push(sample);
			});
		if (typeof options.samples?.max === 'number')
			this.#options.samples.max = (options.samples.max > 0) ? options.samples.max : 16;
		if (typeof options.onChange === 'function')
			this.#options.onChange = options.onchange;
		else if (typeof options.onchange === 'function')
			this.#options.onChange = options.onchange;
		
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
		if (this.samples.length >= this.options.samples.max)
			return false;
		this.samples.push(color);
		const sample = document.createElement('div');
		sample.classList.add('kc-color-picker-sample');
		sample.dataset.color = color;
		sample.style.backgroundColor = color;
		this.#samplesWrapper.append(sample);

		sample.addEventListener('click', () => {
			this.kcc.color = color;
			this.refresh();
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
				<div class="kc-color-picker-samples-wrapper"></div>
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