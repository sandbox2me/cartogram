import rbush from 'rbush';

class RTree {
    constructor(maxNodeFill = 20) {
        this.tree = rbush(maxNodeFill)
    }

    _dataForShape(shape) {
        let bbox = shape.typeObject.getBBox();

        return [
            bbox.x,
            bbox.y,
            bbox.x + bbox.width,
            bbox.y + bbox.height,
            { shape }
        ];
    }

    insert(shapeType) {


        this.tree.insert(data);

        return this;
    }

    insertShapes(shapes) {
        let bboxes = shapes.map((shape) => {
            return this._dataForShape(shape);
        });

        this.tree.load(bboxes);
    }

    reset() {
        this.tree.clear();
    }
};

export default RTree;
