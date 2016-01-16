import BaseType from './base';

class PointCircle extends BaseType {
    constructor(shape, actor) {
        if (shape.type !== 'PointCircle') {
            throw new Error(`Type mismatch, expected 'PointCircle' got '${ shape.type }'`);
        }

        super(shape, actor);
    }

    get size() {
        if (!this._size || this.type.radius !== this._size.width) {
            this._size = {
                width: this.shape.radius,
                height: this.shape.radius,
            };
        }

        return this._size;
    }

    getBBox() {
        if (!this.bbox) {
            let { radius } = this.shape;
            let position = this.position;

            this.bbox = {
                width: radius,
                height: radius,
                x: position.x - (radius / 2),
                y: position.y - (radius / 2)
            };
        }
        return this.bbox;
    }
};

export default PointCircle;
