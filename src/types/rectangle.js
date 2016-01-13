import { PlaneGeometry } from 'three';

import BaseType from './base';

let sharedGeometry = new PlaneGeometry(10, 10);

class Rectangle extends BaseType {
    constructor(shape, actor) {
        if (shape.type !== 'Rectangle') {
            throw new Error(`Type mismatch, expected 'Rectangle' got '${ shape.type }'`);
        }

        super(shape, actor);
    }

    getBBox() {
        if (!this.bbox) {
            let { size } = this.shape;
            let position = this.position;

            this.bbox = {
                x: position.x - (size.width / 2),
                y: position.y - (size.height / 2),
                width: size.width,
                height: size.height,
            };
        }
        return this.bbox;
    }

    getGeometry() {
        return sharedGeometry;
    }
};

export default Rectangle;
