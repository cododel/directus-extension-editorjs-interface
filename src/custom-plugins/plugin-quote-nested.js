import EditorJS from '@editorjs/editorjs';
import ParagraphTool from '@editorjs/paragraph';
import Uploader from './editorjs-uploader.js';

const CSS = {
  wrapper: 'cdx-quote-nested',
  imageWrapper: 'cdx-quote-nested__image',
  imageArea: 'cdx-quote-nested__image-area',
  imageAreaFilled: 'cdx-quote-nested__image-area--filled',
  imageIcon: 'cdx-quote-nested__image-icon',
  imageIconHidden: 'cdx-quote-nested__image-icon-hidden',
  imageDisabled: 'cdx-quote-nested__image-area--disabled',
  imageRemove: 'cdx-quote-nested__image-remove',
  content: 'cdx-quote-nested__content',
  editor: 'cdx-quote-nested__editor',
};

const I18N_KEYS = {
  selectImage: 'Select an image',
  removeImage: 'Remove image',
  imagePlaceholder: 'Add an image',
  noFileAccess: 'No file access',
  contentPlaceholder: 'Enter quote content',
};

const FALLBACK_NESTED_TOOLS = {
  paragraph: {
    class: ParagraphTool,
    inlineToolbar: true,
  },
};

export default class QuoteNested {
  static get toolbox() {
    return {
      title: 'Quote',
      icon: '<i data-icon="format_quote"></i>',
    };
  }

  constructor({ data, api, config, block }) {
    this.api = api;
    this.block = block;
    this.config = config || {};
    this.data = {
      blocks: Array.isArray(data?.blocks) ? data.blocks : [],
      image: data?.image || null,
    };

    this.nodes = {
      wrapper: null,
      imageWrapper: null,
      imageArea: null,
      imageIcon: null,
      removeButton: null,
      editorHolder: null,
    };

    this.nestedEditor = null;
    this.uploader = this.initUploader();
    this.onNestedChange = this.onNestedChange.bind(this);
    this.onNestedKeydown = this.onNestedKeydown.bind(this);
    this.onImageAreaClick = this.onImageAreaClick.bind(this);
    this.onImageAreaKeydown = this.onImageAreaKeydown.bind(this);
  }

  initUploader() {
    if (!this.config.uploader) {
      return null;
    }

    return new Uploader({
      config: this.config,
      getCurrentFile: () => this.data.image?.url,
      onUpload: (response) => this.onImageUpload(response),
      onError: (error) => this.onImageUploadError(error),
    });
  }

