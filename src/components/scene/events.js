const DEFAULT_EVENTS = [
    'mouseup',
    'mousedown',
    'mousemove',
    'wheel', // Replaces 'mousewheel'

    'click',
    'dblclick',

    'touchstart',
    'touchend',
    'touchmove'
];

class EventBinder {
    constructor(scene) {
        this.scene = scene;
        this.canvas = scene.state.get('core').get('canvas');

        this._bindEvents();
    }

    _bindEvents() {
        DEFAULT_EVENTS.forEach((eventName) => {
            this.canvas.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.scene.eventBus.trigger(eventName, e, this.scene);
            }, false);
        });
    }
}

export default EventBinder;
