import SimpleImageTool from '@editorjs/simple-image';
import ParagraphTool from '@editorjs/paragraph';
import WarningTool from '@editorjs/warning';
import ChecklistTool from '@editorjs/checklist';
import DelimiterTool from '@editorjs/delimiter';
import TableTool from '@editorjs/table';
import CodeTool from '@editorjs/code';
import HeaderTool from '@editorjs/header';
import UnderlineTool from '@editorjs/underline';
import EmbedTool from '@editorjs/embed';
import MarkerTool from '@editorjs/marker';
import RawToolTool from '@editorjs/raw';
import InlineCodeTool from '@editorjs/inline-code';
import AlertTool from 'editorjs-alert';
import StrikethroughTool from '@itech-indrustries/editorjs-strikethrough';
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';
import NestedListTool from '@editorjs/nested-list';
import ListTool from 'editorjs-list';
import ImageTool from './custom-plugins/plugin-image-patch.js';
import AttachesTool from './custom-plugins/plugin-attaches-patch.js';
import PersonalityTool from './custom-plugins/plugin-personality-patch.js';
import QuoteNestedTool from './custom-plugins/plugin-quote-nested.js';

export type UploaderConfig = {
	addTokenToURL: (url: string, token: string) => string;
	baseURL: string | undefined;
	setFileHandler: (handler: any) => void;
	setCurrentPreview?: (url: string) => void;
	getUploadFieldElement: () => any;
	t: Record<string, string>;
};

export default function getTools(
	uploaderConfig: UploaderConfig,
	selection: Array<string>,
	haveFilesAccess: boolean,
): Record<string, object> {
	const tools: Record<string, any> = {};
	const fileRequiresTools = ['attaches', 'personality', 'image'];
	const fallbackNestedToolNames = [
		'paragraph',
		'header',
		'list',
		'nestedlist',
		'checklist',
		'delimiter',
		'inlinecode',
		'marker',
	];

	const defaults: Record<string, any> = {
		header: {
			class: HeaderTool,
			shortcut: 'CMD+SHIFT+H',
			inlineToolbar: true,
		},
		list: {
			class: ListTool,
			inlineToolbar: false,
			shortcut: 'CMD+SHIFT+1',
		},
		nestedlist: {
			class: NestedListTool,
			inlineToolbar: true,
			shortcut: 'CMD+SHIFT+L',
		},
		embed: {
			class: EmbedTool,
			inlineToolbar: true,
		},
		paragraph: {
			class: ParagraphTool,
			inlineToolbar: true,
		},
		code: {
			class: CodeTool,
		},
		warning: {
			class: WarningTool,
			inlineToolbar: true,
			shortcut: 'CMD+SHIFT+W',
		},
		underline: {
			class: UnderlineTool,
			shortcut: 'CMD+SHIFT+U',
		},
		strikethrough: {
			class: StrikethroughTool,
		},
		alert: {
			class: AlertTool,
		},
		table: {
			class: TableTool,
			inlineToolbar: true,
		},
		marker: {
			class: MarkerTool,
			shortcut: 'CMD+SHIFT+M',
		},
		inlinecode: {
			class: InlineCodeTool,
			shortcut: 'CMD+SHIFT+I',
		},
		delimiter: {
			class: DelimiterTool,
		},
		raw: {
			class: RawToolTool,
		},
		checklist: {
			class: ChecklistTool,
			inlineToolbar: true,
		},
		simpleimage: {
			class: SimpleImageTool,
		},
		image: {
			class: ImageTool,
			config: {
				uploader: uploaderConfig,
			},
		},
		attaches: {
			class: AttachesTool,
			config: {
				uploader: uploaderConfig,
			},
		},
		personality: {
			class: PersonalityTool,
			config: {
				uploader: uploaderConfig,
			},
		},
		alignmentTune: {
			class: AlignmentTuneTool,
		},
	};

	const shouldRegisterQuote = selection.includes('quote');

	for (const toolName of selection) {
		if (toolName === 'quote') continue;
		if (!haveFilesAccess && fileRequiresTools.includes(toolName)) continue;

		if (toolName in defaults) {
			tools[toolName] = defaults[toolName];
		}
	}

	if (shouldRegisterQuote) {
		let nestedToolsEntries = Object.entries(tools).filter(([name]) => name !== 'alignmentTune');

		if (nestedToolsEntries.length === 0) {
			nestedToolsEntries = fallbackNestedToolNames
				.filter((name) => name in defaults)
				.map((name) => [name, defaults[name]]);
		}

		const nestedTools = Object.fromEntries(nestedToolsEntries);

		tools.quote = {
			class: QuoteNestedTool,
			inlineToolbar: true,
			shortcut: 'CMD+SHIFT+O',
			config: {
				nestedTools,
				uploader: haveFilesAccess ? uploaderConfig : undefined,
				t: uploaderConfig.t,
			},
		};
	}

	if ('alignmentTune' in tools) {
		if ('paragraph' in tools) {
			tools.paragraph.tunes = ['alignmentTune'];
		}

		if ('header' in tools) {
			tools.header.tunes = ['alignmentTune'];
		}

		if ('quote' in tools) {
			tools.quote.tunes = ['alignmentTune'];
		}
	}

	return tools;
}
