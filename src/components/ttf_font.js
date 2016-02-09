import { LinearFilter, RGBAFormat, Texture } from 'three';
import Font from './font';
import FontMetrics from 'utils/font_metrics';

const TEXTURE_SIZE = 2048;
const DEFAULT_SIZE = 48;
const SPACER = 10;

export default class TTFont extends Font {
    constructor(name, fontface, options={}) {
        super();

        this.name = name;
        this.fontface = fontface;
        this.options = options;
        this.isTTF = true;

        this._initializeTexture();
        this._initializeData();
    }

    _initializeData() {
        this._fontMetrics = new FontMetrics(this.fontface, { testText: this.options.testText });
        this.metrics = {
            chars: {},
            info: {
                size: DEFAULT_SIZE,
                metrics: this._fontMetrics.getMetricsForFontSize(DEFAULT_SIZE)
            },
            common: {
                scaleW: TEXTURE_SIZE,
                scaleH: TEXTURE_SIZE
            }
        };

        this._cacheX = SPACER;
        this._cacheY = SPACER;
    }

    _initializeTexture() {
        this.canvas = document.createElement('canvas');

        this.canvas.width = TEXTURE_SIZE;
        this.canvas.height = TEXTURE_SIZE;

        this.texture = this._textureFromCanvas();

        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'black';
    }

    _textureFromCanvas() {
        let texture = new Texture(this.canvas);

        texture.premultipliedAlpha = false;
        // Probably want to enable mip maps actually
        texture.generateMipmaps = false;
        texture.magFilter = LinearFilter;
        texture.minFilter = LinearFilter;
        texture.format = RGBAFormat;
        texture.needsUpdate = true;

        return texture;
    }

    getDimensionsForSize(character, size) {
        // Is character in cache?
        if (!(character in this.metrics.chars)) {
            this.addCharacter(character);
        }

        return super.getDimensionsForSize(character, size);
    }

    addCharacter(character) {
        let font = `${ this.metrics.info.size }px '${ this.fontface}'`;
        let { metrics } = this.metrics.info;

        this.ctx.font = font;

        let width = this.ctx.measureText(character).width;
        let height = metrics.lineHeight;

        if (this._cacheX + width + SPACER > TEXTURE_SIZE) {
            this._cacheX = SPACER;
            this._cacheY += metrics.lineHeight + SPACER;
        }

        if (this._cacheY + metrics.lineHeight + SPACER > TEXTURE_SIZE) {
            // XXX Not sure if this should ever happen, maybe if every
            // Unicode character is used in a scene?
            throw new Error(`TTF texture for "${ this.fontface }" out of space!`);
        }

        this.ctx.fillText(character, this._cacheX, this._cacheY);

        this.texture.needsUpdate = true;

        this.metrics.chars[character] = {
            width,
            height,
            xoffset: 0,
            yoffset: 0,
            xadvance: width,
            x: this._cacheX,
            y: this._cacheY
        };
    }
}
