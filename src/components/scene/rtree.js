import rbush from 'rbush';

class RTree {
    constructor(maxNodeFill = 20) {
        this.tree = rbush(maxNodeFill)
    }

    _dataForShape(shape) {
        let bbox = shape.type.bbox;

        return [
            bbox.x,
            bbox.y,
            bbox.x + bbox.width,
            bbox.y + bbox.height,
            { shape }
        ];
    }

    _dataForActor(actor) {
        let bbox = actor.bbox;

        return [
            bbox.x,
            bbox.y,
            bbox.x + bbox.width,
            bbox.y + bbox.height,
            { actor }
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

    insertActors(actors) {
        console.time('insert actors')
        let bboxes = actors.map((actor) => {
            return this._dataForActor(actor);
        });

        this.tree.load(bboxes);
        console.timeEnd('insert actors')
    }

    reset() {
        this.tree.clear();
    }

    search(bbox) {
        return this.tree.search([
            bbox.x,
            bbox.y,
            bbox.x2,
            bbox.y2
        ]);
    }

    searchPoint(point) {
        return this.search({
            x: point.x,
            y: point.y,
            x2: point.x + 1,
            y2: point.y + 1
        });
    }

    toJSON() {
        return this.tree.toJSON();
    }

    getSize() {
        let width = this.tree.data.bbox[2] - this.tree.data.bbox[0];
        let height = this.tree.data.bbox[3] - this.tree.data.bbox[1];

        return {
            width,
            height
        };
    }

    getCenter() {
        let size = this.getSize();
        let bbox = this.tree.toJSON().bbox;

        return {
            x: bbox[0] + (size.width / 2),
            y: -(bbox[1] + (size.height / 2))
        };
    }
};

export default RTree;
