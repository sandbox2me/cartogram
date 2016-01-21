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

    translate(position) {}

    moveTo(position) {}

    rotate(angle) {}
}

export default Group;
