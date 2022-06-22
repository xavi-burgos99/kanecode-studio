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