  render() {
    this.nodes.wrapper = document.createElement('div');
    this.nodes.wrapper.classList.add(CSS.wrapper);

    this.nodes.imageWrapper = document.createElement('div');
    this.nodes.imageWrapper.classList.add(CSS.imageWrapper);

    this.nodes.imageArea = document.createElement('div');
    this.nodes.imageArea.classList.add(CSS.imageArea);
    this.nodes.imageArea.setAttribute('role', 'button');
    this.nodes.imageArea.tabIndex = this.uploader ? 0 : -1;

    this.nodes.imageIcon = document.createElement('i');
    this.nodes.imageIcon.dataset.icon = 'image';
    this.nodes.imageIcon.classList.add(CSS.imageIcon);
    this.nodes.imageArea.appendChild(this.nodes.imageIcon);

    if (this.uploader) {
      this.nodes.imageArea.addEventListener('click', this.onImageAreaClick);
      this.nodes.imageArea.addEventListener('keydown', this.onImageAreaKeydown);
    } else {
      this.nodes.imageArea.classList.add(CSS.imageDisabled);
    }

    this.nodes.imageWrapper.appendChild(this.nodes.imageArea);

    this.nodes.removeButton = document.createElement('button');
    this.nodes.removeButton.type = 'button';
    this.nodes.removeButton.classList.add(CSS.imageRemove);
    this.nodes.removeButton.dataset.icon = 'close';
    this.nodes.removeButton.setAttribute('aria-label', this.translate(I18N_KEYS.removeImage));
    this.nodes.removeButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.clearImage();
    });

    this.nodes.imageWrapper.appendChild(this.nodes.removeButton);

    this.nodes.contentWrapper = document.createElement('div');
    this.nodes.contentWrapper.classList.add(CSS.content);

    this.nodes.editorHolder = document.createElement('div');
    this.nodes.editorHolder.classList.add(CSS.editor);
    this.nodes.editorHolder.addEventListener('keydown', this.onNestedKeydown);
    this.nodes.contentWrapper.appendChild(this.nodes.editorHolder);

    this.nodes.wrapper.appendChild(this.nodes.imageWrapper);
    this.nodes.wrapper.appendChild(this.nodes.contentWrapper);

    this.updateImagePreview();
    this.initializeNestedEditor();

    return this.nodes.wrapper;
  }

  async save() {
    const nestedData = await this.saveNestedEditor();

    return {
      blocks: nestedData.blocks || [],
      image: this.data.image,
    };
  }

  validate(savedData) {
    if (!savedData) return false;

    const hasBlocks = Array.isArray(savedData.blocks) && savedData.blocks.length > 0;
    const hasImage = Boolean(savedData.image);

    return hasBlocks || hasImage;
  }

  destroy() {
    if (this.nodes.imageArea && this.uploader) {
      this.nodes.imageArea.removeEventListener('click', this.onImageAreaClick);
      this.nodes.imageArea.removeEventListener('keydown', this.onImageAreaKeydown);
    }

    if (this.nodes.editorHolder) {
      this.nodes.editorHolder.removeEventListener('keydown', this.onNestedKeydown);
    }

    if (this.nestedEditor && this.nestedEditor.destroy) {
      this.nestedEditor.destroy();
    }
    this.nestedEditor = null;
  }

  initializeNestedEditor() {
    if (this.nestedEditor) return;

    this.nestedEditor = new EditorJS({
      holder: this.nodes.editorHolder,
      data: this.data.blocks && this.data.blocks.length > 0 ? { blocks: this.data.blocks } : undefined,
      minHeight: 0,
      inlineToolbar: true,
      logLevel: 'ERROR',
      readOnly: false,
      placeholder: this.translate(I18N_KEYS.contentPlaceholder),
      tools: this.getNestedTools(),
      onChange: this.onNestedChange,
    });
  }

  async saveNestedEditor() {
    if (!this.nestedEditor || !this.nestedEditor.save) {
      return { blocks: this.data.blocks };
    }

    try {
      const result = await this.nestedEditor.save();
      this.data.blocks = result.blocks || [];
      return result;
    } catch (error) {
      window.console.warn('quote-nested: unable to save nested editor', error);
      return { blocks: this.data.blocks };
    }
  }

  getNestedTools() {
    if (this.config.nestedTools && Object.keys(this.config.nestedTools).length > 0) {
      return this.config.nestedTools;
    }

    return FALLBACK_NESTED_TOOLS;
  }

  onNestedChange() {
    this.block.dispatchChange();
  }

  onNestedKeydown(event) {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.stopPropagation();
  }

  onImageUpload(response) {
    if (!response || response.success !== 1) {
      return;
    }

    this.data.image = response.file;
    this.updateImagePreview();
    this.block.dispatchChange();
  }

  onImageUploadError(error) {
    window.console.warn('quote-nested: image upload failed', error);
  }

  onImageAreaClick(event) {
    event.preventDefault();
    this.openImageUploader();
  }

  onImageAreaKeydown(event) {
    if (!['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    this.openImageUploader();
  }

  openImageUploader() {
    if (!this.uploader) return;

    this.uploader.uploadSelectedFile({
      onPreview: (url) => {
        if (!this.nodes.imageArea || !this.nodes.imageIcon) return;
        this.nodes.imageArea.style.backgroundImage = `url('${url}')`;
        this.nodes.imageArea.classList.add(CSS.imageAreaFilled);
        this.nodes.imageIcon.classList.add(CSS.imageIconHidden);
      },
    });
  }

  clearImage() {
    if (!this.data.image) return;

    this.data.image = null;
    this.updateImagePreview();
    this.block.dispatchChange();
  }

  updateImagePreview() {
    if (!this.nodes.imageArea || !this.nodes.imageIcon) return;

    if (this.data.image && this.data.image.url) {
      const previewUrl = this.getPreviewUrl(this.data.image.url);
      this.nodes.imageArea.style.backgroundImage = `url('${previewUrl}')`;
      this.nodes.imageArea.classList.add(CSS.imageAreaFilled);
      this.nodes.imageIcon.classList.add(CSS.imageIconHidden);
      this.nodes.removeButton?.removeAttribute('disabled');
    } else {
      this.nodes.imageArea.style.backgroundImage = '';
      this.nodes.imageArea.classList.remove(CSS.imageAreaFilled);
      this.nodes.imageIcon.classList.remove(CSS.imageIconHidden);
      this.nodes.removeButton?.setAttribute('disabled', 'true');
    }
  }

  getPreviewUrl(url) {
    if (this.config.uploader && typeof this.config.uploader.addTokenToURL === 'function') {
      return `${this.config.uploader.addTokenToURL(url)}&key=system-medium-cover`;
    }

    return url;
  }

  translate(key) {
    if (this.api && this.api.i18n && typeof this.api.i18n.t === 'function') {
      return this.api.i18n.t(key);
    }

    return key;
  }
}
