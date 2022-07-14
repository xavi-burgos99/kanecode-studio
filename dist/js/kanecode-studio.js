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
							<button data-kcs-action="save">${this.icon('ki-duotone ki-download')}</button>
							<div class="separator"></div>
							<button data-kcs-action="undo">${this.icon('ki-solid ki-angle-left')}</button>
							<button data-kcs-action="redo">${this.icon('ki-solid ki-angle-right')}</button>
							<div class="separator"></div>
							<button data-kcs-action="fix-errors">${this.icon('ki-duotone ki-alert')}</button>
							<button data-kcs-action="fix-warnings">${this.icon('ki-duotone ki-alert')}</button>
						</nav>
						<nav>
							<button class="transparent" data-kcs-action="resize" data-kcs-value="desktop">${this.icon('ki-duotone ki-desktop')}</button>
							<button class="transparent" data-kcs-action="resize" data-kcs-value="tablet">${this.icon('ki-duotone ki-tablet')}</button>
							<button class="transparent" data-kcs-action="resize" data-kcs-value="mobile">${this.icon('ki-duotone ki-mobile')}</button>
						</nav>
						<nav class="kanecode-studio-resizes">
							<button data-kcs-action="preview">${this.icon('ki-duotone ki-eye')}</button>
							<button data-kcs-action="fullscreen">
								<span data-kcs-value="maximize">${this.icon('ki-solid ki-maximize-wide')}</span>
								<span data-kcs-value="minimize">${this.icon('ki-solid ki-minimize-wide')}</span>
							</button>
							<div class="separator"></div>
							<button data-kcs-action="tree" disabled>${this.icon('ki-duotone ki-list-tree')}</button>
							<button data-kcs-action="menu-bottom">${this.icon('ki-duotone ki-menu-bottom')}</button>
							<button data-kcs-action="menu-right">${this.icon('ki-duotone ki-menu-right')}</button>
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
						<div class="kanecode-studio-menu-right">
							<div class="kanecode-studio-inspector"></div>
							<div class="kanecode-studio-tree-view"></div>
						</div>
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
					fixErrors: [...base.querySelectorAll('[data-kcs-action="fix-errors"]')],
					fixWarnings: [...base.querySelectorAll('[data-kcs-action="fix-warnings"]')],
					fullscreen: [...base.querySelectorAll('[data-kcs-action="fullscreen"]')],
					menuBottom: [...base.querySelectorAll('[data-kcs-action="menu-bottom"]')],
					menuLeft: [...base.querySelectorAll('[data-kcs-action="menu-left"]')],
					menuRight: [...base.querySelectorAll('[data-kcs-action="menu-right"]')],
					redo: [...base.querySelectorAll('[data-kcs-action="redo"]')],
					resize: [...base.querySelectorAll('[data-kcs-action="resize"]')],
					save: [...base.querySelectorAll('[data-kcs-action="save"]')],
					undo: [...base.querySelectorAll('[data-kcs-action="undo"]')],
					tree: [...base.querySelectorAll('[data-kcs-action="tree"]')],
					//CODE
				},
				menus: {
					bottom: base.querySelector('.kanecode-studio-menu-bottom'),
					left: base.querySelector('.kanecode-studio-menu-left'),
					right: base.querySelector('.kanecode-studio-menu-right'),
				},
				panels: {
					inspector: base.querySelector('.kanecode-studio-inspector'),
					tree: base.querySelector('.kanecode-studio-tree-view'),
				}
			};
			this.#inspector = new KCStudioInspector(this, this.#elements.panels.inspector);
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
			this.#elements.buttons.fixErrors.forEach(button => {
				button.hidden = true;
				button.addEventListener('click', () => {
					this.#process('Fixing errors', { spinner: true, disable: true });
					setTimeout(() => {
						this.#error = false;
						this.#elements.buttons.fixErrors.forEach(button => {
							button.hidden = true;
						});
						this.warnLog('The errors have been fixed, but it is possible that the functionality is not working properly.');
						this.#process(null);
					}, 500);
				});
			});
			this.#elements.buttons.fixWarnings.forEach(button => {
				button.hidden = true;
				button.addEventListener('click', () => {
					this.#process('Hiding warnings', { spinner: true, disable: true });
					setTimeout(() => {
						this.#elements.buttons.fixWarnings.forEach(button => {
							button.hidden = true;
						});
						this.#process('The warnings have been hidden', { spinner: false, disable: false, time: 2000 });
					}, 500);
				});
			});
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
			this.#elements.buttons.tree.forEach(button => {
				button.addEventListener('click', () => { this.treePanel() });
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
			this.loadInspector();

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
						inspector: {},
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
					if (typeof component.inspector === 'object') {
						if (typeof component.inspector.menu === 'object') {
							for (let k in component.inspector.menu) {
								const menu = component.inspector.menu[k];
								if (typeof this.loc(menu?.label) === 'string' && (typeof menu.order === 'number' || typeof menu.order === 'undefined')) {
									this.#components[id].inspector.menu = this.#components[id].inspector.menu;
								}
							}
						}
						if (typeof component.inspector.sections === 'object') {
							for (let k in component.inspector.sections) {
								const section = component.inspector.sections[k];
								if (typeof this.loc(section?.label) === 'string' && (typeof section.menu === 'string' || typeof section.menu === 'number') && (typeof section?.order === 'number' || typeof section?.order === 'undefined')) {
									this.#components[id].inspector.sections = this.#components[id].inspector.sections;
								}
							}
						}
						if (typeof component.inspector.inputs === 'object') {
							for (let k in component.inspector.inputs) {
								const input = component.inspector.inputs[k];
								if (typeof this.loc(input?.label) === 'string' && typeof input.type === 'string' && (typeof input.section === 'string' || typeof input.section === 'number') && (typeof input?.order === 'number' || typeof input?.order === 'undefined')) {
									this.#components[id].inspector.inputs = this.#components[id].inspector.inputs;
								}
							}
						}
						if (Array.isArray(component.inspector.include)) {
							this.#components[id].inspector.include = component.inspector.include.filter(v => typeof v === 'string');
						}
						if (Array.isArray(component.inspector.exclude)) {
							this.#components[id].inspector.exclude = component.inspector.exclude.filter(v => typeof v === 'string');
						}
					}
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
						if (typeof component.options.removable === 'boolean')
							this.#components[id].options.removable = component.options.removable;
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
				if (menu === 'right') {
					this.#elements.buttons.tree.forEach(button => {
						button.setAttribute('disabled', '');
					});
				}
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

					let sheetElement = this.document.body.querySelector('[data-kcs-styles]');
					if (sheetElement === null || sheetElement?.tagName !== 'STYLE') {
						if (typeof sheetElement?.remove === 'function')
							sheetElement.remove();
						sheetElement = this.document.createElement('style');
						sheetElement.setAttribute('data-kcs-styles', '');
						this.document.body.prepend(sheetElement);
					}
					this.#styles.element = sheetElement;
					this.#styles.sheet = sheetElement.sheet;
					this.#css.update = () => { this.#styles.element.innerHTML = this.utils.sheetToString(this.#styles.sheet); };
					this.#css.get = (selector, attribute) => this.utils.getStyle(this.#styles.sheet, selector, attribute);
					this.#css.remove = (selector, attribute) => {
						const res = this.utils.removeStyle(this.#styles.sheet, selector, attribute);
						if (res) this.#css.update();
						return res;
					};
					this.#css.set = (selector, attribute, value, priority) => {
						if (value === null)
							return this.css.remove(selector, attribute);
						const res = this.utils.addStyle(this.#styles.sheet, this.#styles.element, selector, attribute, value, priority);
						if (res) this.css.update();
						return res;
					};

					this.enable();
					
					this.loadComponents(KCStudioComponents);
				};
				this.#iframe.srcdoc = this.#options.zone.start + content + this.#options.zone.end;
			} else if (typeof content === 'function') {
				this.#process('Opening', { spinner: true });
				const opened = (content) => {
					this.enable();
					this.open(content);
					this.#elements.buttons.save.forEach(button => {
						button.setAttribute('disabled', '');
					});
					this.#process('The page has been loaded!', { disable: false, time: 1000 });
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

	loadInspector() {
		if (this.#error || !this.#enabled) {
			this.#errorLog('Cannot load inspector because the editor is not enabled or there is an error. Please try again later.');
			return false;
		}
		if (this.#selected === null) {
			this.#inspector.message = this.loc('<p>There is no component selected.</p><p>To select a component, click on any element in the editor canvas.</p>');
			return true;
		}
		if (!this.#document?.contains(this.#selected)) {
			this.#errorLog('Cannot load inspector because the selected element is not a valid element.');
			return false;
		}
		if (this.#getComponentType(this.#selected) === null) {
			this.#inspector.message = this.loc('<p>The selected element is not a valid component.</p><p>Maybe the component selected is outdated and not compatible with the current version of the editor. Try to update it manually.</p>');
			return false;
		}

		const componentType = this.#getComponentType(this.#selected);
		const component = this.#components[componentType];

		const menus = component.inspector.menus;
		const sections = component.inspector.sections;
		const inputs = component.inspector.inputs;
		const include = (Array.isArray(component.inspector.include)) ? component.inspector.include : ['default'];
		const exclude = (Array.isArray(component.inspector.exclude)) ? component.inspector.exclude : [];
				
		this.#inspector.load(menus, sections, inputs, include, exclude);
		
		return true;
	}

	remove(element) {
		if (this.#error || !this.#enabled) {
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
		if (!this.#getComponentType(element)) {
			this.#errorLog('Cannot remove the element because it is not a valid component.');
			return false;
		}
		if (this.#components[this.#getComponentType(element)].options.removable === false) {
			this.#warnLog('Cannot remove the element because this component does not allow it.');
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
				if (menu === 'right') {
					this.#elements.buttons.tree.forEach(button => {
						button.removeAttribute('disabled');
					});
				}
			}
		}
	}

	test() {
		this.#action(() => { this.test() }, () => { this.test() }, 'Test action');
	}

	toggleMenu(menu) {
		if (!this.#error && this.#enabled) {
			if (['bottom', 'left', 'right'].includes(menu)) {
				if (this.#element.classList.contains(`show-menu-${menu}`))
					this.hideMenu(menu);
				else
					this.showMenu(menu);
			}
		}
	}

	treePanel() {
		if (this.#error || !this.#enabled) {
			this.#errorLog('Cannot show the tree view panel because the editor is not enabled or there is an error. Please try again later.');
			return false;
		}
		this.#element.classList.toggle(`show-tree-panel`);
		return true;
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

	get css() { return this.#css }
	get element() { return this.#element; }
	set selected(element) {
		if (!this.#error && this.#enabled) {
			if (this.#document.body.contains(element) || this.#document.body == element) {
				this.#selected = this.#getStudioElement(element);
				const label = document.querySelector('.kanecode-studio-frame-selected-tools').children[0];
				label.innerText = this.#components[this.#getComponentType(this.#selected)].title;
				let uid = this.utils.uuid();
				if (this.#selected.hasAttribute('data-kcs-id'))
					uid = this.#selected.getAttribute('data-kcs-id');
				this.selected.uid = uid;
			} else
				this.#selected = null;
			this.refresh();
			this.loadInspector();
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
	get document() {
		return this.#document;
	}
	get iframe() {
		return this.#iframe;
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
			if (_options.time) {
				if (this.#processTimeout)
					clearTimeout(this.#processTimeout);
				this.#processTimeout = setTimeout(() => {
					this.#process(null);
				}, _options.time);
			}
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
							const dropdown = document.createElement('div');
							dropdown.className = 'kanecode-studio-components-list-button';
							dropdown.innerHTML= `<div class="kcs-dropdown-title">${this.#componentGroups[component.group].title}</div><div class="kcs-dropdown-arrow">${this.icon('ki-solid ki-angle-down')}</div>`;
							const menu = document.createElement('div');
							menu.className = 'kcs-dropdown-menu';
							grid = document.createElement('div');
							grid.className = 'kanecode-studio-components-list-grid';
							grid.setAttribute('data-kcs-group', component.group);
							menu.append(grid);
							list.append(dropdown);
							list.append(menu);
							dropdown.addEventListener('click', () => {
								dropdown.classList.toggle('active');
							});
							if (list.children[0] == dropdown)
								dropdown.classList.add('active');
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
		if (typeof this.#elements?.buttons === 'object') {
			if (Array.isArray(this.#elements.buttons.fixErrors)) {
				this.#elements.buttons.fixErrors.forEach((element) => {
					element.removeAttribute('hidden');
				});
			}
		}
	}
	errorLog(message) {
		this.#errorLog(message);
	}
	
	#warnLog(message) {
		if (typeof message !== 'string' && message === '') {
			message = this.loc('An error has occured.');
		}
		console.warn(`KaneCode Studio -> ${this.loc(message)}`);
		if (typeof this.#elements?.buttons === 'object') {
			if (Array.isArray(this.#elements.buttons.fixWarnings)) {
				this.#elements.buttons.fixWarnings.forEach((element) => {
					element.removeAttribute('hidden');
				});
			}
		}
	}
	warnLog(message) {
		this.#warnLog(message);
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
	#css = {};
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
	#inspector = null;
	#isUndoRedo = false;
	#language = 'es-ES';
	#languages = {
		"es-ES": {
			"Add component": "Añadir componente",
			"Advanced": "Avanzado",
			"Content": "Contenido",
			"Hide element": "Ocultar elemento",
			"General": "General",
			"Height": "Alto",
			"Margin": "Margen",
			"Maximum height": "Altura máxima",
			"Maximum width": "Anchura máxima",
			"Minimum height": "Altura mínima",
			"Minimum width": "Anchura mínima",
			"Opening": "Abriendo",
			"Padding": "Relleno",
			"Preview": "Vista previa",
			"Redo": "Rehacer",
			"Remove component": "Eliminar componente",
			"Save": "Guardar",
			"Saving": "Guardando",
			"Size": "Tamaño",
			"Style": "Estilo",
			"Transformation": "Transformación",
			"Undo": "Deshacer",
			"Width": "Ancho",
			"An error has occured.": "Ha habido un error.",
			"Cannot load inspector because the editor is not enabled or there is an error. Please try again later.": "No se puede cargar el inspector porque el editor no está habilitado o hay un error. Por favor, inténtelo de nuevo más tarde.",
			"Cannot load inspector because the selected element is not a valid element.": "No se puede cargar el inspector porque el elemento seleccionado no es un elemento válido.",
			"Cannot remove the element because it is not a valid component.": "No se puede eliminar el elemento porque no es un componente válido.",
			"Cannot remove the element because it is not a valid element.": "No se puede eliminar el elemento porque no es un elemento válido.",
			"Cannot remove the element because it is not inside the document.": "No se puede eliminar el elemento porque no está dentro del documento.",
			"Cannot remove the element because the editor is not enabled or there is an error. Please try again later.": "No se puede eliminar el elemento porque el editor no está habilitado o hay un error. Por favor, inténtelo de nuevo más tarde.",
			"Cannot remove the element because this component does not allow it.": "No se puede eliminar el elemento porque este componente no lo permite.",
			"Cannot show the tree view panel because the editor is not enabled or there is an error. Please try again later.": "No se puede mostrar el panel de vista de árbol porque el editor no está habilitado o hay un error. Por favor, inténtelo de nuevo más tarde.",
			"Creating KaneCode Studio structure": "Creando la estructura de KaneCode Studio",
			"Loading initial canvas": "Cargando lienzo inicial",
			"The \"element\" parameter in constructor is not an element.": "El parámetro \"element\" en el constructor no es un elemento.",
			"The \"options\" parameter in constructor is not of the expected type. (\"object\")": "El parámetro \"options\" en el constructor no es del tipo esperado. (\"object\")",
			"The page has been saved successfully!": "La página se ha guardado con éxito!",
			"The page has been loaded!": "La página se ha cargado!",
			"There was an error saving.": "Ha habido un error al guardar.",
			"There was an error loading the page.": "Ha habido un error al cargar la página.",
			"This element is not removable.": "Este elemento no se puede eliminar.",
			"<p>The selected element is not a valid component.</p><p>Maybe the component selected is outdated and not compatible with the current version of the editor. Try to update it manually.</p>": "<p>El elemento seleccionado no es un componente válido.</p><p>Tal vez el componente seleccionado está obsoleto y no es compatible con la versión actual del editor. Intente actualizarlo manualmente.</p>",
			"<p>There is no component selected.</p><p>To select a component, click on any element in the editor canvas.</p>": "<p>No hay ningún componente seleccionado.</p><p>Para seleccionar un componente, haga clic en cualquier elemento en el lienzo del editor.</p>",
		}
	};
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
	#styles = {};
	#target = null;
	#undoList = [];
	#utils = {
		uuid: (t=8) => crypto.getRandomValues(new Uint8Array(t)).reduce(((t,e)=>t+=(e&=63)<36?e.toString(36):e<62?(e-26).toString(36).toUpperCase():e<63?'_':'-'),''),
		sheetToString: (sheet) => sheet.cssRules ? Array.from(sheet.cssRules).map(rule => (rule.cssText || '')).join('\n') : '',
		addStyle: (sheet, sheetElement, selector, attribute, value, priority) => {
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
					response = true;
					return true;
				}
			});
			return response;
		},
		getStyle: (sheet, selector, attribute) => {
			let value = null;
			[].some.call(sheet.rules, (rule) => {
				if (selector === rule.selectorText)
					return [].some.call(rule.style, (style) => {
						if (attribute === style)
							value = rule.style.getPropertyValue(attribute);
					});
			});
			return value;
		},
		removeStyle: (sheet, selector, attribute) => {
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
		},
	}
}

