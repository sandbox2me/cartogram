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
        this.children = {};

        this.iterateChildren();
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

    iterateChildren() {
        let actorTypes = {};
        let children = {};
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;

        this.definition.shapes.forEach((shape) => {
            let bbox;
            let type;
            let index = -1;

            if (!Types[shape.type]) {
                throw new Error(`Shape type "${ shape.type }" not found!`);
            }

            if (shape.name in this.children) {
                index = this.children[shape.name].type.index;
            }
            type = new Types[shape.type](shape, this);
            type._index = index;

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
            type.actorIndex = actorTypes[shape.type].length;

            let childBundle = {
                shape,
                bbox,
                type
            };
            actorTypes[shape.type].push(childBundle);
            children[shape.name] = childBundle;

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

    set(shapeName, properties) {
        let shape = this.children[shapeName];

        // TODO: Look for variables in the property list and fill them in as necessary

        let updatedProperties = Object.assign({}, shape.shape, properties);

        this.scene.updateShape(shape, updatedProperties);
    }
};

export default Actor;
