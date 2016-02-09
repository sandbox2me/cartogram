import { Texture, TextureLoader } from 'three';

import { scene as sceneActions } from './index';

const loader = new TextureLoader();

class SDFFont {
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

function registerAsync(name, fontDef) {
    throw new Error('registerAsync is not fully implemented!');

    return (dispatch) => {
        loader.load(fontDef.textureUrl, (texture) => {
            dispatch(registerSync(name, new SDFFont(name, fontDef, texture)));
        }, undefined, (xhr) => {
            throw new Error(`Error loading texture '${ fontDef.textureUrl }': ${ xhr }`);
        });
    };
}

function registerWithURI(name, fontDef) {
    return (dispatch) => {
        let img = new Image();
        img.src = fontDef.dataURI;

        dispatch(registerSync(
            name,
            new SDFFont(
                dispatch,
                name,
                fontDef,
                fontDef.uri
            )
        ));
    };
}

function registerSync(name, font) {
    return {
        type: 'REGISTER_FONT',
        name,
        font
    };
}

export default {
    registerAsync,
    registerWithURI
};
