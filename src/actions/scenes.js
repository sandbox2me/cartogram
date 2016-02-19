export default function addCameraController(controller) {
    return {
        type: 'ADD_CAMERA_CONTROLLER',
        controller
    };
}

export default function addActor(actor) {
    return {
        type: 'ADD_ACTOR',
        actor
    };
}

export default function addGroup(group) {
    return {
        type: 'ADD_GROUP',
        group
    };
}

export default function addGroups(groups) {
    return {
        type: 'ADD_GROUPS',
        groups
    };
}

export default function addActorObjects(actorObjects) {
    return {
        type: 'ADD_ACTOR_OBJECTS',
        actorObjects
    };
}

export default function addGroupObjects(groupObjects) {
    return {
        type: 'ADD_GROUP_OBJECTS',
        groupObjects
    };
}

export default function removeGroupObjects(groupObjectPaths) {
    return {
        type: 'REMOVE_GROUP_OBJECTS',
        groupObjectPaths
    };
}

export default function commitChanges(changes) {
    return {
        type: 'COMMIT_CHANGES',
        changes
    };
}

export default function resetUpdates() {
    return {
        type: 'RESET_UPDATES'
    };
}

export default function forceRedraw() {
    return {
        type: 'FORCE_REDRAW'
    };
}

export default function registerLayers(layers) {
    return {
        type: 'REGISTER_LAYERS',
        layers
    };
}
