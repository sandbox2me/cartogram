
class BaseType {
    constructor(shape, actor) {
        this.actor = actor;
        this.shape = shape;
        this._index = -1;
    }

    update(properties) {
        this.shape = properties;
        this._bbox = undefined;
    }

    get path() {
        return `${ this.actor.path }/${ this.shape.name }`;
    }

    get position() {
        return {
            x: this.shape.position.x + this.actor.position.x,
            y: this.shape.position.y + this.actor.position.y,
            z: this.shape.position.z + this.actor.position.z,
        };
    }

    // Global index for this object
    setIndex(index) {
        this._index = index;
    }

    get index() {
        return this._index;
    }

    get bbox() {
        throw new Error('getBBox not implemented');
    }

    checkIntersection(position) {
        throw new Error('checkIntersection not implemented');
    }
};

export default BaseType;
