
function register(typedef) {
    return {
        type: 'ADD_TYPE',
        typedef
    };
}

function unregister(typedef) {
    return {
        type: 'REMOVE_TYPE',
        name: typedef.name
    };
}

export default {
    register,
    unregister,
};
