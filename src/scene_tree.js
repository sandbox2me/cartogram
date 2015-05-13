define(function(require) {
    'use strict';

    var rbush = require('rbush'),
        SceneTree;

    SceneTree = function(picasso, includeShape, maxNodeFill) {
        this.maxNodeFill = maxNodeFill || 10;
        this.includeShape = (includeShape === false) ? false : true;

        this.picasso = picasso;
        this.sceneList = [];

        this.tree = rbush(this.maxNodeFill);
    };

    SceneTree.prototype = {
        _RTreeDataForShape: function(shape) {
            var bbox = shape.getBBox(),
                data = [
                    bbox.x,
                    bbox.y,
                    bbox.x2,
                    bbox.y2
                ];

            if (this.includeShape) {
                data.push({ shape: shape });
            }

            return data;
        },

        insert: function(shape) {
            this.tree.insert(this._RTreeDataForShape(shape));
            this.sceneList.push(shape);

            return this;
        },

        insertSet: function(set) {
            var i,
                length,
                child;

            for (i = 0, length = set.children.length; i < length; i++) {
                child = set.children[i];

                if (child.children) {
                    this.insertSet(child);
                } else {
                    this.insert(child);
                }
            }
        },

        remove: function(shape) {
            this.tree.remove(this._RTreeDataForShape(shape));

            return this;
        },

        clear: function() {
            this.tree.clear();
        },

        search: function(bbox) {
            return this.tree.search([
                bbox.x,
                bbox.y,
                bbox.x2,
                bbox.y2
            ]);
        },

        searchPoint: function(point) {
            return this.search({
                x: point.x,
                y: point.y,
                x2: point.x + 1,
                y2: point.y + 1
            });
        },

        toJSON: function() {
            return this.tree.toJSON();
        },

        getSize: function() {
            var width = this.tree.data.bbox[2] - this.tree.data.bbox[0],
                height = this.tree.data.bbox[3] - this.tree.data.bbox[1];

            return {
                width: width,
                height: height
            };
        },

        getCenter: function() {
            var size = this.getSize(),
                bbox = this.tree.toJSON().bbox;

            return {
                x: bbox[0] + (size.width / 2),
                y: -(bbox[1] + (size.height / 2))
            };
        }
    };

    return SceneTree;
});
