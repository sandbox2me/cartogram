import _ from 'lodash';
import * as Types from 'types';

class Actor {
    constructor(definition, groupObject) {
        this.hasHitMask = false;
        this.definition = definition;
        this.group = this.definition.group;
        this.scene = this.definition.scene;
        this._groupObject = groupObject;

        this._layer = this.definition.layer || 'default';
        this._angle = this.definition.angle || 0;
        this._events = this.definition.events || {};

        this.types = {};
        this.children = {};

        this.iterateChildren();
    }

    get name() {
        return this.definition.name;
    }

    get path() {
        let segments = [];

        if (this.group) {
            segments.push(this.group.name);
        }
        segments.push(this.definition.name);

        return `/${ segments.join('/') }`;
    }

    get _position() {
        return this.definition.position;
    }

    get position() {
        if (!this._groupObject) {
            return this._position;
        }

        let position = {
            x: this._position.x + this.group.position.x,
            y: this._position.y + this.group.position.y,
            z: this.scene.getLayerValue(this._layer) + this._groupObject.position.z
        };

        if (this.group.angle) {
            // Return a value that's been rotated in relation to the group origin
            // XXX Maybe this math can run in vertex shader instead...
            //     Tradeoff would be having more attributes to send
            //     to each instance.
            let x = this._position.x;
            let y = this._position.y;
            let { angleCos, angleSin } = this.group;

            // Rotate clockwise
            let newX = (x * angleCos) - (y * angleSin);
            let newY = ((x * angleSin) + (y * angleCos));

            position.x = newX + this._groupObject.position.x;
            position.y = newY + this._groupObject.position.y;
        }

        return position;
    }

    set position(value) {
        this._position = value;
    }

    get angle() {
        if (this._angle || (this.group && this.group.angle && this.group.rotateChildren)) {
            return this._angle + this.group.angle;
        }
        return 0;
    }

    checkHitMask(position) {
        return this.hitMaskType.checkIntersection(position);
    }

    iterateChildren() {
        let actorTypes = {};
        let children = {};

        this.definition.shapes.forEach((shape) => {
            if (!Types[shape.type]) {
                throw new Error(`Shape type "${ shape.type }" not found!`);
            }

            let typeInstance = new Types[shape.type](shape, this);

            if (!actorTypes[shape.type]) {
                actorTypes[shape.type] = [];
            }

            typeInstance.actorIndex = actorTypes[shape.type].length;

            actorTypes[shape.type].push(typeInstance);
            children[shape.name] = typeInstance;

            if (shape.hitMask) {
                this.hasHitMask = true;
                this.hitMaskType = typeInstance;
            }
        });

        this.types = actorTypes;
        this.children = children;
    }

    updateChild(properties) {
        let typeInstance = this.children[properties.name];
        typeInstance.update(properties);

        this._bbox = undefined;
    }

    _generateBBoxes() {
        let bboxForType = (bboxType) => {
            let minX = Infinity,
                maxX = -Infinity,
                minY = Infinity,
                maxY = -Infinity,
                bbox = {};

            _.values(this.children).forEach((typeInstance) => {
                let childBBox = typeInstance[bboxType];

                if (childBBox.x < minX) {
                    minX = childBBox.x;
                }

                if (childBBox.x + childBBox.width > maxX) {
                    maxX = childBBox.x + childBBox.width;
                }

                if (childBBox.y < minY) {
                    minY = childBBox.y;
                }

                if (childBBox.y + childBBox.height > maxY) {
                    maxY = childBBox.y + childBBox.height;
                }
            });

            bbox = {
                x: minX,
                y: minY,
                x2: maxX,
                y2: maxY,
                width: maxX - minX,
                height: maxY - minY
            };

            return bbox;
        }

        this._aaBBox = bboxForType('axisAlignedBBox');
        this._bbox = bboxForType('shapeBBox');
    }

    // Returns the axis-aligned bounding box for the actor
    get axisAlignedBBox() {
        if (!this._aaBBox || !this._bbox) {
            this._generateBBoxes();
        }

        return this._aaBBox;
    }

    // Returns the bounding box that fits the actor when rotated
    get bbox() {
        if (!this._aaBBox || !this._bbox) {
            this._generateBBoxes();
        }

        return this._bbox;
    }

    set(shapeName, properties) {
        let shape = this.children[shapeName];
        let definitionIndex = this.definition.shapes.indexOf(shape.shape);

        // TODO: Look for variables in the property list and fill them in as necessary

        let updatedProperties = Object.assign({}, shape.shape, properties);

        if (_.isEqual(updatedProperties, shape.shape)) {
            // No-op
            return;
        }

        this.scene.pushChange({
            type: 'shape',
            actor: this,
            index: shape.index,
            definitionIndex,
            properties: updatedProperties
        });
    }

    setShapeProps(props) {
        let shapeProps = Object.assign({}, this.definition.shapeProps, props);

        if (_.isEqual(shapeProps, this.definition.shapeProps)) {
            // No-op
            return;
        }

        this.scene.pushChange({
            type: 'actor',
            actor: this,
            data: {
                shapeProps
            }
        });
    }

    // Relative movement
    translate(position) {
        position.x += this.position.x;
        position.y += this.position.y;
        this._bbox = undefined;

        if (_.isEqual(position, { x: this._position.x, y: this._position.y })) {
            return;
        }

        this.scene.pushChange({
            type: 'actor',
            actor: this,
            data: {
                position
            }
        });
    }

    // Absolute movement
    moveTo(position) {
        this._bbox = undefined;

        if (_.isEqual(position, { x: this._position.x, y: this._position.y })) {
            return;
        }

        this.scene.pushChange({
            type: 'actor',
            actor: this,
            action: 'update',
            data: {
                position
            }
        });
    }

    destroy() {
        this.scene.pushChange({
            type: 'actor',
            actor: this,
            action: 'destroy'
        });
    }

    rotate(angle) {
        angle *= -1;
        let angleRad = degToRad(angle);

        this._bbox = undefined;

        this.scene.pushChange({
            type: 'actor',
            actor: this,
            action: 'update',
            data: {
                angle,
                angleRad,
                angleCos: Math.cos(angleRad),
                angleSin: Math.sin(angleRad)
            }
        });
    }

    changeLayer(layer) {
        this.scene.pushChange({
            type: 'actor',
            actor: this,
            action: 'update',
            data: {
                layer
            }
        });
    }

    trigger(e, data) {
        if (e in this._events) {
            this._events[e](this, data);
        }
    }
};

export default Actor;
