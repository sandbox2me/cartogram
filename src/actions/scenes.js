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

export default {
    addCameraController,
    addActor,
    addGroup,
};
