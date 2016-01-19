import { Map } from 'immutable';

import * as Types from '../types';

class Actor {
    constructor(definition) {
        this.hasHitMask = false;
        this.definition = definition;
        this.scene = this.definition.scene;
        this.position = this.definition.position;
        this.types = Map({});
        this.bbox = {};

        this._iterateChildren();
    }

    get path() {
        let segments = [];

        if (this.definition.group) {
            segments.push(this.definition.group.name);
        }
        segments.push(this.definition.name);

        return `/${ segments.join('/') }`;
    }

    getPosition() {
        return this.position;
    }

    checkHitMask(position) {
        return this.hitMaskType.checkIntersection(position);
    }

    _iterateChildren() {
        let actorTypes = {};
        let children = {};
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;

        this.definition.shapes.forEach((shape) => {
            let bbox;
            let type;

            if (!Types[shape.type]) {
                throw new Error(`Shape type "${ shape.type }" not found!`);
            }

            type = new Types[shape.type](shape, this);
            children[shape.name] = type;

            bbox = type.getBBox();

            if (bbox.x < minX) {
                minX = bbox.x;
            }

            if (bbox.x + bbox.width > maxX) {
                maxX = bbox.x + bbox.width;
            }

            if (bbox.y < minY) {
                minY = bbox.y;
            }

            if (bbox.y + bbox.height > maxY) {
                maxY = bbox.y + bbox.height;
            }

            if (!actorTypes[shape.type]) {
                actorTypes[shape.type] = [];
            }

            // I originally destructured shape here, and inserted bbox and type
            // to create a new object. Turns out it's roughly twice as slow to
            // do that, compared to not manipulating the object at all.
            actorTypes[shape.type].push({
                shape,
                bbox,
                type
            });

            if (shape.hitMask) {
                this.hasHitMask = true;
                this.hitMaskType = type;
            }
        });

        this.bbox = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };

        this.types = actorTypes;
        this.children = children;
    }
};

export default Actor;
