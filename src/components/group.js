import _ from 'lodash';
import { degToRad } from 'utils/math';

class Group {
    constructor(definition) {
        this.definition = definition;
        this.name = this.definition.name;
        this.scene = this.definition.scene;
        this._position = this.definition.position;
        this.actors = {};
        this.actorList = [];
    }

    get path() {
        return `/${ this.definition.name }`;
    }

    get bbox() {
        if (!this._bbox) {
            let minX = Infinity,
                maxX = -Infinity,
                minY = Infinity,
                maxY = -Infinity;

            _.values(this.actorList).forEach((actorObject) => {
                let bbox = actorObject.bbox;

                if (bbox.x < minX) {
                    minX = bbox.x;
                }

                if (bbox.x + bbox.width > maxX) {
                    maxX = bbox.x + bbox.width;
                }

                if (bbox.y < minY) {
                    minY = bbox.y;
                }

                if (bbox.y + bbox.height > maxY) {
                    maxY = bbox.y + bbox.height;
                }
            });

            this._bbox = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            };
        }
        return this._bbox;
    }

    get position() {
        return this.definition.position;
    }

    addActorObject(actor) {
        this.actors[actor.name] = actor;
        this.actorList.push(actor);
        this._bbox = undefined;
    }

    removeActorObject(actor) {
        delete this.actors[actor.name];
        this.actorList = _.without(this.actorList, actor);
        this._bbox = undefined;
    }

    updateShapes(shapeName, properties) {
        this.actorList.forEach((actor) => {
            actor.set(shapeName, properties);
        });
    }

    translate(position) {
        this._bbox = undefined;

        this.scene.pushChange({
            type: 'group',
            group: this,
            data: {
                position: {
                    x: position.x + this.position.x,
                    y: position.y + this.position.y,
                    z: (position.z || 0) + this.position.z,
                }
            }
        });
    }

    moveTo(position) {
        position.z = this.position.z;
        this._bbox = undefined;

        this.scene.pushChange({
            type: 'group',
            group: this,
            action: 'update',
            data: {
                position: {
                    x: position.x,
                    y: position.y,
                    z: (position.z || 0) + this.position.z,
                }
            }
        });
    }

    rotateCCW(angle) {
        let angleRad = degToRad(angle);

        this._bbox = undefined;

        this.scene.pushChange({
            type: 'group',
            group: this,
            action: 'update',
            data: {
                angle,
                angleRad,
                angleCos: Math.cos(angleRad),
                angleSin: Math.sin(angleRad)
            }
        });
    }

    rotate(angle) {
        this.rotateCCW(angle * -1);
    }

    destroy() {
        this.scene.pushChange({
            type: 'group',
            group: this,
            action: 'destroy'
        });
    }
}

export default Group;
