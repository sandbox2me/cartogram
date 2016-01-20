import BaseType from './base';

class PointCircle extends BaseType {
    constructor(shape, actor) {
        if (shape.type !== 'PointCircle') {
            throw new Error(`Type mismatch, expected 'PointCircle' got '${ shape.type }'`);
        }

        super(shape, actor);

        // Pre-calculate square for point intersection checks
        this.shape.radiusSq = this.shape.radius * this.shape.radius;
    }

    get size() {
        if (!this._size || this.shape.type.radius !== this._size.width) {
            this._size = {
                width: this.shape.radius * 2,
                height: this.shape.radius * 2,
            };
        }

        return this._size;
    }

    getBBox() {
        if (!this.bbox) {
            let { radius } = this.shape;
            let position = this.position;

            this.bbox = {
                width: radius * 2,
                height: radius * 2,
                x: position.x - radius,
                y: position.y - radius
            };
        }
        return this.bbox;
    }

    checkIntersection(position) {
        let shapePosition = this.position;
        let x = (shapePosition.x - position.x);
        let y = (shapePosition.y - position.y);

        return (x * x) + (y * y) < this.shape.radiusSq;
    }
};

export default PointCircle;
