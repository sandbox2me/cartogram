import _ from 'lodash';

export default class Path {
    constructor(scene) {
        this.scene = scene;
    }

    ls(path='/') {
        let segments = path.split('/');
        let groupObjects = this.scene.state.get('groupObjects');
        let paths = []

        if (path === '/') {
            paths = groupObjects.map(group => `/${ group.name }`).toArray();
        } else {
            if (segments.length == 2 || (segments.length == 3 && segments[2] == '')) {
                let group = groupObjects.get(path);

                paths = Object.keys(group.actors).map(actor => `${ path }/${ actor }`);
            } else if (segments.length == 3 && segments[2] != '') {
                let group = groupObjects.get(`/${ segments[1] }`);
                paths = Object.keys(group.actors[segments[2]].children).map(child => `${ path }/${ child }`);
            }
        }

        return paths;
    }

    cp(src, dest) {

    }

    rm(path) {

    }

    cat(path) {
        let segments = path.replace(/(^\/)|(\/$)/g, '').split('/');
        let groupObjects = this.scene.state.get('groupObjects');

        if (path === '/') {
            // XXX Maybe return high level information about the scene?
            return {};
        }

        if (segments.length == 1) {
            let group = groupObjects.get(path);

            return {
                definition: group.definition,
                layer: group.definition.layer || group._layer,
                position: group.position,
                angle: group.angle,
                bbox: group.bbox,
                aaBBox: group.axisAlignedBBox,
            };
        } else if (segments.length == 2) {
            let group = groupObjects.get(`/${ segments[0] }`);
            let actor = group.actors[segments[1]];

            return {
                definition: actor.definition,
                layer: actor.definition.layer || actor._layer,
                shapeProps: actor.definition.shapeProps,
                position: actor.position,
                angle: actor.angle,
                bbox: group.bbox,
                aaBBox: group.axisAlignedBBox,
                hasHitMask: actor.hasHitMask,
            };
        } else if (segments.length == 3) {
            let group = groupObjects.get(`/${ segments[0] }`);
            let actor = group.actors[segments[1]];

            let shape = _.find(actor.definition.shapes, { name: segments[2] });

            return {
                ...shape,
                threeMesh: _.find(this.scene.threeScenes.default.children, { builderType: shape.type }),
            };
        }

        return {};
    }

    get(path) {

    }
}
