define(function(require) {
    'use strict';

    var _ = require('underscore'),
        AnimationWorker = require('./animation_worker');

    var AnimationManager = function() {
        this.currentAnimations = [];
    };

    AnimationManager.prototype = {
        add: function(options) {
            var worker = new AnimationWorker(options);
            this.currentAnimations.push(worker);

            worker.promise.done(_.bind(this.handleWorkerCompleted, this));
            return worker.promise;
        },

        update: function(delta) {
            if (this.currentAnimations.length) {
                _.invoke(this.currentAnimations, 'update', delta);
            }
        },

        /**
         * Removes animation worker from the list when it completes.
         * @param {AnimationWorker} worker - The completed worker.
         */
        handleWorkerCompleted: function(worker) {
            var index = _.indexOf(this.currentAnimations, worker);
            this.currentAnimations.splice(index, 1);
            _.compact(this.currentAnimations);
        }
    };

    return new AnimationManager();
});
