declare module '@editorjs/simple-image' {
	export default class SimpleImage {
		static get toolbox(): {
			title: string;
			icon: string;
		};
		constructor(config?: any);
		render(): HTMLElement;
		save(blockContent: HTMLElement): any;
	}
}

declare module '@editorjs/checklist' {
	export default class Checklist {
		static get toolbox(): {
			title: string;
			icon: string;
		};
		constructor(config?: any);
		render(): HTMLElement;
		save(blockContent: HTMLElement): any;
	}
}

declare module '@editorjs/marker' {
	export default class Marker {
		static get toolbox(): {
			title: string;
			icon: string;
		};
		constructor(config?: any);
		render(): HTMLElement;
		save(blockContent: HTMLElement): any;
	}
}

declare module '@editorjs/raw' {
	export default class Raw {
		static get toolbox(): {
			title: string;
			icon: string;
		};
		constructor(config?: any);
		render(): HTMLElement;
		save(blockContent: HTMLElement): any;
	}
}

declare module 'editorjs-alert' {
	export default class Alert {
		static get toolbox(): {
			title: string;
			icon: string;
		};
		constructor(config?: any);
		render(): HTMLElement;
		save(blockContent: HTMLElement): any;
	}
}

declare module '@itech-indrustries/editorjs-strikethrough' {
	export default class Strikethrough {
		static get toolbox(): {
			title: string;
			icon: string;
		};
		constructor(config?: any);
		render(): HTMLElement;
		save(blockContent: HTMLElement): any;
	}
}

declare module 'editorjs-text-alignment-blocktune' {
	export default class AlignmentTune {
		static get toolbox(): {
			title: string;
			icon: string;
		};
		constructor(config?: any);
		render(): HTMLElement;
		save(blockContent: HTMLElement): any;
	}
}

declare module 'editorjs-list' {
	export default class List {
		static get toolbox(): {
			title: string;
			icon: string;
		};
		constructor(config?: any);
		render(): HTMLElement;
		save(blockContent: HTMLElement): any;
	}
}
