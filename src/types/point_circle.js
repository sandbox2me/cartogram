import BaseType from './base';

class PointCircle extends BaseType {
    _checkType(shape) {
        if (shape.type !== 'PointCircle') {
            throw new Error(`Type mismatch, expected 'PointCircle' got '${ shape.type }'`);
        }
    }

    get size() {
        if (!this.radius) {
            return this.get('size');
        }

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

    _bboxFromPosition(position) {
        let { width, height } = this.size;

        return {
            width,
            height,
            x: position.x - (width / 2),
            y: position.y - (height / 2)
        }
    }

    get shapeBBox() {
        if (!this._shapeBBox || !this.actor._bbox) {
            this._shapeBBox = this._bboxFromPosition(this.position);
        }
        return this._shapeBBox;
    }

    get originBBox() {
        if (!this._originBBox || !this.actor._bbox) {
            this._originBBox = this._bboxFromPosition(this.originPosition);
        }
        return this._originBBox;
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
        let { width, height } = this.size;
        let shapePosition = this.position;

        // Ellipse equation
        let eHoriz = (position.x - shapePosition.x) / width;
        let eVert = (position.y - shapePosition.y) / height;

        let distance = Math.pow(eHoriz, 2) + Math.pow(eVert, 2);

        return distance < 0.25;
    }
};

export default PointCircle;
