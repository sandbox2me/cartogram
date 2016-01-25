function InteractiveApp(cartogram) {
    this.cartogram = cartogram;
    this.scene = cartogram.getDefaultScene();

    this.selectedItems = [];
    this.previousItems = [];

    this.groupCount = 0;

    this.bindCartogramEvents();

    _.bindAll(
        this,
        'handleDrag'
    );

    $('.js-big-group').on('click', this.addBigGroup.bind(this));
    $('.js-small-group').on('click', this.addSmallGroup.bind(this));
    $('.js-22-group').on('click', this.add22Group.bind(this));
    $('.js-circle').on('click', this.addCircle.bind(this));
    $('.js-square').on('click', this.addSquare.bind(this));
}

InteractiveApp.prototype = {
    GroupShapes: [
        {
            type: 'PointCircle',
            name: 'primary',
            radius: 20,
            position: { x: 0, y: 0, z: 0 },
            fill: { r: 1.0, g: 0, b: 0 },
            hitMask: true
        },
        {
            type: 'Rectangle',
            name: 'rectLeft',
            position: { x: -6, y: 0, z: 0 },
            size: {
                width: 12,
                height: 17
            },
            fill: { r: 1, g: 1, b: 1 },
            angle: -32
        },
        {
            type: 'Rectangle',
            name: 'rectRight',
            position: { x: 6, y: -3, z: 0 },
            size: {
                width: 12,
                height: 10
            },
            fill: { r: 1, g: 1, b: 1 }
        }
    ],

    CircleActors: [
        {
            name: 'circleActor',
            position: { x: 0, y: 0, z: 0 },
            shapes: [
                {
                    type: 'PointCircle',
                    name: 'primary',
                    radius: 50,
                    position: { x: 0, y: 0, z: 0 },
                    fill: { r: 1.0, g: 0, b: 0, a: 0.5},
                    stroke: { r: 1.0, g: 0.3, b: 0.3 },
                    strokeWidth: 0.1,
                    hitMask: true
                }
            ]
        }
    ],

    SquareActors: [
        {
            name: 'squareActor',
            position: { x: 0, y: 0, z: 0 },
            shapes: [
                {
                    type: 'Rectangle',
                    name: 'primary',
                    size: {
                        width: 75,
                        height: 75
                    },
                    position: { x: 0, y: 0, z: 0 },
                    fill: { r: 1.0, g: 0, b: 0 },
                }
            ]
        }
    ],

    SmallGroupActors: function() {
        return [
            {
                name: 'actor1',
                position: { x: -50, y: 0, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor2',
                position: { x: 0, y: 0, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor3',
                position: { x: 50, y: 0, z: 0 },
                shapes: this.GroupShapes
            }
        ];
    },

    BigGroupActors: function() {
        return [
            {
                name: 'actor1',
                position: { x: -50, y: 50, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor2',
                position: { x: 0, y: 50, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor3',
                position: { x: 50, y: 50, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor4',
                position: { x: -50, y: 0, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor5',
                position: { x: 0, y: 0, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor6',
                position: { x: 50, y: 0, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor7',
                position: { x: -50, y: -50, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor8',
                position: { x: 0, y: -50, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor9',
                position: { x: 50, y: -50, z: 0 },
                shapes: this.GroupShapes
            }
        ];
    },

    TwoByTwoActors: function() {
        return [
            {
                name: 'actor1',
                position: { x: -25, y: 25, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor2',
                position: { x: 25, y: 25, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor3',
                position: { x: -25, y: -25, z: 0 },
                shapes: this.GroupShapes
            },
            {
                name: 'actor4',
                position: { x: 25, y: -25, z: 0 },
                shapes: this.GroupShapes
            },
        ]
    },

    bindCartogramEvents: function() {
        var cameraController = this.scene.state.get('cameraController');

        this.scene.on('mousedown', function(e, scene) {
            var intersections = scene.actorsAtScreenPosition({ x: e.clientX, y: e.clientY });

            if (intersections.length) {
                cameraController.lock();
                if (this.selectedItems.indexOf(intersections[0]) > -1 ) {
                    this.selectedItems = _.without(this.selectedItems, intersections[0]);
                    this.previousItems.push(intersections[0]);
                } else {
                    this.selectedItems.push(intersections[0]);

                    this._dragStart = scene.screenToWorldPosition({ x: e.clientX, y: e.clientY });
                    this._dragEnd = scene.screenToWorldPosition({ x: e.clientX, y: e.clientY });
                    scene.on('mousemove', this.handleDrag);
                }
                // this._selectedItemsUpdated = false;

            } else {
                this.previousItems = [].concat(this.selectedItems);
                this.selectedItems = [];
            }

            this.refreshPropertiesList();
        }.bind(this));

        this.scene.on('mouseup', function(e, scene) {
            cameraController.unlock();

            if (this.selectedItems.length) {
                this._dragEnd = this._dragStart = undefined;

                scene.off('mousemove', this.handleDrag);
            }
        }.bind(this));
    },

    handleDrag(e, scene) {
        this._dragEnd = scene.screenToWorldPosition({ x: e.clientX, y: e.clientY });
    },

    getCoordinates: function() {
        var screenSize = this.scene.state.get('core').get('size');

        return this.scene.screenToWorldPosition({ x: screenSize.width / 2, y: screenSize.height / 2 });
    },

    addBigGroup: function(e) {
        e.preventDefault();

        var coordinates = this.getCoordinates();

        this.scene.addGroup({
            name: 'group' + this.groupCount++,
            position: { x: coordinates.x, y: coordinates.y, z: 0 },
            rotateChildren: true,
            actors: this.BigGroupActors()
        });
    },

    addSmallGroup: function(e) {
        e.preventDefault();

        var coordinates = this.getCoordinates();

        this.scene.addGroup({
            name: 'group' + this.groupCount++,
            position: { x: coordinates.x, y: coordinates.y, z: 0 },
            rotateChildren: false,
            actors: this.SmallGroupActors()
        });
    },

    add22Group: function(e) {
        e.preventDefault();

        var coordinates = this.getCoordinates();

        this.scene.addGroup({
            name: 'group' + this.groupCount++,
            position: { x: coordinates.x, y: coordinates.y, z: 0 },
            actors: this.TwoByTwoActors()
        });
    },

    addCircle: function(e) {
        e.preventDefault();

        var coordinates = this.getCoordinates();

        this.scene.addGroup({
            name: 'group' + this.groupCount++,
            position: { x: coordinates.x, y: coordinates.y, z: 0 },
            actors: this.CircleActors
        });
    },

    addSquare: function(e) {
        e.preventDefault();

        var coordinates = this.getCoordinates();

        this.scene.addGroup({
            name: 'group' + this.groupCount++,
            position: { x: coordinates.x, y: coordinates.y, z: 0 },
            angle: 5,
            actors: this.SquareActors
        });
    },

    update: function() {
        if (this.selectedItems.length && !this._selectedItemsUpdated) {
            this.selectedItems.forEach(function(actorPath) {
                this.scene.actorAtPath(actorPath).set('primary', {
                    fill: { r: 0, g: 1, b: 0 }
                });
            }.bind(this));
            // this._selectedItemsUpdated = true;

            if (this._dragEnd && this._dragStart && !_.isEqual(this._dragEnd,this._dragStart)) {
                var vector = {
                    x: this._dragEnd.x - this._dragStart.x,
                    y: this._dragEnd.y - this._dragStart.y,
                    z: 0
                };
                this._dragStart = _.clone(this._dragEnd);

                this.selectedItems.forEach(function(actorPath) {
                    this.scene.groupAtPath(actorPath).translate(vector);
                }.bind(this));
            }
        }
        if (this.previousItems.length) {
            this.previousItems.forEach(function(actorPath) {
                this.scene.actorAtPath(actorPath).set('primary', {
                    fill: { r: 1, g: 0, b: 0 }
                });
            }.bind(this));
            this.previousItems = [];
        }
    },

    refreshPropertiesList: function() {
        var $list = $('#properties .selection');

        $list.html('');

        if (!this.selectedItems.length) {
            return;
        }

        $list.append('<p><a href="#" class="js-delete-all">Delete Selection</a></p>');
        $list.find('.js-delete-all').on('click', this.deleteAll.bind(this));

        this.selectedItems.forEach(function(item) {
            var listItem = $('<li>' + item + '</li>');

            listItem.data('actor', item);
            listItem.append($('<p><a href="#" class="js-rotate-group">Rotate Group</a></p>'));
            listItem.append($('<p><a href="#" class="js-delete-item">Delete</a></p>'));
            listItem.append($('<p><a href="#" class="js-delete-group">Delete Group</a></p>'));

            listItem.find('.js-rotate-group').on('click', this.rotateGroup.bind(this));
            listItem.find('.js-delete-item').on('click', this.deleteItem.bind(this));
            listItem.find('.js-delete-group').on('click', this.deleteGroup.bind(this));

            $list.append(listItem);
        }.bind(this));
    },

    rotateGroup: function(e) {
        e.preventDefault();

        var angle = window.prompt('New angle');
        var actorPath = $(e.target).parents('li').data('actor');
        this.scene.groupAtPath(actorPath).rotate(window.parseInt(angle, 10));
    },

    deleteItem: function(e) {
        e.preventDefault();

        var actorPath = $(e.target).parents('li').data('actor');
        var actor = this.scene.actorAtPath(actorPath);

        actor.destroy();
        this.selectedItems = _.without(this.selectedItems, actorPath);
        this.refreshPropertiesList();
    },

    deleteGroup: function(e) {
        e.preventDefault();

        var actor = $(e.target).parents('li').data('actor');
        var group = this.scene.groupAtPath(actor);

        group.destroy();
        this.selectedItems = _.without(this.selectedItems, actor);
        this.refreshPropertiesList();
    },

    deleteAll: function(e) {
        e.preventDefault();

        this.selectedItems.forEach(function(actor) {
            var group = this.scene.groupAtPath(actor);
            group.destroy();
        });
        this.selectedItems = [];
        this.refreshPropertiesList();
    }
};
