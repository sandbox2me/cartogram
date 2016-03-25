import _ from 'lodash';

import BaseType from './base';
import { degToRad, V2, isPointInTriangle } from 'utils/math';

function fixNum(n, fix=3) {
    return Number(n.toFixed(fix));
}

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
                { x: fixNum(topLeft.x + offset.x), y: fixNum(topLeft.y + offset.y) },
                { x: fixNum(topRight.x + offset.x), y: fixNum(topRight.y + offset.y) },
                { x: fixNum(bottomLeft.x + offset.x), y: fixNum(bottomLeft.y + offset.y) },
                { x: fixNum(bottomRight.x + offset.x), y: fixNum(bottomRight.y + offset.y) },
            ];

            // console.log('bounding boxes', this.baseBBox, position, topLeft, topRight, bottomLeft, bottomRight, offset, this._bbox, '----')
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
     * * (Optimization) Determine which triangle the input position is likely to be
     *                  and check that one only, by splitting the bounding box into 4.
     *
     */
    checkIntersection(position) {
        if (!this.angle) {
            return true;
        }
        // get the rotated bounding box
        let bbox = this.bbox;

        // extract the corner verts
        let corners = [
            {
                n: 'top-left',
                x: bbox.x,
                y: bbox.y,
            },
            {
                n: 'top-right',
                x: bbox.x2,
                y: bbox.y,
            },
            {
                n: 'bottom-left',
                x: bbox.x,
                y: bbox.y2,
            },
            {
                n: 'bottom-right',
                x: bbox.x2,
                y: bbox.y2,
            }
        ];

        // Get the 4 corner triangles as vertices
        let triangles = corners.map((corner) => {
            let {x, y} = corner;

            let vertexY = _.find(bbox.corners, { x });
            let vertexX = _.find(bbox.corners, { y });

            // Order vertices clockwise
            switch(corner.n) {
                case 'top-left':
                    return [
                        new V2(corner.x, corner.y),
                        new V2(vertexX.x, vertexX.y),
                        new V2(vertexY.x, vertexY.y),
                    ];
                case 'top-right':
                    return [
                        new V2(corner.x, corner.y),
                        new V2(vertexY.x, vertexY.y),
                        new V2(vertexX.x, vertexX.y),
                    ];
                case 'bottom-left':
                    return [
                        new V2(corner.x, corner.y),
                        new V2(vertexX.x, vertexX.y),
                        new V2(vertexY.x, vertexY.y),
                    ];
                case 'bottom-right':
                    return [
                        new V2(corner.x, corner.y),
                        new V2(vertexY.x, vertexY.y),
                        new V2(vertexX.x, vertexX.y),
                    ];
            }

        });

        let point = new V2(position.x, position.y);
        let intersectionChecks = triangles.map((triangle) => {
            return isPointInTriangle(point, triangle);
        });
        let isIntersecting = intersectionChecks.indexOf(true) === -1;
        console.log('is intersecting: ', isIntersecting, intersectionChecks);

        return isIntersecting;
    }
};

export default Rectangle;