class KCStudioInspector {
	constructor(studio, element) {
		this.#studio = studio;
		this.#element = element;
	}
	addSection(id, title, menu) {
		if (typeof menu !== 'string' && typeof menu !== 'number') {
			this.#studio.errorLog('The "menu" parameter in addSection is not of the expected type. ("string" or "number")');
			return false;
		}
		if (typeof title !== 'string') {
			this.#studio.errorLog('The "title" parameter in addSection is not of the expected type. ("string")');
			return false;
		}
		if (typeof id !== 'string' && typeof id !== 'number') {
			this.#studio.errorLog('The "id" parameter in addSection is not of the expected type. ("string" or "number")');
			return false;
		}
		return false;
	}
	clear() {
		this.#element.innerHTML = '';
		this.#menus = {};
		this.#sections = {};
		this.#inputs = {};
	}
	load(menus = {}, sections = {}, inputs = {}, include = ['default'], exclude = []) {
		if (!Array.isArray(include)) {
			this.#studio.errorLog('The "include" parameter in load is not of the expected type. ("array")');
			return false;
		}
		if (!Array.isArray(exclude)) {
			this.#studio.errorLog('The "exclude" parameter in load is not of the expected type. ("array")');
			return false;
		}
		include.forEach((incl) => {
			if (typeof incl !== 'string') {
				this.#studio.errorLog('The "include" parameter in load is not of the expected type. ("string" array)');
				return false;
			}
		});
		exclude.forEach((excl) => {
			if (typeof excl !== 'string') {
				this.#studio.errorLog('The "exclude" parameter in load is not of the expected type. ("string" array)');
				return false;
			}
		});
		const recursiveIncludeExclude = (include, exclude) => {
			include.forEach((incl) => {
				if (!(incl in this.#includes.templates) || incl in exclude)
					include.splice(include.indexOf(incl), 1);
				if (include.indexOf(incl) !== -1) {
					let updates = false;
					if (Array.isArray(this.#includes.templates[incl].include)) {
						this.#includes.templates[incl].include.forEach((_incl) => {
							if (!include.includes(_incl) && !exclude.includes(_incl)) {
								include.push(_incl);
								updates = true;
							}
						});
					}
					if (Array.isArray(this.#includes.templates[incl].exclude)) {
						this.#includes.templates[incl].exclude.forEach((_excl) => {
							if (!exclude.includes(_excl)) {
								exclude.push(_excl);
								updates = true;
							}
						});
					}
					if (updates) {
						const recursive = recursiveIncludeExclude(include, exclude);
						include = recursive.include;
						exclude = recursive.exclude;
					}
				}
			});
			return { include, exclude };
		}
		const recursive = recursiveIncludeExclude(include, exclude);
		include = recursive.include;
		exclude = recursive.exclude;

		const checkMenu = (_menu) => {
			if (typeof _menu !== 'object')
				return false;
			if (typeof this.studio.loc(_menu.label) !== 'string')
				return false;
			const menu = {};
			menu.label = this.studio.loc(_menu.label);
			menu.options = {};
			menu.options.order = (typeof _menu.order === 'number') ? _menu.order : 9999;
			return menu;
		};
		const checkSection = (_section) => {
			if (typeof _section !== 'object')
				return false;
			if (typeof this.studio.loc(_section.label) !== 'string')
				return false;
			if (typeof _section.menu !== 'string' && typeof _section.menu !== 'number')
				return false;
			const section = {};
			section.label = this.studio.loc(_section.label);
			section.menu = _section.menu;
			section.options = {};
			section.options.order = (typeof _section.order === 'number') ? _section.order : 9999;
			section.options.open = (typeof _section.open === 'boolean') ? _section.open : false;
			return section;
		};
		const checkInput = (_input) => {
			if (typeof _input !== 'object')
				return false;
			if (typeof this.studio.loc(_input.label) !== 'string' && typeof _input.label !== 'undefined')
				return false;
			if (typeof _input.type !== 'string')
				return false;
			if (typeof _input.section !== 'string' && typeof _input.section !== 'number')
				return false;
			const input = {};
			input.label = (typeof _input.label === 'undefined') ? null : this.studio.loc(_input.label);
			input.type = _input.type;
			input.section = _input.section;
			input.options = {};
			input.options.order = (typeof _input.order === 'number') ? _input.order : 9999;
			if (typeof _input.hide === 'boolean' || typeof _input.hide === 'function')
				input.options.hide = _input.hide;
			if (typeof _input.onChange === 'function')
				input.options.onChange = _input.onChange;
			if (typeof _input.value !== 'undefined')
				input.options.value = _input.value;
			return input;
		};

		this.clear();
		include.forEach((incl) => {
			if (incl in this.#includes.templates) {
				if (Array.isArray(this.#includes.templates[incl].menus)) {
					this.#includes.templates[incl].menus.forEach((k) => {
						if (k in this.#includes.menus && !(k in this.#menus)) {
							const menu = checkMenu(this.#includes.menus[k]);
							if (menu) this.#menus[k] = menu; else console.error(`${k} menu is invalid`);
						}
					});
				}
				if (Array.isArray(this.#includes.templates[incl].sections)) {
					this.#includes.templates[incl].sections.forEach((k) => {
						if (k in this.#includes.sections && !(k in this.#sections)) {
							const section = checkSection(this.#includes.sections[k]);
							if (section) this.#sections[k] = section; else console.error(`${k} section is invalid`);
						}
					});
				}
				if (Array.isArray(this.#includes.templates[incl].inputs)) {
					this.#includes.templates[incl].inputs.forEach((k) => {
						if (k in this.#includes.inputs && !(k in this.#inputs)) {
							const input = checkInput(this.#includes.inputs[k]);
							if (input) this.#inputs[k] = input; else console.error(`${k} input is invalid`);
						}
					});
				}
			}
		});
		
		const completeMenu = (_menu, id) => {
			if (typeof _menu !== 'object')
				return false;
			if (typeof this.studio.loc(_menu.label) !== 'string')
				this.#menus[id].label = _menu.label;
			if (typeof _menu.order === 'number')
				this.#menus[id].options.order = _menu.order;
			if (typeof _menu.open === 'boolean')
				this.#menus[id].options.open = _menu.open;
			return true;
		}
		const completeSection = (_section, id) => {
			if (typeof _section !== 'object')
				return false;
			if (typeof this.studio.loc(_section.label) !== 'string')
				this.#sections[id].label = _section.label;
			if (typeof _section.menu === 'string' || typeof _section.menu === 'number')
				this.#sections[id].menu = _section.menu;
			if (typeof _section.order === 'number')
				this.#sections[id].options.order = _section.order;
			if (typeof _section.open === 'boolean')
				this.#sections[id].options.open = _section.open;
			return true;
		}
		const completeInput = (_input, id) => {
			if (typeof _input !== 'object')
				return false;
			if (typeof this.studio.loc(_input.label) !== 'string' && typeof _input.label !== 'undefined')
				this.#inputs[id].label = _input.label;
			if (typeof _input.type !== 'string')
				this.#inputs[id].type = _input.type;
			if (typeof _input.section === 'string' || typeof _input.section === 'number')
				this.#inputs[id].section = _input.section;
			if (typeof _input.order === 'number')
				this.#inputs[id].options.order = _input.order;
			if (typeof _input.hide === 'boolean' || typeof _input.hide === 'function')
				this.#inputs[id].options.hide = _input.hide;
			if (typeof _input.onChange === 'function')
				this.#inputs[id].options.onChange = _input.onChange;
			if (typeof _input.value !== 'undefined')
				this.#inputs[id].options.value = _input.value;
			return true;
		}

		if (typeof menus === 'object') {
			for (let k in menus) {
				if (k in this.#menus) {
					completeMenu(menus[k], k);
				} else {
					const menu = checkMenu(menus[k]);
					if (menu) this.#menus[k] = menu;
					else console.error(`${k} menu is invalid`);
				}
			}
		}
		if (typeof sections === 'object') {
			for (let k in sections) {
				if (k in this.#sections) {
					completeSection(sections[k], k);
				} else {
					const section = checkSection(sections[k]);
					if (section) this.#sections[k] = section;
					else console.error(`${k} section is invalid`);
				}
			}
		}
		if (typeof inputs === 'object') {
			for (let k in inputs) {
				if (k in this.#inputs) {
					completeInput(inputs[k], k);
				} else {
					const input = checkInput(inputs[k]);
					if (input) this.#inputs[k] = input;
					else console.error(`${k} input is invalid`);
				}
			}
		}

		this.render();
	}

