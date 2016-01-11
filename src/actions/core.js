
function updateScreenSize(size) {
    return {
        type: 'RECEIVE_SIZE',
        size
    };
}

function setRenderer(renderer) {
    return {
        type: 'RECEIVE_RENDERER',
        renderer
    };
}

function setCanvas(canvas) {
    return {
        type: 'RECEIVE_CANVAS',
        canvas
    };
}

export default {
    updateScreenSize,
    setRenderer,
    setCanvas,
};
