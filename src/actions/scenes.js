function addCameraController(controller) {
    return {
        type: 'ADD_CAMERA_CONTROLLER',
        controller
    };
}

function addActorObjects(actorObjects) {
    return {
        type: 'ADD_ACTOR_OBJECTS',
        actorObjects
    };
}

function addGroupObjects(groupObjects) {
    return {
        type: 'ADD_GROUP_OBJECTS',
        groupObjects
    };
}

function removeGroupObjects(groupObjectPaths) {
    return {
        type: 'REMOVE_GROUP_OBJECTS',
        groupObjectPaths
    };
}

function commitChanges(changes) {
    return {
        type: 'COMMIT_CHANGES',
        changes
    };
}

function resetUpdates() {
    return {
        type: 'RESET_UPDATES'
    };
}

function forceRedraw() {
    return {
        type: 'FORCE_REDRAW'
    };
}

function registerLayers(layers) {
    return {
        type: 'REGISTER_LAYERS',
        layers
    };
}

export default {
    addCameraController,
    addActorObjects,
    addGroupObjects,
    removeGroupObjects,
    commitChanges,
    resetUpdates,
    forceRedraw,
    registerLayers,
};
