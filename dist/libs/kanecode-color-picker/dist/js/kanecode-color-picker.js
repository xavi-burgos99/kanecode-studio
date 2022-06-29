class KCColorPicker {
	constructor(element, options) {
		if (!element instanceof HTMLElement)
			return false;
		if (!['object', 'undefined'].includes(typeof options))
			options = {};
		
			this.#target = element;
			this.#element = null;
			this.#options = options;
	
			this.#kcc = new KCColor();
		
		if (typeof options.default === 'string')
			this.#options.default = options.default;
		
		// Todo: add more options validation

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
								<input type="number" min="0" max="360" step="5" value="0" name="kc-color-picker-hue-1"/>
								<span>H</span>
							</div>
						</div>
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="100" step="2" value="0" name="kc-color-picker-saturation-1"/>
								<span>S</span>
							</div>
						</div>
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="100" step="2" value="100" name="kc-color-picker-lightness"/>
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
								<input type="number" min="0" max="100" step="2" value="0" name="kc-color-picker-saturation-2"/>
								<span>S</span>
							</div>
						</div>
						<div class="kc-color-picker-input-col kc-color-picker-input-col-4">
							<div class="kc-color-picker-input">
								<input type="number" min="0" max="100" step="2" value="100" name="kc-color-picker-value"/>
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
								<input type="number" min="0" max="100" step="2" value="100" name="kc-color-picker-alpha"/>
								<span>A</span>
							</div>
						</div>
					</div>
				</div>
			</div>`;

		this.refresh();

		const canvas = this.element.querySelector('.kc-color-picker-canvas');
		const canvasPointer = this.element.querySelector('.kc-color-picker-canvas-pointer');
		const hueBar = this.element.querySelector('.kc-color-picker-hue');
		const hueBarPointer = this.element.querySelector('.kc-color-picker-hue-pointer');
		const alphaBar = this.element.querySelector('.kc-color-picker-alpha');
		const alphaBarPointer = this.element.querySelector('.kc-color-picker-alpha-pointer');

		const coords = { x: 0, y: 0 };
		const percentages = { x: 0, y: 0 };

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

		const getPercentages = () => {
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
				getCoords(e);
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
			initDrag(e, canvas, () => {
				canvasPointer.style.left = `${percentages.x * 100}%`;
				canvasPointer.style.top = `${percentages.y * 100}%`;
				this.kcc.color = `hsva(${this.h}, ${parseInt(percentages.x * 100)}%, ${parseInt((1 - percentages.y) * 100)}%, ${this.a})`;
				this.refresh(['alpha-bar', 'inputs']);
			});
		};

		const onHueBarPointerDown = (e) => {
			initDrag(e, hueBar, () => {
				hueBarPointer.style.top = `${percentages.y * 100}%`;
				this.kcc.h = Math.round(percentages.y * 360);
				this.refresh(['canvas', 'alpha-bar', 'inputs']);
			});
		};

		const onAlphaBarPointerDown = (e) => {
			initDrag(e, alphaBar, () => {
				alphaBarPointer.style.top = `${percentages.y * 100}%`;
				this.kcc.a = Math.round(percentages.y * 100);
				this.refresh(['inputs']);
			});
		};

		canvas.addEventListener('mousedown', onCanvasPointerDown);
		canvas.addEventListener('touchstart', onCanvasPointerDown);
		hueBar.addEventListener('mousedown', onHueBarPointerDown);
		hueBar.addEventListener('touchstart', onHueBarPointerDown);
		alphaBar.addEventListener('mousedown', onAlphaBarPointerDown);
		alphaBar.addEventListener('touchstart', onAlphaBarPointerDown);
	}

	init() {
		if (this.options.default) {
			if (this.kcc.getColorType(this.options.default))
				this.kcc.color = this.options.default;
		}

		this.create();
		this.render();
	}

	refresh(element) {
		if (Array.isArray(element)) {
			for (let i = 0; i < element.length; i++) {
				this.refresh(element[i]);
			}
		} else if (typeof element === 'string') {
			switch (element) {
				case 'canvas':
					const canvas = this.element.querySelector('.kc-color-picker-canvas');
					const canvasPointer = this.element.querySelector('.kc-color-picker-canvas-pointer');
					canvas.style.background = `linear-gradient(180deg, transparent 0%, black 100%), linear-gradient(-90deg, transparent 0%, white 100%), hsl(${this.h}, 100%, 50%)`;
					canvasPointer.style.left = `${this.s}%`;
					canvasPointer.style.top = `${100 - this.v}%`;
					break;
				case 'hue-bar':
					const hueBarPointer = this.element.querySelector('.kc-color-picker-hue-pointer');
					hueBarPointer.style.top = `${this.kcc.h / 360 * 100}%`;
					break;
					case 'alpha-bar':
						const alphaBar = this.element.querySelector('.kc-color-picker-alpha');
						const alphaBarPointer = this.element.querySelector('.kc-color-picker-alpha-pointer');
						alphaBar.children[0].style.background = `linear-gradient(to bottom, hsl(${this.h},${this.s}%,${this.l}%), transparent 100%)`;
						alphaBarPointer.style.top = `${(1 - this.kcc.a) * 100}%`;
						console.log(this.kcc.hsv, this.kcc.hsl);
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
				case 'input-h':
					this.refresh(['input-h1', 'input-h2']);
					break;
				case 'input-s':
					this.refresh(['input-s1', 'input-s2']);
					break;
				case 'input-h1':
					// Todo: update input-h1
					break;
				case 'input-s1':
					// Todo: update input-s1
					break;
				case 'input-l':
					// Todo: update input-l
					break;
				case 'input-h2':
					// Todo: update input-h2
					break;
				case 'input-s2':
					// Todo: update input-s2
					break;
				case 'input-v':
					// Todo: update input-v
					break;
				case 'input-r':
					// Todo: update input-r
					break;
				case 'input-g':
					// Todo: update input-g
					break;
				case 'input-b':
					// Todo: update input-b
					break;
				case 'input-hex':
					// Todo: update input-hex
					break;
				case 'input-a':
					// Todo: update input-a
					break;
			}
		} else if (typeof element === 'undefined') {
			this.refresh(['canvas', 'hue-bar', 'alpha-bar', 'inputs']);
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
	get target() { return this.#target; }
	get kcc() { return this.#kcc; }
	get options() { return this.#options; }

	get r() { return this.kcc.r; }
	get g() { return this.kcc.g; }
	get b() { return this.kcc.b; }
	get h() { return this.kcc.h; }
	get s() { return this.kcc.s; }
	get l() { return this.kcc.l; }
	get v() { return this.kcc.v; }
	get a() { return this.kcc.a; }
	get hex() { return this.kcc.hex; }

	#element = null;
	#kcc = null;
	#options = {
		default: undefined,
	};
	#target = null;
}