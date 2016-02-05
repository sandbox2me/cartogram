function addCameraController(controller) {
    return {
        type: 'ADD_CAMERA_CONTROLLER',
        controller
    };
}

function addActor(actor) {
    return {
        type: 'ADD_ACTOR',
        actor
    };
}

function addGroup(group) {
    return {
        type: 'ADD_GROUP',
        group
    };
}

function addGroups(groups) {
    return {
        type: 'ADD_GROUPS',
        groups
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

export default {
    addCameraController,
    addActor,
    addGroup,
    addGroups,
    addActorObjects,
    addGroupObjects,
    removeGroupObjects,
    commitChanges,
    resetUpdates,
    forceRedraw,
};
