import TextureRectangle from './texture_rectangle';


class AtlasImage extends TextureRectangle {
    _checkType(shape) {
        if (shape.type !== 'AtlasImage') {
            throw new Error(`Type mismatch, expected 'AtlasImage' got '${ shape.type }'`);
        }
    }

    get textureLocation() {
        return this.get('textureLocation');
    }
};

export default AtlasImage;
