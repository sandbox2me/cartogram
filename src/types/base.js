
class BaseType {
    constructor(shape, actor) {
        this.actor = actor;
        this.shape = shape;
    }

    get position() {
        return {
            x: this.shape.position.x + this.actor.getPosition().x,
            y: this.shape.position.y + this.actor.getPosition().y,
            z: this.shape.position.z + this.actor.getPosition().z,
        };
    }

    getBBox() {
        throw new Error('getBBox not implemented');
    }
};

export default BaseType;
