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
				</div>
			</div>`;

		const canvas = this.element.querySelector('.kc-color-picker-canvas');
		const canvasPointer = this.element.querySelector('.kc-color-picker-canvas-pointer');
		const hueBar = this.element.querySelector('.kc-color-picker-hue');
		const huePointer = this.element.querySelector('.kc-color-picker-hue-pointer');

		canvas.style.width = '200px';
		canvas.style.height = '200px';
		canvas.style.background = `linear-gradient(180deg, transparent 0%, black 100%),linear-gradient(-90deg, transparent 0%, white 100%), hsl(${this.hue}, 100%, 50%)`;
		//canvas.style.background = `linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)`;

		// Function for initialize listener for canvas pointer
		const initCanvasPointer = (e) => {
			e.preventDefault();
			e.stopPropagation();
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

			const drag = (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (!getCoords(e))
					return false;
				getPercentage(e);
				setCanvasPointer();
				return true;
			}

			const drop = (e) => {
				e.preventDefault();
				e.stopPropagation();
				const hue = this.hsl.split(',')[0].replace('hsl(', '');
				if (isNaN(hue))
					return false;
				this.hsl = `hsl(${hue}, ${1 - percentage.x}, ${1 - percentage.y})`;

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
	}

	init() {
		this.create();
		this.render();
	}

	render() {
		if (typeof this.target?.append !== 'function')
			return false;
		if (this.element === null)
			return false;
		this.target.append(this.element);
		return true;
	}

	#identifyColorType(color) {
		if (typeof color !== 'string')
			return false;
		if (color.startsWith('#')) {
			color = color.substring(1);
			if ([3, 6, 8].includes(color.length) && color.match(/^[0-9a-f]+$/i))
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
			color = color.substring(4).substring(0, color.length - 5);
			const colorArray = color.split(',');
			if (color.match(/^[0-9,.]+$/) && colorArray.length === 3) {
				if (isNaN(colorArray[0]) || colorArray[0] < 0 || colorArray[0] > 360)
					return false;
				if (isNaN(colorArray[1]) || colorArray[1] < 0 || colorArray[1] > 1)
					return false;
				if (isNaN(colorArray[2]) || colorArray[2] < 0 || colorArray[2] > 1)
					return false;
				return 'hsl';
			}
		}
		return false;
	}

	get hue() {
		return this.#hue;
	}
	get target () {
		return this.#target;
	}
	get element() {
		return this.#element;
	}
	get color() {
		return this.hex;
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
			default:
				return false;
		}
		this.refresh();
		return true;
	}
	get hex() {
		return this.#hex;
	}

	#target = null;
	#element = null;
	#hex = null;
	#rgb = null;
	#hsl = null;
	#hue = 0;
	#options = {};
}