import _ from 'lodash';

class EventBus {
    constructor() {
        this.events = {};
    }

    on(ev, callback, context) {
        var events;

        this.events = this.events || {};

        events = this.events[ev] || [];

        events.push([callback, context]);
        this.events[ev] = events;

        return this;
    }

    off(ev, callback, context) {
        var index;

        if (!this.events) {
            return;
        }

        if (!this.events[ev]) {
            return;
        }

        if (callback === undefined) {
            delete this.events[ev];
        } else {
            index = this.events[ev].indexOf([callback, context]);
            if (index > -1) {
                this.events[ev].splice(index, 1);
                this.events[ev] = _.compact(this.events[ev]);
            }
        }

        return this;
    }

    trigger(ev) {
        var i, length;

        if (!this.events) {
            return;
        }

        if (ev in this.events) {
            for (i = 0, length = this.events[ev].length; i < length; i++) {
                this.events[ev][i][0].apply(
                    this.events[ev][i][1] || this,
                    Array.prototype.slice.call(arguments, 1)
                );
            }
        }
    }
}

export default EventBus;
