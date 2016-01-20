import BaseType from './base';

class Circle extends BaseType {
    constructor(shape, actor) {
        if (shape.type !== 'Circle') {
            throw new Error(`Type mismatch, expected 'Circle' got '${ shape.type }'`);
        }

        super(shape, actor);
    }

    get size() {
        if (!this._size || this.type.radius !== this._size.width) {
            this._size = {
                width: this.type.radius,
                height: this.type.radius,
            };
        }

        return this._size;
    }

    get bbox() {
        if (!this._bbox) {
            let { size } = this.shape;
            let position = this.position;

            this._bbox = {
                x: position.x - (size.width / 2),
                y: position.y - (size.height / 2),
                width: size.width,
                height: size.height,
            };
        }
        return this._bbox;
    }
};

export default Circle;
