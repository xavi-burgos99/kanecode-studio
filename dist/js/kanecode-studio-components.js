const KCStudioComponents = {};
KCStudioComponents['basics'] = {
	title: {
		"en-US": "Basics",
		"es-ES": "Básicos",
	},
	icon: 'undefined',
	components: {}
};



KCStudioComponents['basics'].components['body'] = {
	title: {
		"en-US": "Body",
		"es-ES": "Cuerpo (body)",
	},
	description: {
		"en-US": "This is a body.",
		"es-ES": "Esto es un cuerpo (body).",
	},
	icon: 'undefined',
	tagName: ['body'],
	options: {
		hidden: true,
		in: ['section'],
		removable: false,
	},
};

KCStudioComponents['basics'].components['section'] = {
	title: {
		"en-US": "Section",
		"es-ES": "Sección",
	},
	description: {
		"en-US": "This is a section.",
		"es-ES": "Esto es una sección.",
	},
	tags: {
		"en-US": ["paragraph"],
		"es-ES": ["párrafo"],
	},
	icon: 'undefined',
	options: {
		inside: {
			allow: true,
			components: 'column',
		}
	},
	html: (studio) => {
		const element = document.createElement('div');
		element.innerHTML = `<div class="container">
			<p>${studio.loc({
				"en-US": "Insert your text here",
				"es-ES": "Inserta tu texto aquí",
			})}</p>
		</div>`;
		return element.children[0];
	},
};

KCStudioComponents['basics'].components['column'] = {
	title: {
		"en-US": "Section",
		"es-ES": "Sección",
	},
	description: {
		"en-US": "This is a section.",
		"es-ES": "Esto es una sección.",
	},
	tags: {
		"en-US": ["paragraph"],
		"es-ES": ["párrafo"],
	},
	icon: 'undefined',
	options: {
		inside: {
			allow: true,
			components: 'column',
		}
	},
	html: (studio) => {
		const element = document.createElement('div');
		element.innerHTML = `<div class="container">
			<p>${studio.loc({
				"en-US": "Insert your text here",
				"es-ES": "Inserta tu texto aquí",
			})}</p>
		</div>`;
		return element.children[0];
	},
};

KCStudioComponents['basics'].components['text'] = {
	title: {
		"en-US": "Text",
		"es-ES": "Texto",
	},
	description: {
		"en-US": "Text",
		"es-ES": "Texto",
	},
	tags: {
		"en-US": ["paragraph"],
		"es-ES": ["párrafo"],
	},
	icon: 'undefined',
	html: (studio) => {
		const element = document.createElement('div');
		element.innerHTML = `<div>
			<p>${studio.loc({
				"en-US": "Insert your text here",
				"es-ES": "Inserta tu texto aquí",
			})}</p>
		</div>`;
		return element.children[0];
	},
};
