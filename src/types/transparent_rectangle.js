import Rectangle from './rectangle';

export default class TransparentRectangle extends Rectangle {
    _checkType(shape) {
        if (shape.type !== 'TransparentRectangle') {
            throw new Error(`Type mismatch, expected 'TransparentRectangle' got '${ shape.type }'`);
        }
    }

}
