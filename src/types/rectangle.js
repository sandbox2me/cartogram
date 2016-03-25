import _ from 'lodash';

import BaseType from './base';
import { degToRad } from 'utils/math';

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

    get baseBBox() {
        if (!this._bbbox || !this.actor._bbox) {
            let { position, size } = this;

            this._bbbox = {
                x: position.x - (size.width / 2),
                y: position.y - (size.height / 2),
                x2: position.x + (size.width / 2),
                y2: position.y + (size.height / 2),
                width: size.width,
                height: size.height,
            };
        }
        return this._bbbox;
    }

    // Generate a bounding box that fits the rotated rectangle
    // get rotatedBBox() {
    get bbox() {
        if (!this._bbox || !this.actor._bbox) {
            let { position } = this;
            let bbox = { ...this.baseBBox };
            let angle = degToRad(-this.actor.angle);

            let angleCos = Math.cos(angle);
            let angleSin = Math.sin(angle);


            let topLeft = {
                x: (bbox.x * angleCos) - (bbox.y * angleSin),
                y: (bbox.x * angleSin) + (bbox.y * angleCos),
            };
            let topRight = {
                x: (bbox.x2 * angleCos) - (bbox.y * angleSin),
                y: (bbox.x2 * angleSin) + (bbox.y * angleCos),
            };
            let bottomLeft = {
                x: (bbox.x * angleCos) - (bbox.y2 * angleSin),
                y: (bbox.x * angleSin) + (bbox.y2 * angleCos),
            };
            let bottomRight = {
                x: (bbox.x2 * angleCos) - (bbox.y2 * angleSin),
                y: (bbox.x2 * angleSin) + (bbox.y2 * angleCos),
            };

            let minX = _.min([topLeft.x, topRight.x, bottomLeft.x, bottomRight.x]);
            let maxX = _.max([topLeft.x, topRight.x, bottomLeft.x, bottomRight.x]);
            let minY = _.min([topLeft.y, topRight.y, bottomLeft.y, bottomRight.y]);
            let maxY = _.max([topLeft.y, topRight.y, bottomLeft.y, bottomRight.y]);

            let width = maxX - minX;
            let height = maxY - minY;

            this._bbox = {
                x: position.x - (width / 2),
                y: position.y - (height / 2),
                x2: position.x + (width / 2),
                y2: position.y + (height / 2),
                width: width,
                height: height,
            };

            // console.log('bounding boxes', this.baseBBox, position, topLeft, topRight, bottomLeft, bottomRight, this._bbox, '----')
        }
        return this._bbox;
    }

    checkIntersection(position) {
        return true;
    }
};

export default Rectangle;
