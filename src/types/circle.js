import BaseType from './base';

class Circle extends BaseType {
    _checkType(shape) {
        if (shape.type !== 'Circle') {
            throw new Error(`Type mismatch, expected 'Circle' got '${ shape.type }'`);
        }
    }

    get size() {
        let radius = this.radius;
        console.log(radius);
        // if (!radius) {
        //     return this.get('size');
        // }

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

    get shapeBBox() {
        if (!this._shapeBBox) {
            let size = this.size;
            let position = this.position;

            this._shapeBBox = {
                x: position.x - (size.width / 2),
                y: position.y - (size.height / 2),
                width: size.width,
                height: size.height,
            };
        }
        return this._shapeBBox;
    }
};

export default Circle;
