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

    get position() {
        let actorPosition = this.actor.position;

        return {
            x: this.get('position').x + actorPosition.x,
            y: this.get('position').y + actorPosition.y,
            z: actorPosition.z,
        };
    }

    get angle() {
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

    checkIntersection(position) {
        throw new Error('checkIntersection not implemented');
    }
};

export default BaseType;
