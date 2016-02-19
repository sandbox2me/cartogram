import _ from 'lodash';
import { degToRad } from 'utils/math';

class Group {
    constructor(definition) {
        this.definition = definition;
        this.name = this.definition.name;
        this.scene = this.definition.scene;
        this._position = this.definition.position;
        this._layer = this.definition.layer || 'default';
        this._events = this.definition.events || {};
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

            this.actorList.forEach((actorObject) => {
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
        return {
            x: this._position.x,
            y: this._position.y,
            z: this.scene.getLayerValue(this._layer)
        };
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

    updateShapeProps(props) {
        this.actorList.forEach((actor) => {
            actor.setShapeProps(props);
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
                    z: (position.z || 0),
                }
            }
        });
    }

    rotate(angle) {
        angle *= -1;
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

    changeLayer(layer) {
        this.scene.pushChange({
            type: 'group',
            group: this,
            action: 'update',
            data: {
                layer
            }
        });
    }

    destroy() {
        this.scene.pushChange({
            type: 'group',
            group: this,
            action: 'destroy'
        });
    }

    trigger(e, data, triggerActors=false) {
        if (e in this._events) {
            this._events[e](this, data);
        }

        if (triggerActors) {
            this.actorList.forEach((actorObject) => {
                actorObject.trigger(e, data);
            });
        }
    }
}

export default Group;
