import BaseType from './base';

class Circle extends BaseType {
    constructor(shape, actor) {
        if (shape.type !== 'Circle') {
            throw new Error(`Type mismatch, expected 'Circle' got '${ shape.type }'`);
        }

        super(shape, actor);
    }

    get size() {
        let radius = this.radius;

        if (!this._size || radius !== this._size.width) {
            this._size = {
                width: radius,
                height: radius,
            };
        }

        return this._size;
    }

    get radius() {
        return this.get('radius');
    }

    get bbox() {
        if (!this._bbox) {
            let size = this.size;
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
