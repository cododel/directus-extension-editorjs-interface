import { I18nConfig } from '@editorjs/editorjs';

export default function getTranslations(t: (str: string) => string): I18nConfig {
	const translate = (key: string, fallback: string) => {
		const translated = t(key);
		return translated === key ? fallback : translated;
	};

	return {
		messages: {
			ui: {
				blockTunes: {
					toggler: {
						'Click to tune': t('layout_options'),
					},
				},
				toolbar: {
					toolbox: {
						Filter: t('filter'),
						Add: t('create'),
						'Nothing found': t('none'),
					},
				},
			},
			toolNames: {
				Text: t('text'),
				Heading: t('wysiwyg_options.heading'),
				List: t('wysiwyg_options.bullist'),
				Warning: t('warning'),
				Checklist: t('interfaces.select-multiple-checkbox.checkboxes'),
				Quote: t('wysiwyg_options.blockquote'),
				Code: t('interfaces.input-code.code'),
				Image: t('interfaces.file-image.image'),
				Attaches: t('file'),
				Delimiter: t('wysiwyg_options.hr'),
				'Raw HTML': t('raw_value'),
				Table: t('wysiwyg_options.table'),
				Link: t('wysiwyg_options.link'),
				Bold: t('wysiwyg_options.bold'),
				Underline: t('wysiwyg_options.underline'),
				Italic: t('wysiwyg_options.italic'),
				Inlinecode: t('interfaces.input-code.code'),
				Strikethrough: t('wysiwyg_options.strikethrough'),
			},
			tools: {
				header: {
					Header: t('wysiwyg_options.heading'),
				},
				link: {
					Link: t('wysiwyg_options.link'),
					'Add a link': t('field_options.directus_roles.fields.link_placeholder'),
				},
				image: {
					Caption: translate('title', 'Title'),
					'Select an Image': translate('interfaces.file-image.description', 'Select an image'),
					'With border': t('displays.formatted-value.border_label'),
					'Stretch image': t('full_width'),
				},
				warning: {
					Title: t('title'),
					Message: t('note'),
				},
				code: {
					'Enter a code': t('interfaces.input-code.placeholder'),
				},
				quote: {
					'Enter a quote': translate('wysiwyg_options.blockquote', 'Enter a quote'),
					'Select an image': translate('interfaces.file-image.description', 'Select an image'),
					'Add an image': translate('interfaces.file-image.description', 'Add an image'),
					'Remove image': translate('delete_label', 'Remove image'),
					'Enter author': translate('wysiwyg_options.blockquote_author', 'Enter author'),
					'No file access': translate('you_cannot_edit_this_field', 'No file access'),
					'Enter quote content': translate('wysiwyg_options.blockquote_placeholder', 'Enter quote content'),
				},
				nestedlist: {
					Ordered: t('wysiwyg_options.numlist'),
					Unordered: t('wysiwyg_options.bullist'),
				},
				embed: {
					'Enter a caption': t('field_options.directus_roles.fields.name_placeholder'),
				},
				raw: {
					'Enter a code': t('enter_raw_value'),
				},
			},
			blockTunes: {
				delete: {
					Delete: t('delete_label'),
				},
			},
		},
	};
}
