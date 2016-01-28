import BaseType from './base';

class Rectangle extends BaseType {
    constructor(shape, actor) {
        if (shape.type !== 'Rectangle') {
            throw new Error(`Type mismatch, expected 'Rectangle' got '${ shape.type }'`);
        }

        super(shape, actor);
    }

    get size() {
        return this.get('size');
    }

    get fill() {
        return this.get('fill');
    }

    get bbox() {
        if (!this._bbox || !this.actor._bbox) {
            let { position, size } = this;

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

export default Rectangle;
