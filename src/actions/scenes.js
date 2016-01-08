
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
};
