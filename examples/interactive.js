function InteractiveApp(cartogram) {
    this.cartogram = cartogram;
    this.scene = cartogram.getDefaultScene();

    this.groupCount = 0;

    this.bindCartogramEvents();

    $('.js-big-group').on('click', this.addBigGroup.bind(this));
    $('.js-small-group').on('click', this.addSmallGroup.bind(this));
    $('.js-circle').on('click', this.addCircle.bind(this));
    $('.js-square').on('click', this.addSquare.bind(this));
}

InteractiveApp.prototype = {
    GroupShapes: [
        {
            type: 'PointCircle',
            name: 'circle',
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
            fill: { r: 1, g: 1, b: 1 }
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
            name: 'actor1',
            position: { x: 0, y: 0, z: 0 },
            shapes: [
                {
                    type: 'PointCircle',
                    name: 'circle',
                    radius: 50,
                    position: { x: 0, y: 0, z: 0 },
                    fill: { r: 1.0, g: 0, b: 0 },
                    hitMask: true
                }
            ]
        }
    ],

    SquareActors: [
        {
            name: 'actor1',
            position: { x: 0, y: 0, z: 0 },
            shapes: [
                {
                    type: 'Rectangle',
                    name: 'square',
                    size: {
                        width: 75,
                        height: 75
                    },
                    position: { x: 0, y: 0, z: 0 },
                    fill: { r: 1.0, g: 0, b: 0 }
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

    bindCartogramEvents: function() {
    },

    addBigGroup: function(e) {
        e.preventDefault();

        this.scene.addGroup({
            name: 'group' + this.groupCount++,
            position: { x: 0, y: 0, z: 0 },
            actors: this.BigGroupActors()
        });
    },

    addSmallGroup: function(e) {
        e.preventDefault();

        this.scene.addGroup({
            name: 'group' + this.groupCount++,
            position: { x: 0, y: 0, z: 0 },
            actors: this.SmallGroupActors()
        });
    },

    addCircle: function(e) {
        e.preventDefault();

        this.scene.addGroup({
            name: 'group' + this.groupCount++,
            position: { x: 0, y: 0, z: 0 },
            actors: this.CircleActors
        });
    },

    addSquare: function(e) {
        e.preventDefault();

        this.scene.addGroup({
            name: 'group' + this.groupCount++,
            position: { x: 0, y: 0, z: 0 },
            actors: this.SquareActors
        });
    }
};
