import _ from 'lodash';

import BaseType from './base';
import {
    degToRad,
    fixNum,
    isPointInTriangle,
    V2,
} from 'utils/math';

const axisAlignedAngles = [0, 90, 180, 270, 360];

class Rectangle extends BaseType {
    _checkType(shape) {
        if (shape.type !== 'Rectangle') {
            throw new Error(`Type mismatch, expected 'Rectangle' got '${ shape.type }'`);
        }
    }

    get size() {
        return this.get('size');
    }

    get fill() {
        return this.get('fill');
    }

    _bboxFromPosition(position) {
        let { size } = this;

        return {
            x: position.x - (size.width / 2),
            y: position.y - (size.height / 2),
            x2: position.x + (size.width / 2),
            y2: position.y + (size.height / 2),
            width: size.width,
            height: size.height,
        };
    }

    get shapeBBox() {
        if (!this._shapeBBox || !this.actor._bbox) {
            this._shapeBBox = this._bboxFromPosition(this.position);
        }
        return this._shapeBBox;
    }

    get originBBox() {
        if (!this._originBBox || !this.actor._BBox) {
            this._originBBox = this._bboxFromPosition(this.originPosition);
        }
        return this._originBBox;
    }

    // Generate a bounding box that fits the rotated rectangle
    get axisAlignedBBox() {
        if (axisAlignedAngles.indexOf(this.angle) > -1) {
            return this.shapeBBox;
        }

        if (!this._bbox || !this.actor._bbox) {
            let { position } = this;
            let bbox = { ...this.shapeBBox };
            let angle = degToRad(this.actor.angle);

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

            // Using fixNum throughout the rest of this function because floating point
            // math with JavaScript is not to be trusted. Decreasing chances for errors
            // by reducing the precision to 3 places.
            this._bbox = {
                x: fixNum(position.x - (width / 2)),
                y: fixNum(position.y - (height / 2)),
                x2: fixNum(position.x + (width / 2)),
                y2: fixNum(position.y + (height / 2)),
                width: fixNum(width),
                height: fixNum(height),
            };

            // XXX There's an offset for some reason. A smarter person than I will figure it out,
            // probably a year or two from now. I'm trying to ship this, so here's an offset for
            // no apparent reason. (2015-03-25)
            let offset = {
                x: fixNum(this._bbox.x - minX),
                y: fixNum(this._bbox.y - minY)
            };

            this._bbox.corners = [
                new V2(fixNum(topLeft.x + offset.x), fixNum(topLeft.y + offset.y)),
                new V2(fixNum(topRight.x + offset.x), fixNum(topRight.y + offset.y)),
                new V2(fixNum(bottomLeft.x + offset.x), fixNum(bottomLeft.y + offset.y)),
                new V2(fixNum(bottomRight.x + offset.x), fixNum(bottomRight.y + offset.y)),
            ];
        }

        return this._bbox;
    }

    /**
     * If a rectangle is rotated we must do some calculations to determine whether the given position
     * is actually intersecting with the box.
     *
     * * Determine the location of all 4 corners after rotation (cos - sin)
     * * Generate an axis-aligned bounding box that encompasses the rotated bounds
     * * Collect the vertices making up the 4 triangles that now surround the box
     * * Cross-product check each triangle to see where the input position is within each.
     * * If none of the triangles contain the input position, then we're actually over the box
     *
     * * (Optimization) Determine which triangle the input position is likely to be
     *                  and check that one only, by splitting the bounding box into 4.
     *
     */
    checkIntersection(position) {
        if (axisAlignedAngles.indexOf(this.angle) > -1) {
            return true;
        }

        // get the rotated bounding box
        let bbox = this.axisAlignedBBox;

        // extract the corner verts
        let corners = [
            new V2(
                bbox.x,
                bbox.y,
            ),
            new V2(
                bbox.x2,
                bbox.y,
            ),
            new V2(
                bbox.x,
                bbox.y2,
            ),
            new V2(
                bbox.x2,
                bbox.y2,
            ),
        ];

        // Get the 4 corner triangles as vertices
        let triangles = corners.map((corner) => {
            let { x, y } = corner;

            return [
                corner,
                _.find(bbox.corners, { x }),
                _.find(bbox.corners, { y }),
            ];
        });

        let point = new V2(position.x, position.y);
        let isIntersecting = triangles.map(
            (triangle) => isPointInTriangle(point, triangle)
        ).indexOf(true) === -1;

        return isIntersecting;
    }
};

export default Rectangle;
