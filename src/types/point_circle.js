
class PointCircle {
    constructor(shape) {
        if (shape.type !== 'PointCircle') {
            throw new Error(`Type mismatch, expected 'PointCircle' got '${ shape.type }'`);
        }

        this.shape = shape;
    }

    getBBox() {
        if (!this.bbox) {
            let { radius, position } = this.shape;
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
