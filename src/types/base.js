
class BaseType {
    constructor(shape, actor) {
        this.actor = actor;
        this.shape = shape;
    }

    get path() {
        return `${ this.actor.path }/${ this.shape.name }`;
    }

    get position() {
        return {
            x: this.shape.position.x + this.actor.getPosition().x,
            y: this.shape.position.y + this.actor.getPosition().y,
            z: this.shape.position.z + this.actor.getPosition().z,
        };
    }

    // Global index for this object
    setIndex(index) {
        this._index = index;
    }

    get index() {
        return this._index;
    }

    getBBox() {
        throw new Error('getBBox not implemented');
    }

    checkIntersection(position) {
        throw new Error('checkIntersection not implemented');
    }
};

export default BaseType;
