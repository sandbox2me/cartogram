import _ from 'lodash';
import * as Types from 'types';

class Actor {
    constructor(definition) {
        this.hasHitMask = false;
        this.definition = definition;
        this.group = this.definition.group;
        this.scene = this.definition.scene;
        this.shapeProps = this.definition.shapeProps;
        this._position = this.definition.position;
        this._angle = this.definition.angle || 0;
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

    get position() {
        if (!this.group) {
            return this._position;
        }

        let position = {
            x: this._position.x + this.group.position.x,
            y: this._position.y + this.group.position.y,
            z: this._position.z + this.group.position.z
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

            position.x = newX + this.group.position.x;
            position.y = newY + this.group.position.y;
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

    get bbox() {
        if (!this._bbox) {
            let minX = Infinity,
                maxX = -Infinity,
                minY = Infinity,
                maxY = -Infinity;

            _.values(this.children).forEach((typeInstance) => {
                let bbox = typeInstance.bbox;

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
            });

            this._bbox = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            };
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

        if (_.isEqual(shapeProps, this.shapeProps)) {
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
        position.z = this.position.z;
        this._bbox = undefined;

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
        position.z = this.position.z;
        this._bbox = undefined;

        this.scene.pushChange({
            type: 'actor',
            actor: this,
            position
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
};

export default Actor;
