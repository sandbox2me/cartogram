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
        position.x += this.position.x;
        position.y += this.position.y;
        position.z = this.position.z;
        this._bbox = undefined;

        this.scene.pushChange({
            type: 'group',
            group: this,
            position
        });
    }

    moveTo(position) {
        position.z = this.position.z;
        this._bbox = undefined;

        this.scene.pushChange({
            type: 'group',
            group: this,
            position
        });
    }

    rotate(angle) {}
}

export default Group;
