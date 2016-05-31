import { degToRad } from 'utils/math';

class BaseType {
    constructor(shape, actor) {
        this._checkType(shape);

        this.actor = actor;
        this.shape = shape;
        this._index = -1;
    }

    _checkType(shape) {
        throw new Error('_checkType has not been implemented');
    }

    update(properties) {
        this.shape = properties;
        this._bbox = undefined;
    }

    get(property) {
        let value = this.shape[property];

        if (typeof value === 'string' && value.indexOf('$') === 0) {
            // Variable property, ask the actor for it
            let propKey = value.substr(1);
            let shapeProp = this.actor.definition.shapeProps[propKey];

            if (shapeProp !== undefined) {
                value = shapeProp;
            }
        }

        return value;
    }

    get path() {
        return `${ this.actor.path }/${ this.shape.name }`;
    }

    _generatePosition(origin) {
        return {
            x: this.get('position').x + origin.x,
            y: this.get('position').y + origin.y,
            z: origin.z,
        };
    }

    get originPosition() {
        return this._generatePosition(this.actor.originPosition);
    }

    get position() {
        return this._generatePosition(this.actor.position);
    }

    get angle() {
        if (this.get('rotate') === false) {
            // Forced rotation off on this shape
            return 0;
        }

        return degToRad((-1 * this.get('angle') || 0) + this.actor.angle);
    }

    // Global index for this object
    setIndex(index) {
        this._index = index;
    }

    get index() {
        return this._index;
    }

    get shapeBBox() {
        throw new Error('getBBox not implemented');
    }

    get axisAlignedBBox() {
        return this.shapeBBox;
    }

    get originBBox() {
        return this.shapeBBox;
    }

    checkIntersection(position) {
        throw new Error('checkIntersection not implemented');
    }
};

export default BaseType;
