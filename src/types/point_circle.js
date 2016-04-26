import BaseType from './base';

class PointCircle extends BaseType {
    _checkType(shape) {
        if (shape.type !== 'PointCircle') {
            throw new Error(`Type mismatch, expected 'PointCircle' got '${ shape.type }'`);
        }
    }

    get size() {
        if (!this._size || this.radius !== this._size.width) {
            this._size = {
                width: this.radius * 2,
                height: this.radius * 2,
            };
        }

        return this._size;
    }

    get radius() {
        return this.get('radius');
    }

    get radiusSq() {
        let radius = this.radius;
        return radius * radius;
    }

    get shapeBBox() {
        if (!this._shapeBBox || !this.actor._bbox) {
            let { radius, position } = this;

            this._shapeBBox = {
                width: radius * 2,
                height: radius * 2,
                x: position.x - radius,
                y: position.y - radius
            };
        }
        return this._shapeBBox;
    }

    get fill() {
        return this.get('fill');
    }

    get stroke() {
        let stroke = this.get('stroke');
        if (stroke && this.get('strokeWidth') > 0.001) {
            return stroke;
        } else {
            return this.fill;
        }
    }

    get strokeWidth() {
        return this.get('strokeWidth') || 0.001;
    }

    checkIntersection(position) {
        let shapePosition = this.position;
        let x = (shapePosition.x - position.x);
        let y = (shapePosition.y - position.y);

        return (x * x) + (y * y) < this.radiusSq;
    }
};

export default PointCircle;