	render() {
		this.#element.innerHTML = `
			<div class="kanecode-studio-inspector-menu-selector"></div>
			<div class="kanecode-studio-inspector-menus"></div>`;

		const menus = Object.keys(this.#menus).map((k) => {
			const menu = this.#menus[k];
			menu.id = k;
			return menu;
		}).sort((a, b) => a.order - b.order );

		menus.forEach((menu) => {
			const menuButton = document.createElement('div');
			menuButton.classList.add('kanecode-studio-inspector-menu-button');
			menuButton.setAttribute('data-kcs-inspector-menu', menu.id);
			menuButton.innerHTML = `<span>${menu.label}</span>`;
			this.#element.children[0].append(menuButton);

			const menuSection = document.createElement('section');
			menuSection.classList.add('kanecode-studio-inspector-menu-section');
			menuSection.setAttribute('data-kcs-inspector-menu', menu.id);
			this.#element.children[1].append(menuSection);

			menuButton.addEventListener('click', (e) => {
				e.preventDefault();
				[...this.#element.children[0].children].forEach(e => e.classList.remove('active'));
				menuButton.classList.add('active');
				[...this.#element.children[1].children].forEach(e => e.classList.remove('active'));
				menuSection.classList.add('active');
			});
		});
		if (menus.length > 0) this.#element.children[0].children[0].click();

		const sections = Object.keys(this.#sections).map((k) => {
			const section = this.#sections[k];
			section.id = k;
			return section;
		}).sort((a, b) => {
			if (a.menu === b.menu) return a.order - b.order;
			return a.menu - b.menu;
		});

		sections.forEach((section) => {
			const sectionButton = document.createElement('div');
			sectionButton.classList.add('kanecode-studio-inspector-section-button');
			sectionButton.setAttribute('data-kcs-inspector-section', section.id);
			sectionButton.hidden = true;
			sectionButton.innerHTML = `
				<div class="kcs-dropdown-title">${section.label}</div>
				<div class="kcs-dropdown-arrow"><i class="ki-solid ki-angle-down"></i></div>`;
			const menuIndex = [...this.#element.children[1].children].findIndex(menu => menu.getAttribute('data-kcs-inspector-menu') === section.menu);
			this.#element.children[1].children[menuIndex].append(sectionButton);

			const sectionContent = document.createElement('div');
			sectionContent.classList.add('kcs-dropdown-menu');
			sectionContent.setAttribute('data-kcs-inspector-section', section.id);
			this.#element.children[1].children[menuIndex].append(sectionContent);

			sectionButton.addEventListener('click', (e) => {
				e.preventDefault();
				sectionButton.classList.toggle('active');
			});

			if (section.options.open) sectionButton.click();
		});

		const inputs = Object.keys(this.#inputs).map((k) => {
			const input = this.#inputs[k];
			input.id = k;
			return input;
		}).sort((a, b) => {
			if (a.section === b.section) return a.order - b.order;
			return a.section - b.section;
		});

		const inputsArray = [];
		let inputsFailed = 0;
		inputs.forEach((input) => {
			if (input.type in KCStudioInputs) {
				input = new KCStudioInputs[input.type](this.#studio, input.id, input.label, input.type, input.section, input.options);
				inputsArray.push(input);
				try {
				} catch {
					inputsFailed++;
				}
			} else {
				inputsFailed++;
			}
		});
		if (inputsFailed == 1)
			this.studio.warnLog('An input cannot be created because an error occurred.');		//TRANSLATE
		else if (inputsFailed > 1)
			this.studio.warnLog(`Multiple inputs cannot be created because an error occurred.`);		//TRANSLATE

		inputsArray.forEach((input) => {
			if (input.section in this.#sections) {
				const sectionButton = this.element.children[1].querySelector(`.kanecode-studio-inspector-section-button[data-kcs-inspector-section="${input.section}"]`);
				const section = sectionButton.nextElementSibling;
				sectionButton.hidden = false;
				section.append(input.element);
			}
			input.refresh();
		});
	}

	get loc() {
		return this.studio.loc;
	}
	set message(message) {
		this.clear();
		this.#element.innerHTML = `<div class="kanecode-studio-inspector-message">${message}</div>`;
	}
	get message() {
		const message = this.#element.querySelector('.kanecode-studio-inspector-message');
		if (message) {
			return message.textContent;
		}
		return undefined;
	}
	get studio() { return this.#studio; }
	get element() { return this.#element; }

	#element = null;
	#inputs = {};
	#sections = {};
	#menus = {};
	#studio = null;
	#includes = {
		templates: {
			"default": {
				include: ["content", "style", "advanced"],
			},
			"content": {
				menus: ["content"],
				sections: ["general", "transformation"],
				inputs: ["hide", "size", "margin", "padding"],
			},
			"style": {
				menus: ["style"],
				sections: ["color", "border", "shadow", "typography"],
				inputs: ["color", "border-color", "border-width", "border-style", "border-radius", "box-shadow", "typography"],
				include: ["background"],
			},
			"advanced": {
				menus: ["advanced"],
				sections: ["html-attributes", "plugins"],
				inputs: ["id", "class", "data-attributes", "style"],
			},
			"background": {
				menus: ["style"],
				sections: ["background"],
				inputs: ["background-type", "background-color", "background-image", "background-gradient"],
			},
		},
		menus: {
			"content": {
				label: "Content",
				order: 10,
			},
			"style": {
				label: "Style",
				order: 20,
			},
			"advanced": {
				label: "Advanced",
				order: 30,
			},
		},
		sections: {
			"general": {
				label: 'General',
				order: 10,
				open: true,
				menu: "content",
			},
			"transformation": {
				label: 'Transformation',
				order: 20,
				open: true,
				menu: "content",
			},
			"color": {
				label: 'Color',
				order: 10,
				open: true,
				menu: "style",
			},
			"background": {
				label: 'Background',
				order: 20,
				open: true,
				menu: "style",
			},
			"border": {
				label: 'Border',
				order: 30,
				open: false,
				menu: "style",
			},
			"shadow": {
				label: 'Shadow',
				order: 40,
				open: false,
				menu: "style",
			},
			"typography": {
				label: 'Typography',
				order: 50,
				open: false,
				menu: "style",
			},
			"html-attributes": {
				label: 'HTML Attributes',
				order: 10,
				open: true,
				menu: "advanced",
			},
			"plugins": {
				label: 'Plugins',
				order: 20,
				open: false,
				menu: "advanced",
			},
		},
		inputs: {
			"hide": {
				label: "Hide element",
				type: "switch",
				order: 10,
				section: "general",
				value: (studio) => {
					if (studio.selected.hasAttribute('data-kcs-component-hide'))
						if (studio.selected.getAttribute('data-kcs-component-hide') === 'true')
							return true;
					return false;
				},
				onChange: (studio, value) => {
					if (value)
						studio.selected.setAttribute('data-kcs-component-hide', 'true');
					else
						studio.selected.removeAttribute('data-kcs-component-hide');
				},
			},
			"size": {
				label: "Size",
				type: "width-height",
				order: 10,
				section: "transformation",
				value: (studio) => {
					return {
						width: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'width'),
						height: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'height'),
						minWidth: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'min-width'),
						minHeight: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'min-height'),
						maxWidth: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'max-width'),
						maxHeight: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'max-height'),
					};
				},
				onChange: (studio, value) => {
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'width', value.width);
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'height', value.height);
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'min-width', value.minWidth);
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'min-height', value.minHeight);
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'max-width', value.maxWidth);
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'max-height', value.maxHeight);
				},
			},
			"margin": {
				label: "Margin",
				type: "margin-padding",
				order: 20,
				section: "transformation",
				value: (studio) => {
					return {
						top: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'margin-top'),
						right: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'margin-right'),
						bottom: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'margin-bottom'),
						left: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'margin-left'),
					};
				},
				onChange: (studio, value) => {
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'margin-top', value.top);
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'margin-right', value.right);
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'margin-bottom', value.bottom);
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'margin-left', value.left);
				},
			},
			"padding": {
				label: "Padding",
				type: "margin-padding",
				order: 30,
				section: "transformation",
				value: (studio) => {
					return {
						top: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'padding-top'),
						right: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'padding-right'),
						bottom: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'padding-bottom'),
						left: studio.css.get(`[data-kcs-id="${studio.selected.uid}"]`, 'padding-left'),
					};
				},
				onChange: (studio, value) => {
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'padding-top', value.top);
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'padding-right', value.right);
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'padding-bottom', value.bottom);
					studio.css.set(`[data-kcs-id="${studio.selected.uid}"]`, 'padding-left', value.left);
				},
			},
			"color": {
				type: "color",
				order: 10,
				section: "color",
				value: (studio) => studio.utils.getCSS(`[data-kcs-id="${studio.selected.uid}"]`, 'color'),
				onChange: (studio, value) => {
					studio.utils.setCSS(`[data-kcs-id="${studio.selected.uid}"]`, 'color', value);
				},
			},
			"background-type": {
				type: "segmented",
				order: 20,
				section: "background",
				options: [{
					label: "Color",
					value: "color",
				}, {
					label: "Image",
					value: "image",
				}, {
					label: "Gradient",
					value: "gradient",
				}],
				value: (studio) => {
					const value = studio.utils.getCSS(`[data-kcs-id="${studio.selected.uid}"]`, 'background');
					if (value.startsWith('linear-gradient'))
						return 'gradient';
					if (value.startsWith('url'))
						return 'image';
					return 'color';
				},
				onChange: (studio, value) => {
					switch (value) {
						case 'color':
							studio.inspector.inputs['background-color'].show();
							studio.inspector.inputs['background-image'].hide();
							studio.inspector.inputs['background-gradient'].hide();
							break;
						case 'image':
							studio.inspector.inputs['background-color'].hide();
							studio.inspector.inputs['background-image'].show();
							studio.inspector.inputs['background-gradient'].hide();
							break;
						case 'gradient':
							studio.inspector.inputs['background-color'].hide();
							studio.inspector.inputs['background-image'].hide();
							studio.inspector.inputs['background-gradient'].show();
							break;
					}
				},
			},
			"background-color": {
				type: "color",
				order: 21,
				section: "background",
				value: (studio) => {
					const value = studio.utils.getCSS(`[data-kcs-id="${studio.selected.uid}"]`, 'background');
					if (value.startsWith('linear-gradient'))
						return studio.inspector.inputs['background-gradient'].value.colors[0];
					if (value.startsWith('url'))
						return '#fff';
					return value;
				},
				onChange: (studio, value) => {
					studio.inspector.inputs['background-image'].value = '';
					studio.inspector.inputs['background-gradient'].value = { deg: 0, colors: [value, value] };
					studio.utils.setCSS(`[data-kcs-id="${studio.selected.uid}"]`, 'background', value);
				},
				hide: (studio) => studio.inspector.inputs['background-type'].value !== 'color',
			},
			"background-image": {
				type: "image",
				order: 21,
				section: "background",
				value: (studio) => {
					const value = studio.utils.getCSS(`[data-kcs-id="${studio.selected.uid}"]`, 'background');
					if (value.startsWith('url'))
						return value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
					return '';
				},
				onChange: (studio, value) => {
					studio.inspector.inputs['background-color'].value = '#fff';
					studio.inspector.inputs['background-gradient'].value = { deg: 0, colors: ['#fff', '#eee'] };
					studio.utils.setCSS(`[data-kcs-id="${studio.selected.uid}"]`, 'background', `url(${value})`);
				},
				hide: (studio) => studio.inspector.inputs['background-type'].value !== 'image',
			},
			"background-gradient": {
				type: "gradient",
				order: 21,
				section: "background",
				value: (studio) => {
					const value = studio.utils.getCSS(`[data-kcs-id="${studio.selected.uid}"]`, 'background');
					if (value.startsWith('linear-gradient'))
						return studio.utils.parseGradient(value);
					if (value.startsWith('url') || value === null)
						return { deg: 0, colors: ['#fff', '#eee'] };
					return { deg: 0, colors: [value, value] };
				},
				onChange: (studio, value) => {
					studio.inspector.inputs['background-color'].value = value.colors[0];
					studio.inspector.inputs['background-image'].value = '';
					studio.utils.setCSS(`[data-kcs-id="${studio.selected.uid}"]`, 'background', studio.utils.stringifyGradient(value));
				},
				hide: (studio) => studio.inspector.inputs['background-type'].value !== 'gradient',
			},
			"border-type": {
				type: "select",
			},
		}
	};
}

class KCStudioInput {
	constructor(studio, id, label, type, section, options = {}) {
		this.#studio = studio;
		this.#id = id;
		this.#label = label;
		this.#type = type;
		this.#section = section;
		this.#options = options;
		this.options.order = this.options.order || 9999;

		this.#element = document.createElement('div');
		this.element.classList.add('kanecode-studio-inspector-input');
		this.element.setAttribute('data-kcs-input-id', id);
		this.element.setAttribute('data-kcs-input-type', type);

		this.#body = document.createElement('div');
		this.body.classList.add('kanecode-studio-inspector-input-body');
		this.element.append(this.body);

		this.generator();
	}

	generator( options = { label: true }) {
		if (typeof this.label === 'string' && options?.label === true) {
			const labelElement = document.createElement('div');
			labelElement.classList.add('kanecode-studio-inspector-input-label');
			labelElement.innerText = this.label;
			this.element.prepend(labelElement);
		}
		return true;

		// Use this structure:
		super.generator();
		this.body.innerHTML = '<input type="text" />';
		this.addTrigger(this.body.children[0], 'input');
	}

	inputToValue() {
		this.studio.warnLog(`${this.label} inputToValue is not implemented`);
		return false;

		// Use this structure:
		this.value = this.body.children[0].value;
		return true;
	}

	elementToValue() {
		let value = undefined;
		if (typeof this.#options.value === 'function')
			try { value = this.#options.value(this.studio) } catch { }
		else if (typeof this.#options.value !== 'undefined')
			value = this.#options.value;
		if (this.checkValueFormat(value)) {
			this.value = value;
			return true;
		}
		return false;
	}

	valueToInput() {
		this.studio.warnLog(`${this.label} valueToInput is not implemented`);
		return false;

		// Use this structure:
		this.body.children[0].value = this.value;
		return true;
	}

	addTrigger(element, eventType) {
		const fn = (e) => { this.trigger() };
		const event = element.addEventListener(eventType, fn);
		this.triggers.push([element, event, fn]);
	}

	checkValueFormat(value) {
		if (typeof value === 'function' || typeof value === 'undefined')
			return false;
		return true;
	}
	
	refresh(value) {
		if (this.checkValueFormat(value)) {
			this.value = value;
			this.valueToInput();
			return true;
		}
		if (this.elementToValue()) {
			this.valueToInput();
			return true;
		}
		return false;
	}

	trigger() {
		this.inputToValue();
		if (typeof this.options.onChange === 'function') {
			try {
				this.options.onChange(this.studio, this.value);
			} catch {
				this.studio.warnLog(`The input have not produced any change`);
			}
			this.studio.refresh();
		}
	}

	set value(value) { this.#value = value; }

	get body() { return this.#body; }
	get container() { return this.#container; }
	get element() { return this.#element; }
	get id() { return this.#id; }
	get input() { return this.#input; }
	get label() { return this.#label; }
	get options() { return this.#options; }
	get section() { return this.#section; }
	get studio() { return this.#studio; }
	get triggers() { return this.#triggers; }
	get type() { return this.#type; }
	get value() { return this.#value; }

	#body = null;
	#container = null;
	#element = null;
	#id = null;
	#input = null;
	#label = null;
	#options = {};
	#section = null;
	#studio = null;
	#triggers = [];
	#type = null;
	#value = null;
}

const KCStudioInputs = {};

KCStudioInputs['switch'] = class extends KCStudioInput {
	generator() {
		super.generator({ label: false });
		this.body.innerHTML = `
			<input type="checkbox" hidden />
			<label><div class="label"><span></span></div><div class="switch"></div></label>`;
		if (typeof this.label === 'string')
			this.body.children[1].children[0].children[0].innerText = this.label;
		this.body.children[1].addEventListener('click', (e) => {
			this.body.children[0].click();
		});
		this.addTrigger(this.body.children[0], 'change');
		return true;
	}
	inputToValue() {
		this.value = this.body.children[0].checked;
		return true;
	}
	valueToInput() {
		this.body.children[0].checked = this.value;
		return true;
	}
	checkValueFormat(value) {
		if (typeof value === 'boolean')
			return true;
		return false;
	}
}

KCStudioInputs['checkbox'] = class extends KCStudioInput {
	generator() {
		super.generator({ label: false });
		this.body.innerHTML = `
			<input type="checkbox" hidden />
			<label><div class="box">${this.studio.icon('ki-solid ki-check')}</div><div class="label"><span></span></div></label>`;
		this.body.children[0].id = `kcs-input-${this.id}`;
		if (typeof this.label === 'string')
			this.body.children[1].children[1].children[0].innerText = this.label;
		this.body.children[1].addEventListener('click', (e) => {
			this.body.children[0].click();
		});
		this.addTrigger(this.body.children[0], 'change');
		return true;
	}
	inputToValue() {
		this.value = this.body.children[0].checked;
		return true;
	}
	valueToInput() {
		this.body.children[0].checked = this.value;
		return true;
	}
	checkValueFormat(value) {
		if (typeof value === 'boolean')
			return true;
		return false;
	}
}

KCStudioInputs['width-height'] = class extends KCStudioInput {
	generator() {
		super.generator();
		this.body.innerHTML = `
			<div class="kcs-input-row">
				<div class="kcs-input-col">
					<label>${this.studio.loc('Width')}</label>
					<div class="kcs-input-row">
						<input type="number" />
						<select>
							<option value="px">px</option>
							<option value="%">%</option>
							<option value="vw">vw</option>
							<option value="vh">vh</option>
						</select>
						<div class="expand">${this.studio.icon('ki-solid ki-chevron-down')}</div>
					</div>
				</div>
				<div class="kcs-input-col">
					<label>${this.studio.loc('Height')}</label>
					<div class="kcs-input-row">
						<input type="number" />
						<select>
							<option value="px">px</option>
							<option value="%">%</option>
							<option value="vw">vw</option>
							<option value="vh">vh</option>
						</select>
						<div class="expand">${this.studio.icon('ki-solid ki-chevron-down')}</div>
					</div>
				</div>
			</div>
			<div class="kcs-input-row alt">
				<div class="kcs-input-col">
					<label>${this.studio.loc('Minimum width')}</label>
					<div class="kcs-input-row">
						<input type="number" />
						<select>
							<option value="px">px</option>
							<option value="%">%</option>
							<option value="vw">vw</option>
							<option value="vh">vh</option>
						</select>
					</div>
				</div>
				<div class="kcs-input-col">
					<label>${this.studio.loc('Minimum height')}</label>
					<div class="kcs-input-row">
						<input type="number" />
						<select>
							<option value="px">px</option>
							<option value="%">%</option>
							<option value="vw">vw</option>
							<option value="vh">vh</option>
						</select>
					</div>
				</div>
			</div>
			<div class="kcs-input-row alt">
				<div class="kcs-input-col">
					<label>${this.studio.loc('Maximum width')}</label>
					<div class="kcs-input-row">
						<input type="number" />
						<select>
							<option value="px">px</option>
							<option value="%">%</option>
							<option value="vw">vw</option>
							<option value="vh">vh</option>
						</select>
					</div>
				</div>
				<div class="kcs-input-col">
					<label>${this.studio.loc('Maximum height')}</label>
					<div class="kcs-input-row">
						<input type="number" />
						<select>
							<option value="px">px</option>
							<option value="%">%</option>
							<option value="vw">vw</option>
							<option value="vh">vh</option>
						</select>
					</div>
				</div>
			</div>`;
		this.body.children[0].children[0].children[0].addEventListener('click', (e) => {
			this.body.children[0].children[0].children[1].children[0].focus();
		});
		this.body.children[0].children[1].children[0].addEventListener('click', (e) => {
			this.body.children[0].children[1].children[1].children[0].focus();
		});
		this.body.children[1].children[0].children[0].addEventListener('click', (e) => {
			this.body.children[1].children[0].children[1].children[0].focus();
		});
		this.body.children[1].children[1].children[0].addEventListener('click', (e) => {
			this.body.children[1].children[1].children[1].children[0].focus();
		});
		this.body.children[2].children[0].children[0].addEventListener('click', (e) => {
			this.body.children[2].children[0].children[1].children[0].focus();
		});
		this.body.children[2].children[1].children[0].addEventListener('click', (e) => {
			this.body.children[2].children[1].children[1].children[0].focus();
		});

		this.body.children[0].children[0].children[1].children[2].addEventListener('click', (e) => {
			this.element.classList.toggle('expanded');
		});
		this.body.children[0].children[1].children[1].children[2].addEventListener('click', (e) => {
			this.element.classList.toggle('expanded');
		});

		this.body.children[0].children[0].children[1].children[0].addEventListener('input', (e) => {
			if (parseFloat(e.target.value) < 0) {
				e.stopPropagation();
				e.target.value = 0;
			}
		});
		this.body.children[0].children[1].children[1].children[0].addEventListener('input', (e) => {
			if (parseFloat(e.target.value) < 0) {
				e.stopPropagation();
				e.target.value = 0;
			}
		});
		this.body.children[1].children[0].children[1].children[0].addEventListener('input', (e) => {
			if (parseFloat(e.target.value) < 0) {
				e.stopPropagation();
				e.target.value = 0;
			}
		});
		this.body.children[1].children[1].children[1].children[0].addEventListener('input', (e) => {
			if (parseFloat(e.target.value) < 0) {
				e.stopPropagation();
				e.target.value = 0;
			}
		});
		this.body.children[2].children[0].children[1].children[0].addEventListener('input', (e) => {
			if (parseFloat(e.target.value) < 0) {
				e.stopPropagation();
				e.target.value = 0;
			}
		});
		this.body.children[2].children[1].children[1].children[0].addEventListener('input', (e) => {
			if (parseFloat(e.target.value) < 0) {
				e.stopPropagation();
				e.target.value = 0;
			}
		});

		this.addTrigger(this.body.children[0].children[0].children[1].children[0], 'input');
		this.addTrigger(this.body.children[0].children[0].children[1].children[1], 'input');
		this.addTrigger(this.body.children[0].children[1].children[1].children[0], 'input');
		this.addTrigger(this.body.children[0].children[1].children[1].children[1], 'input');
		this.addTrigger(this.body.children[1].children[0].children[1].children[0], 'input');
		this.addTrigger(this.body.children[1].children[0].children[1].children[1], 'input');
		this.addTrigger(this.body.children[1].children[1].children[1].children[0], 'input');
		this.addTrigger(this.body.children[1].children[1].children[1].children[1], 'input');
		this.addTrigger(this.body.children[2].children[0].children[1].children[0], 'input');
		this.addTrigger(this.body.children[2].children[0].children[1].children[1], 'input');
		this.addTrigger(this.body.children[2].children[1].children[1].children[0], 'input');
		this.addTrigger(this.body.children[2].children[1].children[1].children[1], 'input');
	}

	inputToValue() {
		const values = {};
		values.width = this.body.children[0].children[0].children[1].children[0].value;
		values.height = this.body.children[0].children[1].children[1].children[0].value;
		values.minWidth = this.body.children[1].children[0].children[1].children[0].value;
		values.minHeight = this.body.children[1].children[1].children[1].children[0].value;
		values.maxWidth = this.body.children[2].children[0].children[1].children[0].value;
		values.maxHeight = this.body.children[2].children[1].children[1].children[0].value;
		const units = {};
		units.width = this.body.children[0].children[0].children[1].children[1].value;
		units.height = this.body.children[0].children[1].children[1].children[1].value;
		units.minWidth = this.body.children[1].children[0].children[1].children[1].value;
		units.minHeight = this.body.children[1].children[1].children[1].children[1].value;
		units.maxWidth = this.body.children[2].children[0].children[1].children[1].value;
		units.maxHeight = this.body.children[2].children[1].children[1].children[1].value;

		for (let k in values) {
			if (values[k] === '' || values[k] === null)
				continue;
			if (values[k] < 0)
				values[k] = 0;
		}		
		
		const value = {
			width: (values.width === null || values.width === '') ? null : `${values.width}${units.width}`,
			height: (values.height === null || values.height === '') ? null : `${values.height}${units.height}`,
			minWidth: (values.minWidth === null || values.minWidth === '') ? null : `${values.minWidth}${units.minWidth}`,
			minHeight: (values.minHeight === null || values.minHeight === '') ? null : `${values.minHeight}${units.minHeight}`,
			maxWidth: (values.maxWidth === null || values.maxWidth === '') ? null : `${values.maxWidth}${units.maxWidth}`,
			maxHeight: (values.maxHeight === null || values.maxHeight === '') ? null : `${values.maxHeight}${units.maxHeight}`
		};

		if (this.checkValueFormat(value)) {
			this.value = value;
			return true;
		}
		return false;
	}

	valueToInput() {
		if (this.value.width !== null) {
			const width = parseFloat(this.value.width.replace(/[^0-9.]/g, ''));
			let unit = this.value.width.replace(/[0-9.]/g, '');
			if (!['px', '%', 'vw', 'vh'].includes(unit))
				unit = 'px';
			this.body.children[0].children[0].children[1].children[0].value = width;
			this.body.children[0].children[0].children[1].children[1].value = unit;
		} else {
			this.body.children[0].children[0].children[1].children[0].value = '';
		}
		if (this.value.height !== null) {
			const height = parseFloat(this.value.height.replace(/[^0-9.]/g, ''));
			let unit = this.value.height.replace(/[0-9.]/g, '');
			if (!['px', '%', 'vw', 'vh'].includes(unit))
				unit = 'px';
			this.body.children[0].children[1].children[1].children[0].value = height;
			this.body.children[0].children[1].children[1].children[1].value = unit;
		} else {
			this.body.children[0].children[1].children[1].children[0].value = '';
		}
		if (this.value.minWidth !== null) {
			const minWidth = parseFloat(this.value.minWidth.replace(/[^0-9.]/g, ''));
			let unit = this.value.minWidth.replace(/[0-9.]/g, '');
			if (!['px', '%', 'vw', 'vh'].includes(unit))
				unit = 'px';
			this.body.children[1].children[0].children[1].children[0].value = minWidth;
			this.body.children[1].children[0].children[1].children[1].value = unit;
		} else {
			this.body.children[1].children[0].children[1].children[0].value = '';
		}
		if (this.value.minHeight !== null) {
			const minHeight = parseFloat(this.value.minHeight.replace(/[^0-9.]/g, ''));
			let unit = this.value.minHeight.replace(/[0-9.]/g, '');
			if (!['px', '%', 'vw', 'vh'].includes(unit))
				unit = 'px';
			this.body.children[1].children[1].children[1].children[0].value = minHeight;
			this.body.children[1].children[1].children[1].children[1].value = unit;
		} else {
			this.body.children[1].children[1].children[1].children[0].value = '';
		}
		if (this.value.maxWidth !== null) {
			const maxWidth = parseFloat(this.value.maxWidth.replace(/[^0-9.]/g, ''));
			let unit = this.value.maxWidth.replace(/[0-9.]/g, '');
			if (!['px', '%', 'vw', 'vh'].includes(unit))
				unit = 'px';
			this.body.children[2].children[0].children[1].children[0].value = maxWidth;
			this.body.children[2].children[0].children[1].children[1].value = unit;
		} else {
			this.body.children[2].children[0].children[1].children[0].value = '';
		}
		if (this.value.maxHeight !== null) {
			const maxHeight = parseFloat(this.value.maxHeight.replace(/[^0-9.]/g, ''));
			let unit = this.value.maxHeight.replace(/[0-9.]/g, '');
			if (!['px', '%', 'vw', 'vh'].includes(unit))
				unit = 'px';
			this.body.children[2].children[1].children[1].children[0].value = maxHeight;
			this.body.children[2].children[1].children[1].children[1].value = unit;
		} else {
			this.body.children[2].children[1].children[1].children[0].value = '';
		}
		return true;
	}

	checkValueFormat(value) {
		if (typeof value !== 'object')
			return false;
		if (value.width !== null && typeof value.width !== 'string')
			return false;
		if (value.height !== null && typeof value.height !== 'string')
			return false;
		if (value.minWidth !== null && typeof value.minWidth !== 'string')
			return false;
		if (value.minHeight !== null && typeof value.minHeight !== 'string')
			return false;
		if (value.maxWidth !== null && typeof value.maxWidth !== 'string')
			return false;
		if (value.maxHeight !== null && typeof value.maxHeight !== 'string')
			return false;
		return true;
	}
}

KCStudioInputs['margin-padding'] = class extends KCStudioInput {
	generator() {
		super.generator();
		this.body.innerHTML = `
			<div class="kcs-input-container">
				<div class="kcs-input-group">
					<input type="number" />
					<select>
						<option value="px">px</option>
						<option value="%">%</option>
						<option value="vw">vw</option>
						<option value="vh">vh</option>
					</select>
					<div class="kcs-input-icon">${this.studio.icon('ki-solid ki-angle-up')}</div>
				</div>
				<div class="kcs-input-group">
					<input type="number" />
					<select>
						<option value="px">px</option>
						<option value="%">%</option>
						<option value="vw">vw</option>
						<option value="vh">vh</option>
					</select>
					<div class="kcs-input-icon">${this.studio.icon('ki-solid ki-angle-right')}</div>
				</div>
				<div class="kcs-input-group">
					<input type="number" />
					<select>
						<option value="px">px</option>
						<option value="%">%</option>
						<option value="vw">vw</option>
						<option value="vh">vh</option>
					</select>
					<div class="kcs-input-icon">${this.studio.icon('ki-solid ki-angle-down')}</div>
				</div>
				<div class="kcs-input-group">
					<input type="number" />
					<select>
						<option value="px">px</option>
						<option value="%">%</option>
						<option value="vw">vw</option>
						<option value="vh">vh</option>
					</select>
					<div class="kcs-input-icon">${this.studio.icon('ki-solid ki-angle-left')}</div>
				</div>
				<div class="kcs-input-group">
					<button>${this.studio.icon('ki-duotone ki-lock')}</button>
				</div>
			</div>`;

		const minMax = (e) => {
			if (typeof this.options.min === 'number' && parseFloat(e.target.value) < this.options.min) {
				e.stopPropagation();
				e.target.value = this.options.min;
			}
			if (typeof this.options.max === 'number' && parseFloat(e.target.value) > this.options.max) {
				e.stopPropagation();
				e.target.value = this.options.max;
			}
		}
		const checkValue = (e) => {
			minMax(e);
			const lock = this.body.children[0].children[4].children[0].classList.contains('active');
			if (lock) {
				const index = [...e.target.parentElement.parentElement.children].indexOf(e.target.parentElement);
				const value = e.target.value;
				const unit = e.target.nextElementSibling.value;
				for (let i = 0; i < 4; i++) {
					if (i !== index) {
						this.body.children[0].children[i].children[0].value = value;
						this.body.children[0].children[i].children[1].value = unit;
					}
				}
			}
			this.trigger();
		}
		this.body.children[0].children[0].children[0].addEventListener('input', checkValue);
		this.body.children[0].children[1].children[0].addEventListener('input', checkValue);
		this.body.children[0].children[2].children[0].addEventListener('input', checkValue);
		this.body.children[0].children[3].children[0].addEventListener('input', checkValue);

		const checkUnit = (e) => {
			const lock = this.body.children[0].children[4].children[0].classList.contains('active');
			if (lock) {
				const index = [...e.target.parentElement.parentElement.children].indexOf(e.target.parentElement);
				const value = e.target.previousElementSibling.value;
				const unit = e.target.value;
				for (let i = 0; i < 4; i++) {
					if (i !== index) {
						this.body.children[0].children[i].children[0].value = value;
						this.body.children[0].children[i].children[1].value = unit;
					}
				}
			}
			this.trigger();
		}
		this.body.children[0].children[0].children[1].addEventListener('input', checkUnit);
		this.body.children[0].children[1].children[1].addEventListener('input', checkUnit);
		this.body.children[0].children[2].children[1].addEventListener('input', checkUnit);
		this.body.children[0].children[3].children[1].addEventListener('input', checkUnit);

		this.body.children[0].children[4].children[0].addEventListener('click', (e) => {
			this.body.children[0].children[4].children[0].classList.toggle('active');
			const checked = this.body.children[0].children[4].children[0].classList.contains('active');
			if (checked) {
				let index = 0;
				for (let i = 0; i < 4; i++) {
					if (this.body.children[0].children[i].children[0].value !== '') {
						index = i;
						break;
					}
				}
				for (let i = 0; i < 4; i++) {
					if (i !== index) {
						this.body.children[0].children[i].children[0].value = this.body.children[0].children[index].children[0].value;
						this.body.children[0].children[i].children[1].value = this.body.children[0].children[index].children[1].value;
					}
				}
				this.trigger();
			}
		});
	}

	checkValueFormat(value) {
		if (typeof value !== 'object')
			return false;
		if (value.top !== null && typeof value.top !== 'string')
			return false;
		if (value.right !== null && typeof value.right !== 'string')
			return false;
		if (value.bottom !== null && typeof value.bottom !== 'string')
			return false;
		if (value.left !== null && typeof value.left !== 'string')
			return false;
		return true;
	}

	inputToValue() {
		const values = {};
		values.top = this.body.children[0].children[0].children[0].value;
		values.right = this.body.children[0].children[1].children[0].value;
		values.bottom = this.body.children[0].children[2].children[0].value;
		values.left = this.body.children[0].children[3].children[0].value;
		const units = {};
		units.top = this.body.children[0].children[0].children[1].value;
		units.right = this.body.children[0].children[1].children[1].value;
		units.bottom = this.body.children[0].children[2].children[1].value;
		units.left = this.body.children[0].children[3].children[1].value;

		for (let k in values) {
			if (values[k] === '' || values[k] === null)
				continue;
			if (typeof this.options.min === 'number' && values[k] < this.options.min)
				values[k] = this.options.min;
			if (typeof this.options.max === 'number' && values[k] > this.options.max)
				values[k] = this.options.max;
		}		
		
		const value = {
			top: (values.top === null || values.top === '') ? null : `${values.top}${units.top}`,
			right: (values.right === null || values.right === '') ? null : `${values.right}${units.right}`,
			bottom: (values.bottom === null || values.bottom === '') ? null : `${values.bottom}${units.bottom}`,
			left: (values.left === null || values.left === '') ? null : `${values.left}${units.left}`
		};

		if (this.checkValueFormat(value)) {
			this.value = value;
			return true;
		}
		return false;
	}

	valueToInput() {
		if (this.value.top !== null) {
			const top = parseFloat(this.value.top.replace(/[^0-9.]/g, ''));
			let unit = this.value.top.replace(/[0-9.]/g, '');
			if (!['px', '%', 'vw', 'vh'].includes(unit))
				unit = 'px';
			this.body.children[0].children[0].children[0].value = top;
			this.body.children[0].children[0].children[1].value = unit;
		} else {
			this.body.children[0].children[0].children[0].value = '';
		}
		if (this.value.right !== null) {
			const right = parseFloat(this.value.right.replace(/[^0-9.]/g, ''));
			let unit = this.value.right.replace(/[0-9.]/g, '');
			if (!['px', '%', 'vw', 'vh'].includes(unit))
				unit = 'px';
			this.body.children[0].children[1].children[0].value = right;
			this.body.children[0].children[1].children[1].value = unit;
		} else {
			this.body.children[0].children[1].children[0].value = '';
		}
		if (this.value.bottom !== null) {
			const bottom = parseFloat(this.value.bottom.replace(/[^0-9.]/g, ''));
			let unit = this.value.bottom.replace(/[0-9.]/g, '');
			if (!['px', '%', 'vw', 'vh'].includes(unit))
				unit = 'px';
			this.body.children[0].children[2].children[0].value = bottom;
			this.body.children[0].children[2].children[1].value = unit;
		} else {
			this.body.children[0].children[2].children[0].value = '';
		}
		if (this.value.left !== null) {
			const left = parseFloat(this.value.left.replace(/[^0-9.]/g, ''));
			let unit = this.value.left.replace(/[0-9.]/g, '');
			if (!['px', '%', 'vw', 'vh'].includes(unit))
				unit = 'px';
			this.body.children[0].children[3].children[0].value = left;
			this.body.children[0].children[3].children[1].value = unit;
		} else {
			this.body.children[0].children[3].children[0].value = '';
		}
		if (this.value.top !== null && this.value.top === this.value.right && this.value.right === this.value.bottom && this.value.bottom === this.value.left)
			this.body.children[0].children[4].children[0].classList.add('active');
		else
			this.body.children[0].children[4].children[0].classList.remove('active');
		return true;
	}
}