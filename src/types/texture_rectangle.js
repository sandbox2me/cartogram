import Rectangle from './rectangle';


class TextureRectangle extends Rectangle {
    _checkType(shape) {
        if (shape.type !== 'TextureRectangle') {
            throw new Error(`Type mismatch, expected 'TextureRectangle' got '${ shape.type }'`);
        }
    }

    get textureOffset() {
        return {x: 0, y: 0}
    }
};

export default TextureRectangle;
