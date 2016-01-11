import { Map } from 'immutable';

import * as Types from '../types';

class Actor {
    constructor(definition) {
        this.definition = definition;
        this.position = this.definition.position;
        this.types = Map({});
        this.bbox = {};

        this._iterateChildren();
    }

    getPosition() {
        return this.position;
    }

    _iterateChildren() {
        let actorTypes = {};
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
        });

        this.bbox = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };

        this.types = Map(actorTypes);
    }
};

export default Actor;
