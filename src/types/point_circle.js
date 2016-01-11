
class PointCircle {
    constructor(shape, actor) {
        if (shape.type !== 'PointCircle') {
            throw new Error(`Type mismatch, expected 'PointCircle' got '${ shape.type }'`);
        }

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
        if (!this.bbox) {
            let { radius } = this.shape;
            let position = this.position;

            this.bbox = {
                width: radius,
                height: radius,
                x: position.x - (radius / 2),
                y: position.y - (radius / 2)
            };
        }
        return this.bbox;
    }
};

export default PointCircle;
