import { Map } from 'immutable';

import * as Types from '../types';

class Actor {
    constructor(definition) {
        this.definition = definition;
        this.types = Map({});
        this.bbox = {};

        this._iterateChildren();
    }

    _iterateChildren() {
        let actorTypes = {};
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;

        this.definition.shapes.forEach((shape) => {

            let bbox;
            let type = new Types[shape.type](shape);

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
            actorTypes[shape.type].push((Object.assign(
                {},
                shape,
                {
                    bbox,
                    typeObject: type
                }
            )));
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
