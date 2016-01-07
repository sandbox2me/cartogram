
function updateCameraPosition(position) {
    return {
        type: 'UPDATE_CAMERA_POSITION',
        position
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
    addActor,
    addGroup,
    updateCameraPosition,
};
