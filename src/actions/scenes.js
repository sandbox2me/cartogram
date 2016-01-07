
function create(scene) {
    return {
        type: 'CREATE_SCENE',
        scene
    };
}

function setActive(name) {
    return {
        type: 'SET_ACTIVE_SCENE',
        name
    };
}

export default {
    create,
    setActive,
};
