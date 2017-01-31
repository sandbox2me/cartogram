import Rectangle from './rectangle';


class TextureRectangle extends Rectangle {
    _checkType(shape) {
        if (shape.type !== 'TextureRectangle') {
            throw new Error(`Type mismatch, expected 'TextureRectangle' got '${ shape.type }'`);
        }
    }

    get textureOffset() {
        return this.get('textureOffset');
    }

    get textureMultiplier() {
        return this.get('multiplier');
    }
};

export default TextureRectangle;
