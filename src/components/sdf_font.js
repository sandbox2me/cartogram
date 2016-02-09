import { Texture, TextureLoader } from 'three';
import { scene as sceneActions } from 'actions';

const loader = new TextureLoader();

export default class SDFFont {
    constructor(dispatch, name, definition, texture) {
        this._dispatch = dispatch;
        this.name = name;
        this.test = definition.test;
        this.metrics = definition.metrics;
        this.texture = new Texture();
        this._textureURI = texture;

        this._loadTexture();
    }

    _loadTexture() {
        loader.load(
            this._textureURI,
            (texture) => {
                this.texture = texture;

                this._dispatch(sceneActions.forceRedraw());
            }
        );
    }

    canUseFor(str) {
        return this.test.test(str);
    }

    getDimensionsForSize(character, size) {
        let heightRatio = this.metrics.chars[character].height / this.metrics.info.size,
            widthRatio = this.metrics.chars[character].width / this.metrics.info.size,
            xAdvanceRatio = this.metrics.chars[character].xadvance / this.metrics.info.size,
            xOffsetRatio = this.metrics.chars[character].xoffset / this.metrics.info.size,
            yOffsetRatio = this.metrics.chars[character].yoffset / this.metrics.info.size;

        return {
            height: heightRatio * size,
            width: widthRatio * size,
            xAdvance: xAdvanceRatio * size,
            xOffset: xOffsetRatio * size,
            yOffset: yOffsetRatio * size
        };
    }
}
