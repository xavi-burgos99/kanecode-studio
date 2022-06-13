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
		inside: {
			allow: true,
			include: 'section',
		},
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
	icon: {
		light: '<img src="https://cdn.jsdelivr.net/gh/xavi-burgos99/kanecode-studio/assets/img/components/section_light.svg">',
		dark: '<img src="https://cdn.jsdelivr.net/gh/xavi-burgos99/kanecode-studio/assets/img/components/section_dark.svg">',
	},
	options: {
		inside: {
			allow: true,
			element: ['.container > .row', '.container-fluid > .row'],
			horizontal: true,
			include: 'column',
		}
	},
	html: (studio) => {
		const element = document.createElement('div');
		element.innerHTML = `
		<div class="container">
			<div class="row">
				<div class="col" data-kcs-id="${studio.utils.uuid()}"></div>
			</div>
		</div>`;
		return element.children[0];
	},
};

KCStudioComponents['basics'].components['column'] = {
	title: {
		"en-US": "Column",
		"es-ES": "Columna",
	},
	description: {
		"en-US": "This is a column.",
		"es-ES": "Esto es una columna.",
	},
	tags: {
		"en-US": ["section"],
		"es-ES": ["sección"],
	},
	class: ['col', 'col-1', 'col-2', 'col-3', 'col-4', 'col-5', 'col-6', 'col-7', 'col-8', 'col-9', 'col-10', 'col-11', 'col-12', 'col-sm-1', 'col-sm-2', 'col-sm-3', 'col-sm-4', 'col-sm-5', 'col-sm-6', 'col-sm-7', 'col-sm-8', 'col-sm-9', 'col-sm-10', 'col-sm-11', 'col-sm-12', 'col-md-1', 'col-md-2', 'col-md-3', 'col-md-4', 'col-md-5', 'col-md-6', 'col-md-7', 'col-md-8', 'col-md-9', 'col-md-10', 'col-md-11', 'col-md-12', 'col-lg-1', 'col-lg-2', 'col-lg-3', 'col-lg-4', 'col-lg-5', 'col-lg-6', 'col-lg-7', 'col-lg-8', 'col-lg-9', 'col-lg-10', 'col-lg-11', 'col-lg-12', 'col-xl-1', 'col-xl-2', 'col-xl-3', 'col-xl-4', 'col-xl-5', 'col-xl-6', 'col-xl-7', 'col-xl-8', 'col-xl-9', 'col-xl-10', 'col-xl-11', 'col-xl-12', 'col-xxl-1', 'col-xxl-2', 'col-xxl-3', 'col-xxl-4', 'col-xxl-5', 'col-xxl-6', 'col-xxl-7', 'col-xxl-8', 'col-xxl-9', 'col-xxl-10', 'col-xxl-11', 'col-xxl-12'],
	icon: {
		light: '<img src="https://cdn.jsdelivr.net/gh/xavi-burgos99/kanecode-studio/assets/img/components/column_light.svg">',
		dark: '<img src="https://cdn.jsdelivr.net/gh/xavi-burgos99/kanecode-studio/assets/img/components/column_dark.svg">',
	},
	options: {
		inside: {
			allow: true,
			exclude: ['body', 'column']
		}
	},
	html: (studio) => {
		const element = document.createElement('div');
		element.innerHTML = `
		<div class="col py-2"></div>`;
		return element.children[0];
	},
};

KCStudioComponents['basics'].components['heading'] = {
	title: {
		"en-US": "Heading",
		"es-ES": "Cabecera",
	},
	description: {
		"en-US": "Headings are used to organize content.",
		"es-ES": "Las cabeceras se usan para organizar el contenido.",
	},
	tags: {
		"en-US": ["text"],
		"es-ES": ["texto"],
	},
	icon: {
		light: '<img src="https://cdn.jsdelivr.net/gh/xavi-burgos99/kanecode-studio/assets/img/components/heading_light.svg">',
		dark: '<img src="https://cdn.jsdelivr.net/gh/xavi-burgos99/kanecode-studio/assets/img/components/heading_dark.svg">',
	},
	html: (studio) => {
		const element = document.createElement('div');
		element.innerHTML = `<div>
			<h1>${studio.loc({
				"en-US": "Insert your text here",
				"es-ES": "Inserta tu texto aquí",
			})}</h1>
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
	icon: {
		light: '<img src="https://cdn.jsdelivr.net/gh/xavi-burgos99/kanecode-studio/assets/img/components/paragraph_light.svg">',
		dark: '<img src="https://cdn.jsdelivr.net/gh/xavi-burgos99/kanecode-studio/assets/img/components/paragraph_dark.svg">',
	},
	inspector: {
		
		include: ['default'],
	},
	html: (studio) => {
		const element = document.createElement('div');
		element.innerHTML = `<p>${studio.loc({
				"en-US": "Insert your text here",
				"es-ES": "Inserta tu texto aquí",
			})}</p>`;
		return element;
	},
};

KCStudioComponents['basics'].components['image'] = {
	title: {
		"en-US": "Image",
		"es-ES": "Imagen",
	},
	description: {
		"en-US": "This is an image.",
		"es-ES": "Esto es una imagen.",
	},
	tags: {
		"en-US": ["photo"],
		"es-ES": ["foto"],
	},
	icon: {
		light: '<img src="https://cdn.jsdelivr.net/gh/xavi-burgos99/kanecode-studio/assets/img/components/image_light.svg">',
		dark: '<img src="https://cdn.jsdelivr.net/gh/xavi-burgos99/kanecode-studio/assets/img/components/image_dark.svg">',
	},
	html: (studio) => {
		const element = document.createElement('div');
		element.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/xavi-burgos99/kanecode-studio/assets/img/preview-image.png" alt="">`;
		return element.children[0];
	},
};
