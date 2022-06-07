class KCStudio {
	constructor(element, options) {
		if (typeof options === 'undefined') {
			options = {};
		}
		if (typeof options === 'object') {
			if (typeof options.border === 'boolean')
				this.#options.border = options.border;
			if (typeof options.fullscreen === 'boolean')
				this.#options.fullscreen = options.fullscreen;
			if (typeof options.header === 'object') {
				if (typeof options.header.show === 'boolean')
					this.#options.header.show = options.header.show;
				//CODE
			}
			if (typeof options.menus === 'object') {
				if (typeof options.menus.bottom === 'object') {
					if (typeof options.menus.bottom.show === 'boolean')
						this.#options.menus.bottom.show = options.menus.bottom.show;
					//CODE
				}
				if (typeof options.menus.left === 'object') {
					if (typeof options.menus.left.show === 'boolean')
						this.#options.menus.left.show = options.menus.left.show;
					//CODE
				}
				if (typeof options.menus.right === 'object') {
					if (typeof options.menus.right.show === 'boolean')
						this.#options.menus.right.show = options.menus.right.show;
					//CODE
				}
			}
			if (typeof options.onsave === 'function')
				this.#options.onsave = options.onsave;
			//CODE
		} else {
			this.#error('The "options" parameter in constructor is not of the expected type. ("object")');
			return;
		}
		if (element instanceof Element) {
			let base = document.createElement('div');
			base.innerHTML = `
				<div class="kanecode-studio" tabindex="0">
					<div class="kanecode-studio-header">
						<nav>
							<button data-kcs-action="menu-left">${this.icon('ki-duotone ki-menu-left')}</button>
							<div class="separator"></div>
							<button data-kcs-action="save">${this.icon('ki-duotone ki-download')}${this.loc('Save')}</button>
							<div class="separator"></div>
							<button data-kcs-action="undo">${this.icon('undo')}</button>
							<button data-kcs-action="redo">${this.icon('redo')}</button>
						</nav>
						<nav>
							<button class="transparent" data-kcs-action="resize" data-kcs-value="desktop">${this.icon('ki-duotone ki-desktop')}</button>
							<button class="transparent" data-kcs-action="resize" data-kcs-value="tablet">${this.icon('ki-duotone ki-tablet')}</button>
							<button class="transparent" data-kcs-action="resize" data-kcs-value="mobile">${this.icon('ki-duotone ki-mobile')}</button>
							<button disabled class="transparent" data-kcs-action="resize" data-kcs-value="custom">${this.icon('resize')}</button>
						</nav>
						<nav class="kanecode-studio-resizes">
							<button data-kcs-action="preview">${this.icon('ki-duotone ki-eye')}</button>
							<button data-kcs-action="fullscreen">
								<span data-kcs-value="maximize">${this.icon('ki-duotone ki-maximize')}</span>
								<span data-kcs-value="minimize">${this.icon('ki-duotone ki-minimize')}</span>
							</button>
							<button data-kcs-action="menu-bottom">${this.icon('menu-bottom')}</button>
							<button data-kcs-action="menu-right">${this.icon('menu-right')}</button>
						</nav>
					</div>
					<div class="kanecode-studio-body">
						<div class="kanecode-studio-menu-left">
							<div class="kanecode-studio-components-list"></div>
						</div>
						<div class="kanecode-studio-center">
							<div class="kanecode-studio-canvas">
								<div class="kanecode-studio-canvas-area">
									<div class="kanecode-studio-frame-target" disabled></div>
									<div class="kanecode-studio-frame-target-tools" disabled>
										<span class="kanecode-studio-frame-tools-label"></span>
									</div>
									<div class="kanecode-studio-frame-selected" disabled></div>
									<div class="kanecode-studio-frame-selected-tools" disabled>
										<span class="kanecode-studio-frame-tools-label"></span>
									</div>
									<div class="kanecode-studio-drag-area" disabled></div>
								</div>
							</div>
							<div class="kanecode-studio-menu-bottom"></div>
						</div>
						<div class="kanecode-studio-menu-right"></div>
						<div class="kanecode-studio-process">
						<div class="kanecode-studio-process-message"></div>
						</div>
					</div>
					<div class="kanecode-studio-error">
					</div>
				</div>`;
			base = base.children[0];

			this.#element = base;
			this.#process('Creating KaneCode Studio structure', { spinner: true, disable: false });

			this.#elements = {
				buttons: {
					fullscreen: [...base.querySelectorAll('[data-kcs-action="fullscreen"]')],
					menuBottom: [...base.querySelectorAll('[data-kcs-action="menu-bottom"]')],
					menuLeft: [...base.querySelectorAll('[data-kcs-action="menu-left"]')],
					menuRight: [...base.querySelectorAll('[data-kcs-action="menu-right"]')],
					redo: [...base.querySelectorAll('[data-kcs-action="redo"]')],
					resize: [...base.querySelectorAll('[data-kcs-action="resize"]')],
					save: [...base.querySelectorAll('[data-kcs-action="save"]')],
					undo: [...base.querySelectorAll('[data-kcs-action="undo"]')],
					//CODE
				},
				menus: {
					bottom: base.querySelector('.kanecode-studio-menu-bottom'),
					left: base.querySelector('.kanecode-studio-menu-left'),
					right: base.querySelector('.kanecode-studio-menu-right'),
				},
			};
			this.#iframe = document.createElement('iframe');
			this.#iframe.setAttribute('src', 'about:blank');
			
			if (this.#options.border === true)
				this.#element.classList.add('show-border');
			if (this.#options.fullscreen === true)
				this.fullscreen();
			if (this.#options.header.show === false)
				this.#element.classList.add('hide-header');
			if (this.#options.menus.bottom.show === true)
				this.showMenu('bottom');
			if (this.#options.menus.left.show === true)
				this.showMenu('left');
			if (this.#options.menus.right.show === true)
				this.showMenu('right');

			// Buttons click functions
			this.#elements.buttons.fullscreen.forEach(button => {
				button.addEventListener('click', () => { this.fullscreen() });
			});
			this.#elements.buttons.menuBottom.forEach(button => {
				button.addEventListener('click', () => { this.toggleMenu('bottom') });
			});
			this.#elements.buttons.menuLeft.forEach(button => {
				button.addEventListener('click', () => { this.toggleMenu('left') });
			});
			this.#elements.buttons.menuRight.forEach(button => {
				button.addEventListener('click', () => { this.toggleMenu('right') });
			});
			this.#elements.buttons.redo.forEach(button => {
				button.setAttribute('disabled', '');
				button.addEventListener('click', () => { this.redo() });
			});
			this.#elements.buttons.resize.forEach(button => {
				button.addEventListener('click', () => { this.resize(button.getAttribute('data-kcs-value')) });
			});
			this.#elements.buttons.save.forEach(button => {
				button.setAttribute('disabled', '');
				button.addEventListener('click', () => { this.save() });
			});
			this.#elements.buttons.undo.forEach(button => {
				button.setAttribute('disabled', '');
				button.addEventListener('click', () => { this.undo() });
			});

			this.resize('desktop');
			
			element.append(base);
			this.#element.querySelector('.kanecode-studio-canvas-area').prepend(this.#iframe);

			this.#process('Loading initial canvas', { spinner: true, disable: false });
			this.open('');
			this.#process(null);

		} else {
			this.#error('The "element" parameter in constructor is not an element.');
			return;
		}
	}

	add(element, target, index) {
		if (!this.#error && this.#enabled && this.#document) {
			if (element?.nodeName && target?.nodeName && typeof index === 'number') {
				if (this.#document.documentElement.contains(target)) {
					const max = target.children.length;
					if (index < 0)
						index = 0;
					if (index > max)
						index = max;
					if (index == 0)
						target.prepend(element);
					else {
						if (index > max)
							target.append(element);
						else
							target.insertBefore(element, target.children[index]);
					}
					this.#action(() => { this.add(element, target, index) }, () => { this.remove(element) }, 'Add component');
				}
			} else {
				//todo
				return;
			}
		}
	}

	addComponent(id, component, group) {
		if (!this.#error) {
			if (typeof id === 'string' && typeof component === 'object' && typeof group === 'string') {
				if (typeof this.#componentGroups[group] === 'object' && typeof this.loc(component.title) === 'string') {
					this.#components[id] = {
						class: (Array.isArray(this.loc(component.class))) ? this.loc(component.class) : [],
						description: (typeof this.loc(component.description) === 'string') ? this.loc(component.description) : null,
						html: null,
						icon: (typeof component.icon === 'string') ? component.icon : (typeof component.icon === 'object') ? component.icon : '?',
						group: group,
						options: {
							hidden: false,
							removable: true,
							inside: {
								allow: false,
								include: undefined,
								exclude: undefined,
								element: undefined,
								horizontal: false,
							}
						},
						tagName: (Array.isArray(this.loc(component.tagName))) ? this.loc(component.tagName) : [],
						tags: (Array.isArray(this.loc(component.tag))) ? this.loc(component.tag) : [],
						title: this.loc(component.title),
					}
					if (typeof component.html === 'function')
						try { component.html = component.html(this) } catch {}
					if (typeof component.html === 'string' || component.html instanceof Element)
						this.#components[id].html = component.html;
					if (typeof component.options === 'object') {
						if (typeof component.options.hidden === 'boolean')
							this.#components[id].options.hidden = component.options.hidden;
						if (typeof component.options.inside === 'object') {
							if (typeof component.options.inside.allow === 'boolean')
								this.#components[id].options.inside.allow = component.options.inside.allow;
							if (Array.isArray(component.options.inside.include)) {
								this.#components[id].options.inside.include = [];
								component.options.inside.include.forEach((comp) => {
									if (typeof comp === 'string')
										this.#components[id].options.inside.include.push(comp);
								});
							}
							if (typeof component.options.inside.include === 'string')
								this.#components[id].options.inside.include = [component.options.inside.include];
							if (Array.isArray(component.options.inside.exclude)) {
								this.#components[id].options.inside.exclude = [];
								component.options.inside.exclude.forEach((comp) => {
									if (typeof comp === 'string')
										this.#components[id].options.inside.exclude.push(comp);
								});
							}
							if (typeof component.options.inside.exclude === 'string')
								this.#components[id].options.inside.exclude = [component.options.inside.exclude];
							if (Array.isArray(component.options.inside.element)) {
								this.#components[id].options.inside.element = [];
								component.options.inside.element.forEach((comp) => {
									if (typeof comp === 'string')
										this.#components[id].options.inside.element.push(comp);
								});
							}
							if (typeof component.options.inside.element === 'string')
								this.#components[id].options.inside.element = [component.options.inside.element];
							if (typeof component.options.inside.horizontal === 'boolean')
								this.#components[id].options.inside.horizontal = component.options.inside.horizontal;
						}
					}
					this.#renderComponent(id);
				}
			}
		}
		return false;
	}

	addComponentGroup(id, group) {
		if (!this.#error) {
			if (typeof id === 'string' && typeof group === 'object') {
				if (typeof this.loc(group.title) === 'string') {
					this.#componentGroups[id] = {
						color: (typeof group.color === 'string') ? group.color : '#808080',
						icon: (typeof group.icon === 'string') ? group.icon : '?',
						title: this.loc(group.title),
					}
					if (typeof group.components === 'object') {
						for (let idC in group.components) {
							this.addComponent(idC, group.components[idC], id);
						}
					}
					return true;
				}
			}
		}
		return false;
	}

	loadComponents(groups = {}, components = {}) {
		if (!this.#error) {
			if (typeof groups === 'object' && typeof components === 'object') {
				const list = this.#element.querySelector('.kanecode-studio-components-list');
				list.innerHTML = '';
				for (let id in groups)
					this.addComponentGroup(id, groups[id]);
				for (let id in components) {
					if (typeof components[id] === 'object') {
						if (typeof components[id].group === 'string') {
							this.addComponent(id, components[id], components[id].group);
						}
					}
				}
			}
		}
		return false;
	}

	disable() {
		this.#enabled = false;
		if (this.#refreshInterval !== null) {
			clearInterval(this.#refreshInterval);
			this.#refreshInterval = null;
		}
	}
	
	enable() {
		this.#enabled = true;
		if (this.#refreshInterval !== null) {
			clearInterval(this.#refreshInterval);
		}
		this.#refreshInterval = setInterval(() => {
			this.refresh();
			this.#edges();
		}, this.#options.refresh);
	}

	fullscreen() {
		if (!this.#error && this.#enabled) {
			this.#element.classList.toggle('fullscreen');
			this.refresh();
		}
	}

	hideMenu(menu) {
		if (!this.#error && this.#enabled) {
			if (['bottom', 'left', 'right'].includes(menu)) {
				this.#element.classList.remove(`show-menu-${menu}`);
				this.refresh();
			}
		}
	}

	open(content) {
		if (!this.#error && this.#enabled) {
			if (typeof content === 'string') {
				this.disable();
				this.#iframe.onload = () => {
					this.#document = this.#iframe.contentWindow.document;
					this.#document.addEventListener('click', (e) => {
						if (this.#config.dragging === false) {
							e.preventDefault();
							this.selected = this.#getStudioElement(e.target);
						}
					});
					this.#shortcuts.forEach(shortcut => {
						if (typeof shortcut === 'object') {
							if (typeof shortcut.fn === 'function') {
								const keydown = (e) => {
									if ((shortcut.input !== true && typeof shortcut.input !== 'undefined')
									&& ((document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text')
									|| document.activeElement.tagName === 'TEXTAREA'))
										return false;
									const combination = shortcut[this.#device()];
									if (typeof combination === 'object') {
										if (typeof combination.key === 'string') {
											if (combination.meta === true && !e.metaKey)
												return false;
											if (combination.ctrl === true && !e.ctrlKey)
												return false;
											if (combination.shift === true && !e.shiftKey)
												return false;
											if (combination.alt === true && !e.altKey)
												return false;
											if (combination.key.toLowerCase() === e.key.toLowerCase()) {
												e.preventDefault();
												shortcut.fn(e);
												return true;
											}
										}
									}
									return false;
								};
								this.#document.addEventListener('keydown', keydown);
								if (this.#config.shortcuts !== true)
									this.#element.addEventListener('keydown', keydown);
							}
						}
					});
					if (this.#config.shortcuts !== true)
						this.#config.shortcuts = true;
					this.selected = null;
					this.#document.addEventListener('scroll', () => {
						this.refresh();
					});
					this.#document.addEventListener('mouseover', (e) => {
						if (this.#config.dragging === false)
							this.target = e.target;
					});
					this.#document.addEventListener('mouseout', (e) => {
						if (this.#config.dragging === false)
							this.target = null;
					});
					const edgeDistance = 50;
					const calcIncrement = (position) => {
						position = Math.abs(position);
						position = (position < 0) ? 0 : (position > edgeDistance) ? edgeDistance : position;
						return Math.round(1 + (position / edgeDistance) * 9);
					};
					this.#document.addEventListener('mousemove', (e) => {
						if (this.#config.edges.enabled) {
							const coords = { x: e.clientX, y: e.clientY};
							const increment = { x: 0, y: 0 };
							const iframeBCR = this.#iframe.getBoundingClientRect();
							const edges = { left: 0, top: 0, right: iframeBCR.width, bottom: iframeBCR.height };
							if (coords.x < edges.left + edgeDistance) {
								increment.x = -calcIncrement(edgeDistance - coords.x)
							} else if (coords.x > edges.right - edgeDistance) {
								increment.x = calcIncrement(edges.right - coords.x - edgeDistance)
							}
							if (coords.y < edges.top + edgeDistance) {
								increment.y = -calcIncrement(edgeDistance - coords.y)
							} else if (coords.y > edges.bottom - edgeDistance) {
								increment.y = calcIncrement(edges.bottom - coords.y - edgeDistance)
							}
							this.#config.edges.increment.x = (increment.x == 0) ? null : increment.x;
							this.#config.edges.increment.y = (increment.y == 0) ? null : increment.y;
						}
					});
					this.enable();
					
					this.loadComponents(KCStudioComponents);
					//console.log(this.utils.uuid());
				};
				this.#iframe.srcdoc = this.#options.zone.start + content + this.#options.zone.end;
			} else if (typeof content === 'function') {
				this.#process('Opening', { spinner: true });
				const opened = (content) => {
					this.enable();
					this.open(content);
					this.#process('The page has been loaded!', { disable: false });
					setTimeout(() => {
						this.#elements.buttons.save.forEach(button => {
							button.setAttribute('disabled', '');
						});
						this.#process(null);
					}, 1000);
				};
				const error = () => { 
					this.#process('There was an error loading the page.', { disable: false });
					setTimeout(() => {
						this.#process(null);
					}, 1000);
				};

				try { content = content() } catch {}

				if (content instanceof Promise) {
					let timeout = setTimeout(() => {
						error();
						timeout = null;
					}, this.#options.expiration);
					content.then(content => {
						if (timeout !== null) {
							if (typeof content === 'string') {
								opened(content);
							} else {
								error();
							}
							clearTimeout(timeout);
							timeout = null;
						}
					}).catch(() => {
						if (timeout !== null) {
							error();
							clearTimeout(timeout);
							timeout = null;
						}
					});
				} else if (typeof content === 'string') {
					opened(content);
				} else {
					error();
				}
				return true;
			}
		}
		return false;
	}

	redo() {
		let res = false;
		if (!this.#error && this.#enabled) {
			if (!this.#isUndoRedo && this.#redoList.length > 0) {
				const action = this.#redoList.pop();
				if (Array.isArray(action)) {
					if (action.length === 3) {
						if (typeof action[0] === 'function') {
							this.#isUndoRedo = true;
							action[0]();
							res = true;
							this.#isUndoRedo = false;
						}
					}
				}
				if (res) {
					this.#process(`${this.loc('Redo')} "${this.loc(action[2])}"`, { disable: false, cursor: true });
					if (typeof this._undoRedoAnimation !== 'undefined') {
						clearTimeout(this._undoRedoAnimation);
						this._undoRedoAnimation = undefined;
					}
					this._undoRedoAnimation = setTimeout(() => {
						this.#process(null);
						this._undoRedoAnimation = undefined;
					}, 400);
					this.#undoList.push(action);
				} else {
					this.#redoList.push(action);
				}
			}
			this.#elements.buttons.redo.forEach(redo => {
				if (this.#redoList.length > 0) {
					redo.removeAttribute('disabled');
				} else {
					redo.setAttribute('disabled', '');
				}
			});
			this.#elements.buttons.undo.forEach(undo => {
				if (this.#undoList.length > 0) {
					undo.removeAttribute('disabled');
				} else {
					undo.setAttribute('disabled', '');
				}
			});
		}
		return res;
	}

	refresh() {
		if (!this.#error && this.#enabled) {
			const frameTarget = this.#element.querySelector('.kanecode-studio-frame-target');
			const frameSelected = this.#element.querySelector('.kanecode-studio-frame-selected');
			const refreshFrame = (frame, element) => {
				if (this.#document?.contains(element)) {
					const elBCR = element.getBoundingClientRect();
					frame.removeAttribute('disabled');
					frame.nextElementSibling.removeAttribute('disabled');
					const labelHeight = frame.nextElementSibling.getBoundingClientRect().height;
					const distance = 1;
					frame.style.top = `${elBCR.top}px`;
					frame.style.left = `${elBCR.left}px`;
					frame.style.width = `${elBCR.width}px`;
					frame.style.height = `${elBCR.height}px`;
					frame.nextElementSibling.style.top = `${(elBCR.top < labelHeight) ? (elBCR.height > 150) ? (elBCR.bottom < labelHeight - distance) ? elBCR.bottom - labelHeight - distance : 0 : elBCR.bottom + distance : elBCR.top - labelHeight - distance}px`;
					frame.nextElementSibling.style.left = `${(elBCR.left < 0) ? 0 : elBCR.left}px`;
				} else if (element === null) {
					frame.setAttribute('disabled', '');
					frame.nextElementSibling.setAttribute('disabled', '');
					frame.style.top = null;
					frame.style.left = null;
					frame.style.width = null;
					frame.style.height = null;
					frame.nextElementSibling.style.top = null;
					frame.nextElementSibling.style.left = null;
				}
			};
			if (this.#config.dragging) {
				//frameTarget.setAttribute('disabled', '');
				//refreshFrame(frameTarget, this.target);
				frameSelected.setAttribute('disabled', '');
				frameTarget.nextElementSibling.setAttribute('disabled', '');
				frameSelected.nextElementSibling.setAttribute('disabled', '');
			} else {
				refreshFrame(frameTarget, this.target);
				refreshFrame(frameSelected, this.selected);
			}
		}
	}

	remove(element) {
		if (this.#error || this.#enabled) {
			this.#errorLog('Cannot remove the element because the editor is not enabled or there is an error. Please try again later.');
			return false;
		}
		if (!element?.nodeName) {
			this.#errorLog('Cannot remove the element because it is not a valid element.');
			return false;
		}
		if (!this.#document.documentElement.contains(element)) {
			this.#errorLog('Cannot remove the element because it is not inside the document.');
			return false;
		}
		const parent = element.parentNode;
		const index = [...element.parentElement.children].indexOf(element);
		this.#action(() => {
			this.remove(element)
		}, () => {
			this.add(element, parent, index);
		}, 'Remove component');

		element.remove();
		this.target = null;
		this.selected = null;
	}

	resize(resolution) {
		const resolutions = {
			'desktop': [3840, 2160],
			'tablet': [800, 1100],
			'mobile': [400, 700],
		};
		if (typeof resolution === 'string') {
			if (resolution === 'cutom') {
				//CODE
			} else
				resolution = resolutions[resolution];
			return this.resize(resolution);
		} else if (Array.isArray(resolution)) {
			if (resolution.length === 2) {
				if (typeof resolution[0] === 'number' && typeof resolution[1] === 'number') {
					const canvas = this.#element.querySelector('.kanecode-studio-canvas-area');
					canvas.style.maxWidth = `${resolution[0]}px`;
					canvas.style.maxHeight = `${resolution[1]}px`;
					this.refresh();
					let device = 'custom';
					for (let k in resolutions) {
						if (JSON.stringify(resolutions[k]) === JSON.stringify(resolution)) {
							device = k;
							break;
						}
					}
					this.#elements.buttons.resize.forEach(button => {
						if (button.getAttribute('data-kcs-value') === device)
							button.classList.add('active');
						else
							button.classList.remove('active');
					});
					//CODE
					return true;
				}
			}
		}
		return false;
	}

	save() {
		if (!this.#error && this.#enabled) {
			this.#process('Saving', { spinner: true });
			const saved = () => { 
				this.#process('The page has been saved successfully!', { disable: false });
				setTimeout(() => {
					this.#elements.buttons.save.forEach(button => {
						button.setAttribute('disabled', '');
					});
					this.#process(null);
				}, 1000);
			};
			const error = () => { 
				this.#process('There was an error saving.', { disable: false });
				setTimeout(() => {
					this.#process(null);
				}, 1000);
			};

			let save = false;
			try { save = this.#options.onsave() } catch {}

			if (save instanceof Promise) {
				let timeout = setTimeout(() => {
					error();
					timeout = null;
				}, this.#options.expiration);
				save.then((res) => {
					if (timeout !== null) {
						if (res === true || res === undefined) {
							saved();
						} else {
							error();
						}
						clearTimeout(timeout);
						timeout = null;
					}
				}).catch(() => {
					if (timeout !== null) {
						error();
						clearTimeout(timeout);
						timeout = null;
					}
				});
			} else {
				if (save === true) {
					saved();
				} else {
					error();
				}
			}
			return true;
		}
		return false;
	}

	showMenu(menu) {
		if (!this.#error && this.#enabled) {
			if (['bottom', 'left', 'right'].includes(menu)) {
				this.#element.classList.add(`show-menu-${menu}`);
				this.refresh();
			}
		}
	}

	test() {
		this.#action(() => { this.test() }, () => { this.test() }, 'Test action');
	}

	toggleMenu(menu) {
		if (!this.#error && this.#enabled) {
			if (['bottom', 'left', 'right'].includes(menu)) {
				this.#element.classList.toggle(`show-menu-${menu}`);
				this.refresh();
			}
		}
	}

	undo() {
		let res = false;
		if (!this.#error && this.#enabled) {
			if (!this.#isUndoRedo && this.#undoList.length > 0) {
				const action = this.#undoList.pop();
				if (Array.isArray(action)) {
					if (action.length === 3) {
						if (typeof action[1] === 'function' && typeof action[2] === 'string') {
							this.#isUndoRedo = true;
							action[1]();
							res = true;
							this.#isUndoRedo = false;
						}
					}
				}
				if (res) {
					this.#process(`${this.loc('Undo')} "${this.loc(action[2])}"`, { disable: false, cursor: true });
					if (typeof this._undoRedoAnimation !== 'undefined') {
						clearTimeout(this._undoRedoAnimation);
						this._undoRedoAnimation = undefined;
					}
					this._undoRedoAnimation = setTimeout(() => {
						this.#process(null);
						this._undoRedoAnimation = undefined;
					}, 400);
					this.#redoList.push(action);
				} else {
					this.#undoList.push(action);
				}
			}
			this.#elements.buttons.redo.forEach(redo => {
				if (this.#redoList.length > 0) {
					redo.removeAttribute('disabled');
				} else {
					redo.setAttribute('disabled', '');
				}
			});
			this.#elements.buttons.undo.forEach(undo => {
				if (this.#undoList.length > 0) {
					undo.removeAttribute('disabled');
				} else {
					undo.setAttribute('disabled', '');
				}
			});
		}
		return res;
	}

	set selected(element) {
		if (!this.#error && this.#enabled) {
			if (this.#document.body.contains(element) || this.#document.body == element) {
				this.#selected = this.#getStudioElement(element);
				const label = document.querySelector('.kanecode-studio-frame-selected-tools').children[0];
				label.innerText = this.#components[this.#getComponentType(this.#selected)].title;
			} else
				this.#selected = null;
			this.refresh();
		}
	}

	get selected() {
		return this.#selected;
	}

	set target(element) {
		if (!this.#error && this.#enabled) {
			if (this.#document.body.contains(element) || this.#document.body == element) {
				this.#target = this.#getStudioElement(element);
				const label = document.querySelector('.kanecode-studio-frame-target-tools').children[0];
				label.innerText = this.#components[this.#getComponentType(this.#target)].title;
			} else
				this.#target = null;
			this.refresh();
		}
	}

	get target() {
		return this.#target;
	}

	get utils() {
		return this.#utils;
	}

	#action(action, opposite, description) {
		if (!this.#error && this.#enabled) {
			if (typeof action === 'function' && typeof opposite === 'function' && typeof description === 'string') {
				this.#elements.buttons.save.forEach(button => {
					button.removeAttribute('disabled');
				});
				if (!this.#isUndoRedo) {
					this.#redoList = [];
					this.#undoList.push([action, opposite, description]);
					this.#elements.buttons.redo.forEach(redo => {
						redo.setAttribute('disabled', '');
					});
					this.#elements.buttons.undo.forEach(undo => {
						undo.removeAttribute('disabled');
					});
					return true;
				}
			}
		}
		return false
	}

	#device() {
		const platform = navigator?.userAgentData?.platform || navigator?.platform || 'unknown';
		if (platform.toUpperCase().indexOf('MAC') >= 0
		|| platform.match(/(Mac|iPhone|iPod|iPad)/i)) {
			return 'mac';
		}
		return 'win';
	}

	icon(icon) {
		if (typeof icon === 'string') {
			if (icon.indexOf('ki-') === 0) {
				if (icon.indexOf('ki-duotone ki-') === 0) {
					return `<i class="${icon}"></i>`;
				}
				return `<i class="${icon}"></i>`;
			}
			if (typeof this.#icons[icon] === 'string') {
				return `<svg class="kcs-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${this.#icons[icon]}</svg>`;
			}
		}
		return icon;
	}

	loc(text) {
		if (typeof text === 'string') {
			let dict = {};
			if (typeof this.#language === 'object') {
				dict = this.#language;
			} else if (typeof this.#language === 'string') {
				if (typeof this.#languages[this.#language] === 'object') {
					dict = this.#languages[this.#language];
				}
			}
			if (typeof dict[text] === 'string') {
				return dict[text];
			}
		}
		if (typeof text === 'object') {
			if (this.#language in text) {
				return text[this.#language];
			}
		}
		return text;
	}

	#dragElement(e, element) {
		if (!this.#error && this.#enabled) {
			e.preventDefault();
			const touch = (e instanceof TouchEvent) ? true : false;
			const id = this.#getComponentType(element);
			if (id in this.#components) {
				this.#document.body.classList.add('kcs-grabbing');
				this.#element.classList.add('grabbing');
				this.#config.dragging = true;
				this.#config.edges.enabled = true;
				const selected = this.selected;
				this.#selected = null;
				this.refresh();
				const scrollType = this.#document.documentElement.style.scrollBehavior;
				this.#document.documentElement.style.scrollBehavior = 'inherit';
				const iframeBCR = this.#iframe.getBoundingClientRect();
				const component = this.#components[id];
				const coords = {};
				const helper = document.createElement('div');
				helper.className = 'kanecode-studio-component-helper';
				helper.innerHTML = this.icon(component.icon);
				if (component?.icon?.light && component?.icon?.dark) {
					helper.innerHTML = `<div class="kcs-icon-light">${this.icon(component.icon.light)}</div><div class="kcs-icon-dark">${this.icon(component.icon.dark)}</div>`;
				}

				const addInfo = {
					parent: null,
					child: null,
					enabled: false,
				};

				const area = this.#element.querySelector('.kanecode-studio-drag-area');
				const hideArea = () => {
					area.setAttribute('disabled', '');
				}
				const showArea = () => {
					area.removeAttribute('disabled');
				}
				const setArea = (top, left, width, height) => {
					area.style.top = `${top}px`;
					area.style.left = `${left}px`;
					area.style.width = `${width}px`;
					area.style.height = `${height}px`;
					showArea();
				}
				const resetArea = () => {
					area.style.top = null;
					area.style.height = null;
					area.style.left = null;
					area.style.width = null;
					hideArea();
					addInfo.enabled = false;
				};

				const showAreaByElement = (element) => {
					// Get the path to the element where the mouse is currently hovering.
					const getElementPath = (element) => {
						const path = [];
						while (element) {
							path.push(element);
							if (element.parentElement)
								element = element.parentElement;
							else
								break;
						}
						return path;
					};

					// Remove the elements that don't allow the user to drag a component inside.
					const removeNotAllowedElements = (path) => {
						for (let i = path.length - 1; i >= 0; i--) {
							const id = this.#getComponentType(path[i]);
							if (id in this.#components) {
								if (this.#components[id].options.inside.allow === false) {
									path.splice(0, i + 1);
									break;
								}
							} else {
								path.splice(i, 1);
							}
						}
						return path;
					};

					// Get the target element from path.
					const getTargetElement = (path) => {
						for (let i = 0; i < path.length; i++) {
							const _id = this.#getComponentType(path[i]);
							if (_id in this.#components) {
								if (this.#components[_id].options.inside.exclude?.includes?.(id))
									continue;
								if (typeof this.#components[_id].options.inside.include === 'undefined' || this.#components[_id].options.inside.include?.includes?.(id)) {
									return path[i];
								}
							}
						}
						return undefined;
					};

					// Get target element's orientation.
					const getElementOrientation = (target) => {
						if (target) {
							const id = this.#getComponentType(target);
							if (id in this.#components)
								if (this.#components[id].options.inside.horizontal)
									return 'horizontal';
						};
						return 'vertical';
					};

					// Get the element inside component where components are inserted.
					const getParentContainer = (element) => {
						const id = this.#getComponentType(element);
						if (id in this.#components) {
							if (Array.isArray(this.#components[id].options.inside.element)) {
								for (const selector of this.#components[id].options.inside.element) {
									if (typeof selector === 'string') {
										const el = element.querySelector(selector);
										if (el) return el;
									}
								}
							}
						}
						return element;
					}

					// Calculate the area where the component can be dropped.
					const calculateArea = (target, orientation) => {
						if (target) {
							let start = (orientation === 'horizontal') ? 'left'  : 'top';
							let end   = (orientation === 'horizontal') ? 'right' : 'bottom';
							let width = (orientation === 'horizontal') ? 'width' : 'height';
							let coord = (orientation === 'horizontal') ? 'x'     : 'y';

							const getNearChildToCursor = (container) => {
								const list = [];
								[...container.children].forEach((el) => {
									const elBCR = el.getBoundingClientRect();
									list.push([el, coords[coord] - (elBCR[start] + elBCR[width] / 2)]);
								});
								list.sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]));
								if (list.length > 0) {
									const element = list[0][0];
									if (list[0][1] < 0)
										return element.previousElementSibling;
									return element;
								}
								return undefined;
							};

							const targetBCR = target.getBoundingClientRect();
							let min = targetBCR[start];
							let max = targetBCR[end];
							
							const container = getParentContainer(target);
							addInfo.parent = container;
							addInfo.enabled = true;

							addInfo.child = 0;
							const nearPrev = getNearChildToCursor(container);

							if (nearPrev) {
								const nearNext = nearPrev.nextElementSibling;
								const nearPrevBCR = nearPrev.getBoundingClientRect();
								min = nearPrevBCR[end];
								if (nearNext) {
									const nearNextBCR = nearNext.getBoundingClientRect();
									max = nearNextBCR[start];
								}
								addInfo.child = [...container.children].indexOf(nearPrev) + 1;
							} else if (container.children.length > 0) {
								const nearNext = container.children[0];
								const nearNextBCR = nearNext.getBoundingClientRect();
								max = nearNextBCR[start];
							}

							let _start = min;
							let _width = max - min;
							if (_width < 6) {
								_start -= 3;
								_width += 6;
								if (_start < 0) {
									_start = -3;
									_width += 3;
								} else if (_start + _width > iframeBCR[width]) {
									_start -= 3;
									_width += 3;
								}
							}
							if (orientation === 'horizontal') {
								setArea(targetBCR.top, _start, _width, targetBCR.height);
							} else {
								setArea(_start, targetBCR.left, targetBCR.width, _width);
							}
						} else {
							resetArea();
						}
					};

					const path = removeNotAllowedElements(getElementPath(element));
					let target = getTargetElement(path);
					let orientation = getElementOrientation(target);

					calculateArea(target, orientation);
					
				}

				const _dragmove = (e) => {
					if (document != e.path[e.path.length - 2]) {
						coords.x += iframeBCR.left;
						coords.y += iframeBCR.top;
					} else {
						resetArea();
					}
					helper.style.left = `${coords.x}px`;
					helper.style.top = `${coords.y}px`;
				};
				const _dragend = (e) => {
					if (this.target) {
						
					} else {
						this.#target = selected;
					}
					resetArea();
					helper.remove();
					this.#document.documentElement.style.scrollBehavior = scrollType;
					this.#config.edges.enabled = false;
					this.#config.dragging = false;
					this.#element.classList.remove('grabbing');
					this.#document.body.classList.remove('kcs-grabbing');
				};
				if (touch) {
					this.#target = null;
					this.refresh();
					coords.x = e.touches[0].clientX;
					coords.y = e.touches[0].clientY;
					const dragmove = (e) => {
						coords.x = e.touches[0].clientX;
						coords.y = e.touches[0].clientY;
						if (coords.x >= iframeBCR.left && coords.x <= iframeBCR.right && coords.y >= iframeBCR.top && coords.y <= iframeBCR.bottom) {
							this.target = this.#document.elementFromPoint(coords.x - iframeBCR.left, coords.y - iframeBCR.top);
						} else {
							this.target = null;
						}
						_dragmove(e);
					};
					const dragmove_interface = (e) => {
						isInterface = true;
						coords.x = e.touches[0].clientX;
						coords.y = e.touches[0].clientY;
					};
					const dragmove_iframe = (e) => {
						isInterface = false;
						coords.x = e.touches[0].clientX;
						coords.y = e.touches[0].clientY;
						dragmove(e);
					};
					const dragend = (e) => {
						_dragend(e);
						document.removeEventListener('touchmove', dragmove);
						document.removeEventListener('touchend', dragend);
					};
					document.addEventListener('touchmove', dragmove);
					document.addEventListener('touchend', dragend);
				} else {
					coords.x = e.clientX;
					coords.y = e.clientY;
					const dragmove = (e) => {
						coords.x = e.clientX;
						coords.y = e.clientY;

						showAreaByElement(e.target);

						_dragmove(e);
					};
					const dragend = (e) => {
						if (addInfo.enabled) {
							const target = addInfo.parent;
							const index = addInfo.child;
							this.add(element, target, index);
						}
						_dragend(e);
						document.removeEventListener('mousemove', dragmove);
						this.#document.removeEventListener('mousemove', dragmove);
						document.removeEventListener('mouseup', dragend);
						this.#document.removeEventListener('mouseup', dragend);
					};
					document.addEventListener('mousemove', dragmove);
					this.#document.addEventListener('mousemove', dragmove);
					document.addEventListener('mouseup', dragend);
					this.#document.addEventListener('mouseup', dragend);
				}
				helper.style.left = `${coords.x}px`;
				helper.style.top = `${coords.y}px`;
				this.#element.append(helper);
			}
		}
		return false;
	}

	#edges() {
		if (!this.#error && this.#enabled) {
			if (this.#config.edges.enabled) {
				let change = false;
				let x = this.#document.documentElement.scrollLeft;
				let y = this.#document.documentElement.scrollTop;
				if (typeof this.#config.edges.increment.x === 'number') {
					x += this.#config.edges.increment.x * (this.#options.refresh / 10);
					change = true;
				}
				if (typeof this.#config.edges.increment.y === 'number') {
					y += this.#config.edges.increment.y * (this.#options.refresh / 10);
					change = true;
				}
				if (change) this.#iframe.contentWindow.scrollTo(x, y);
				return true;
			}
		}
		return false;
	}

	/**
	 * Find the element compatible with the studio.
	 * @param {Element} element Starting point element.
	 * @returns Parent element compatible with the studio.
	 */
	#getStudioElement(element) {
		if (!this.#error) {
			if (element?.tagName) {
				const list = [];
				let target = element;
				while (target) {
					list.push(target);
					if (target.parentElement)
						target = target.parentElement;
					else
						break;
				}
				let last = 0;
				for (let i = list.length - 1; i >= 0; i--) {
					const id = this.#getComponentType(list[i]);
					if (typeof id === 'string')
						if (this.#components[id].options.inside === false) {
							last = i;
							break;
						}
				}
				for (let i = last; i < list.length; i++) {
					if (typeof this.#getComponentType(list[i]) === 'string') {
						return list[i];
					}
				}
			}
		}
		return undefined;
	}

	#getComponentType(element) {
		if (!this.#error) {
			if (element?.tagName) {
				if (element.hasAttribute('data-kcs-component')) {
					const id = element.getAttribute('data-kcs-component');
					if (id in this.#components)
						return id;
				}
				let tagElement = null;
				for (let id in this.#components) {
					if (this.#components[id].class.some((c) => element.classList.contains(c)))
						return id;
					if (tagElement == null)
						if (this.#components[id].tagName.find(tagName => tagName.toLowerCase().trim() === element.tagName.toLowerCase()))
							tagElement = id;
				}
				if (typeof tagElement === 'string')
					return tagElement;
			}
		}
		return undefined;
	}

	#process(message, options) {
		const _options = {
			spinner: false,
			disable: true,
			cursor: false,
			time: null,
		};
		if (typeof options === 'object') {
			if (typeof options.spinner === 'boolean')
				_options.spinner = options.spinner;
			if (typeof options.disable === 'boolean')
				_options.disable = options.disable;
			if (typeof options.cursor === 'boolean')
				_options.cursor = options.cursor;
			if (typeof options.time === 'number' && options.time > 0)
				_options.time = options.time;
		}
		const process = this.#element.querySelector('.kanecode-studio-process-message');
		process.innerHTML = '';
		if (message === null) {
			this.#element.classList.remove('show-process');
			this.#element.classList.remove('show-process-cursor');
			this.enable();
		} else {
			if (_options.disable)
				this.disable();
			if (_options.cursor)
				this.#element.classList.add('show-process-cursor');
			else
				this.#element.classList.add('show-process');
			if (_options.spinner)
				process.innerHTML = '<div class="kcs-spinner"></div>';
			if (typeof message !== 'string')
				message = 'Loading';
			process.innerHTML += this.loc(message);
			if (_options.time)
				this.#processTimeout = setTimeout(() => {
					this.#process(null);
				}, _options.time);
			if (this.#processTimeout)
				clearTimeout(this.#processTimeout);
		}
	}

	#renderComponent(id) {
		if (!this.#error) {
			if (typeof id === 'string') {
				const component = this.#components[id];
				if (typeof component === 'object') {
					if (typeof component.group === 'string' && component.options.hidden === false && component.html !== null) {
						const list = this.#element.querySelector('.kanecode-studio-components-list');
						let grid = this.#elements.menus.left.querySelector(`.kanecode-studio-components-list-grid[data-kcs-group="${component.group}"]`);
						if (!grid) {
							const button = document.createElement('button');
							button.className = 'kanecode-studio-components-list-button';
							button.innerHTML= `<div class="kcs-dropdown-title">${this.#componentGroups[component.group].title}</div><div class="kcs-dropdown-arrow">${this.icon('angle-down')}</div>`;
							grid = document.createElement('div');
							grid.className = 'kanecode-studio-components-list-grid';
							grid.setAttribute('data-kcs-group', component.group);
							list.append(button);
							list.append(grid);
							button.addEventListener('click', () => {
								button.classList.toggle('active');
							});
							if (list.children[0] == button)
								button.classList.add('active');
						}
						let icon = this.icon(component.icon);
						if (component?.icon?.light && component?.icon?.dark) {
							icon = `<div class="kcs-icon-light">${this.icon(component.icon.light)}</div><div class="kcs-icon-dark">${this.icon(component.icon.dark)}</div>`;
						}
						const card = document.createElement('div');
						card.className = 'kanecode-studio-component-card';
						card.innerHTML = `<div class="kanecode-studio-component-card-icon">${icon}</div><div class="kanecode-studio-component-card-title">${component.title}</div>`;
						grid.append(card);
						
						let element = document.createElement('div');
						if (typeof component.html === 'string')
							element.innerHTML = component.html;
						else
							element.append(component.html);
						element = element.children[0];
						element.setAttribute('data-kcs-component', id);
						const dragstart = (e) => {
							const newElement = element.cloneNode(true);
							this.#dragElement(e, newElement);
						};
						card.addEventListener('mousedown', dragstart);
						card.addEventListener('touchstart', dragstart);
					}
				}
			}
		}
	}

	#errorLog(message) {
		if (typeof message !== 'string' && message === '') {
			message = this.loc('An error has occured.');
		}
		this.#error = true;
		console.error(`KaneCode Studio -> ${this.loc(message)}`);
	}
	
	#warnLog(message) {
		if (typeof message !== 'string' && message === '') {
			message = this.loc('An error has occured.');
		}
		this.#error = true;
		console.warn(`KaneCode Studio -> ${this.loc(message)}`);
	}

	#componentGroups = {};
	#components = {};
	#config = {
		dragging: false,
		edges: {
			enabled: false,
			increment: { x: null, y: null },
		},
	};
	#document = null;
	#element = null;
	#elements = {};
	#enabled = true;
	#error = false;
	#icons = {
		"angle-down": `<polyline points="20 40 50 70 80 40"/>`,
		"angle-left": `<polyline points="60 20 30 50 60 80"/>`,
		"angle-right": `<polyline points="40 20 70 50 40 80"/>`,
		"angle-up": `<polyline points="60 80 30 50 60 20"/>`,
		"desktop": `<rect x="10" y="18" width="80" height="60" rx="5" ry="5"/><path class="fill" d="M10,66H90v7c0,2.76-2.24,5-5,5H15c-2.76,0-5-2.24-5-5v-7h0Z"/><path class="fill" d="M35,78h30c0,4.42-3.58,8-8,8h-14c-4.42,0-8-3.58-8-8h0Z" transform="translate(100 164) rotate(180)"/>`,
		"eye": `<path d="M10,50s12.5-25,40-25,40,25,40,25c0,0-12.5,25-40,25S10,50,10,50Z"/><circle class="fill" cx="50" cy="50" r="12"/>`,
		"maximize": `<path d="M90,40v-15c0-2.76-2.24-5-5-5h-15"/><path d="M10,40v-15c0-2.76,2.24-5,5-5h15"/><path d="M90,60v15c0,2.76-2.24,5-5,5h-15"/><path d="M10,60v15c0,2.76,2.24,5,5,5h15"/>`,
		"menu-bottom": `<rect x="10" y="20" width="80" height="60" rx="5" ry="5"/><rect class="fill" x="20" y="55" width="60" height="15"/>`,
		"menu-left": `<rect x="10" y="20" width="80" height="60" rx="5" ry="5"/><rect class="fill" x="19.5" y="29.5" width="16" height="5"/><rect class="fill" x="19.5" y="43.5" width="16" height="5"/><line x1="45" y1="20" x2="45" y2="80"/>`,
		"menu-right": `<rect x="10" y="20" width="80" height="60" rx="5" ry="5"/><line x1="55" y1="20" x2="55" y2="80"/><line x1="64.5" y1="29.5" x2="80.5" y2="29.5"/><line x1="64.5" y1="38.5" x2="80.5" y2="38.5"/><line x1="64.5" y1="47.5" x2="80.5" y2="47.5"/>`,
		"minimize": `<path d="M30,80v-15c0-2.76-2.24-5-5-5H10"/><path d="M70,80v-15c0-2.76,2.24-5,5-5h15"/><path d="M30,20v15c0,2.76-2.24,5-5,5H10"/><path d="M70,20v15c0,2.76,2.24,5,5,5h15"/>`,
		"mobile": `<rect x="34" y="22" width="32" height="56" rx="5" ry="5"/><path class="fill" d="M34,22h32v3c0,2.76-2.24,5-5,5h-22c-2.76,0-5-2.24-5-5v-3h0Z" transform="translate(100 52) rotate(180)"/><path class="fill" d="M34,70h32v3c0,2.76-2.24,5-5,5h-22c-2.76,0-5-2.24-5-5v-3h0Z"/>`,
		"redo": `<path d="M75,47.5H30c-2.76,0-5,2.24-5,5v15"/><polyline points="60 62.5 75 47.5 60 32.5"/>`,
		"resize": `<line x1="81" y1="70.5" x2="81" y2="20.5"/><rect x="23" y="20.5" width="45" height="50" rx="5" ry="5"/><line x1="77" y1="20.5" x2="85" y2="20.5"/><line x1="77" y1="70.5" x2="85" y2="70.5"/><line x1="23" y1="83.5" x2="68" y2="83.5"/><line x1="68" y1="79.5" x2="68" y2="87.5"/><line x1="23" y1="79.5" x2="23" y2="87.5"/>`,
		"save": `<line x1="50" y1="25" x2="50" y2="60"/><polyline points="35 45 50 60 65 45"/><path d="M75,60v10c0,2.76-2.24,5-5,5H30c-2.76,0-5-2.24-5-5v-10"/>`,
		"tablet": `<rect x="25" y="18" width="50" height="65" rx="5" ry="5"/><path class="fill" d="M25,75h50v3c0,2.76-2.24,5-5,5H30c-2.76,0-5-2.24-5-5v-3h0Z"/><path class="fill" d="M25,18h50v3c0,2.76-2.24,5-5,5H30c-2.76,0-5-2.24-5-5v-3h0Z" transform="translate(100 44) rotate(180)"/>`,
		"undefined": `<path d="M25.25,25.25a34.81,34.81,0,0,1,15.69-9.06"/><path d="M16.19,59.06a34.79,34.79,0,0,1,0-18.12"/><path d="M40.94,83.81a35,35,0,0,1-15.69-9.06"/><path d="M74.75,74.75a34.81,34.81,0,0,1-15.69,9.06"/><path d="M83.81,40.94a34.79,34.79,0,0,1,0,18.12"/><path d="M59.06,16.19a35,35,0,0,1,15.69,9.06"/><path d="M37.5,42.5A12.5,12.5,0,1,1,54.11,54.31,6,6,0,0,0,50,60h0"/><polyline points="50 69.95 50 70"/>`,
		"undo": `<path d="M25,47.5h45c2.76,0,5,2.24,5,5v15"/><polyline points="40 62.5 25 47.5 40 32.5"/>`,
	};
	#iframe = null;
	#isUndoRedo = false;
	#language = 'es-ES';
	#languages = {
		"es-ES": {
			"Add component": "Añadir componente",
			"Opening": "Abriendo",
			"Preview": "Vista previa",
			"Redo": "Rehacer",
			"Remove component": "Eliminar componente",
			"Save": "Guardar",
			"Saving": "Guardando",
			"Undo": "Deshacer",
			"An error has occured.": "Ha habido un error.",
			"Cannot remove the element because the editor is not enabled or there is an error. Please try again later.": "No se puede eliminar el elemento porque el editor no está habilitado o hay un error. Por favor, inténtelo de nuevo más tarde.",
			"Cannot remove the element because it is not a valid element.": "No se puede eliminar el elemento porque no es un elemento válido.",
			"Cannot remove the element because it is not inside the document.": "No se puede eliminar el elemento porque no está dentro del documento.",
			"Creating KaneCode Studio structure": "Creando la estructura de KaneCode Studio",
			"Loading initial canvas": "Cargando lienzo inicial",
			"The \"element\" parameter in constructor is not an element.": "El parámetro \"element\" en el constructor no es un elemento.",
			"The \"options\" parameter in constructor is not of the expected type. (\"object\")": "El parámetro \"options\" en el constructor no es del tipo esperado. (\"object\")",
			"The page has been saved successfully!": "La página se ha guardado con éxito!",
			"The page has been loaded!": "La página se ha cargado!",
			"There was an error saving.": "Ha habido un error al guardar.",
			"There was an error loading the page.": "Ha habido un error al cargar la página.",
			"This element is not removable.": "Este elemento no se puede eliminar.",
		}
	};
	#menus = {};
	#options = {
		border: true,
		expiration: 3000,
		fullscreen: false,
		header: {
			show: true,
		},
		menus: {
			bottom: {
				show: false,
			},
			left: {
				show: true,
			},
			right: {
				show: true,
			},
		},
		onsave: () => false,
		refresh: 100,
		zone: {
			start: `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta http-equiv="X-UA-Compatible" content="IE=edge">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Document</title>

					<link href="../assets/css/kc-studio.min.css" rel="stylesheet" />
				</head>
				<body>
					`,
			end: `
				</body>
				</html>`,
		}
	};
	#processTimeout = null;
	#redoList = [];
	#refreshInterval = null;
	#selected = null;
	#shortcuts = [{
		win: { key: 'f' },
		mac: { key: 'f' },
		input: false,
		fn: () => { this.fullscreen() },
	}, {
		win: { key: 'b', ctrl: true },
		mac: { key: 'b', meta: true },
		fn: () => { this.toggleMenu('left') },
	}, {
		win: { key: 'd', ctrl: true },
		mac: { key: 'd', meta: true },
		fn: () => { this.duplicate() },
	}, {
		win: { key: 's', ctrl: true },
		mac: { key: 's', meta: true },
		fn: () => { this.save() },
	}, {
		win: { key: 'y', ctrl: true },
		mac: { key: 'y', meta: true },
		fn: () => { this.redo() },
	}, {
		win: { key: 'z', ctrl: true },
		mac: { key: 'z', meta: true },
		fn: (e) => { (e.shiftKey) ? this.redo() : this.undo() },
	}, {
		win: { key: 'Delete' },
		mac: { key: 'Backspace' },
		input: false,
		fn: (e) => { this.remove(this.selected) },
	}, {
		win: { key: 'Escape' },
		mac: { key: 'Escape' },
		input: false,
		fn: (e) => { this.selected = null },
	}];
	#target = null;
	#undoList = [];
	#utils = {
		uuid: (t=8) => crypto.getRandomValues(new Uint8Array(t)).reduce(((t,e)=>t+=(e&=63)<36?e.toString(36):e<62?(e-26).toString(36).toUpperCase():e<63?'_':'-'),''),
	}
}