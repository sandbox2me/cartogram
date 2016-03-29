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

    _generateBBoxes() {
        let bboxForType = (bboxType) => {
            let minX = Infinity,
                maxX = -Infinity,
                minY = Infinity,
                maxY = -Infinity,
                bbox = {};

            this.actorList.forEach((actorObject) => {
                let childBBox = actorObject[bboxType];

                if (childBBox.x < minX) {
                    minX = childBBox.x;
                }

                if (childBBox.x2 > maxX) {
                    maxX = childBBox.x2;
                }

                if (childBBox.y < minY) {
                    minY = childBBox.y;
                }

                if (childBBox.y2 > maxY) {
                    maxY = childBBox.y2;
                }
            });

            bbox = {
                x: minX,
                y: minY,
                x2: maxX,
                y2: maxY,
                width: maxX - minX,
                height: maxY - minY
            };

            return bbox;
        }

        this._aaBBox = bboxForType('axisAlignedBBox');
        this._bbox = bboxForType('bbox');
    }

    get axisAlignedBBox() {
        if (!this._aaBBox || !this._bbox) {
            this._generateBBoxes();
        }

        return this._aaBBox;
    }

    get bbox() {
        if (!this._aaBBox || !this._bbox) {
            this._generateBBoxes();
        }

        return this._bbox;
    }

    get position() {
        return {
            x: this.definition.position.x,
            y: this.definition.position.y,
            z: this.scene.getLayerValue(this.definition.layer)
        };
    }

    get angle() {
        return this.definition.angle;
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

        console.log({
            x: position.x + this.position.x,
            y: position.y + this.position.y,
        })

        this.scene.pushChange({
            type: 'group',
            group: this,
            data: {
                position: {
                    x: position.x + this.position.x,
                    y: position.y + this.position.y,
                }
            }
        });
    }

    moveTo(position) {
        this._bbox = undefined;

        this.scene.pushChange({
            type: 'group',
            group: this,
            action: 'update',
            data: {
                position: {
                    x: position.x,
                    y: position.y,
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
