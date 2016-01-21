class Group {
    constructor(definition) {
        this.definition = definition;
        this.scene = this.definition.scene;
        this.position = this.definition.position;
        this.actors = {};
        this.actorList = [];
    }

    get path() {
        return `/${ this.definition.name }`;
    }

    get bbox() {

    }

    addActor(actor) {
        this.actors[actor.name] = actor;
        this.actorList.push(actor);
    }

    removeActor(actor) {}

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
            position: {
                x: position.x + this.position.x,
                y: position.y + this.position.y,
                z: (position.z || 0) + this.position.z,
            }
        });
    }

    moveTo(position) {
        position.z = this.position.z;
        this._bbox = undefined;

        this.scene.pushChange({
            type: 'group',
            group: this,
            position: {
                x: position.x,
                y: position.y,
                z: (position.z || 0) + this.position.z,
            }
        });
    }

    rotate(angle) {}
}

export default Group;
