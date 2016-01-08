
function updateMaxZoom(maxZoom) {
    return {
        type: 'UPDATE_MAX_ZOOM',
        maxZoom
    };
}

function updateMinZoom(minZoom) {
    return {
        type: 'UPDATE_MIN_ZOOM',
        minZoom
    };
}

function updateCurrentZoom(zoom) {
    return {
        type: 'UPDATE_CURRENT_ZOOM',
        zoom
    };
}

function updatePosition(position) {
    return {
        type: 'UPDATE_POSITION',
        position
    };
}

export default {
    updateMaxZoom,
    updateMinZoom,
    updateCurrentZoom,
    updatePosition
};
