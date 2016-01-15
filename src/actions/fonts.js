import { Texture, TextureLoader } from 'three';

const loader = new TextureLoader();

class SDFFont {
    constructor(name, definition, texture) {
        this.name = name;
        this.test = definition.test;
        this.metrics = definition.metrics;
        this.texture = texture;
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

function registerWithData(name, fontDef) {
    return (dispatch) => {
        let img = new Image();
        img.src = fontDef.dataURI;

        dispatch(registerSync(
            name,
            new SDFFont(
                name,
                fontDef,
                new Texture(img)
            )
        ));
    };
}

function registerWithImage(name, fontDef) {
    return (dispatch) => {
        dispatch(registerSync(
            name,
            new SDFFont(
                name,
                fontDef,
                new Texture(fontDef.image)
            )
        ));
    };
}

function registerWithTexture(name, fontDef) {
    return (dispatch) => {
        dispatch(registerSync(
            name,
            new SDFFont(
                name,
                fontDef,
                fontDef.texture
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
    registerWithData,
    registerWithImage,
    registerWithTexture
};
