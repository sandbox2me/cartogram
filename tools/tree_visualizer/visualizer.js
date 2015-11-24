function Visualizer(canvas) {
    this.canvas = $(canvas)[0];
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    $('#generate').on('click', this.generateMap.bind(this));
}

Visualizer.prototype = {
    leafColors: [
        '#9aeeee',
        '#9aeed8',
        '#9aeeaa',
        '#9aee9a',
        '#9aee77',
        '#9aee49',
        '#9aee21',
        '#9aee00'
    ],
    generateMap: function() {
        this.mapJSON = JSON.parse(document.getElementById('treeSrc').value);
        this.frame = {
            x: 0,
            y: 0,
            width: this.mapJSON.bbox[2] - this.mapJSON.bbox[0],
            height: this.mapJSON.bbox[3] - this.mapJSON.bbox[1]
        };
        this.center = {
            x: this.frame.width / 2,
            y: this.frame.height / 2
        };
        this.origin = {
            x: this.mapJSON.bbox[0],
            y: this.mapJSON.bbox[1]
        };

        this.scaleX = 1;
        this.scaleY = 1;

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.strokeRect(
            this.frame.x,
            this.frame.y,
            this.frame.width * this.scaleX,
            this.frame.height * this.scaleY
        );


        // this.ctx.strokeRect(0, 0, 1, 1);
        // this.ctx.strokeRect(this.center.x, this.center.y, 1, 1);
        // this.ctx.strokeRect(this.center.x - 10, this.center.y - 10, 20, 20);

        console.log(this.mapJSON.bbox, this.frame)
        this.drawChildren(this.mapJSON.children);

        // var aspect = this.frame.width / this.frame.height;
        // if (aspect < 0) {
        //     // tall
        //     this.xScale = 0;
        //     this.yScale = 1;
        // } else {
        //     // wide
        //     this.xScale = 1;
        //     this.yScale = this.frame.height / this.canvas.height;
        // }
    },

    drawChildren: function(children) {
        _.each(children, function(child) {
            var x = -139,
                y = -10,
                x2 = 10,
                y2 = 10;

            var frame = {
                x: child.bbox[0] - this.origin.x,
                y: child.bbox[1] - this.origin.y,
                width: child.bbox[2] - child.bbox[0],
                height: child.bbox[3] - child.bbox[1]
            };

            this.ctx.strokeStyle = 'red';
            this.ctx.strokeRect(
                frame.x,
                frame.y,
                frame.width,
                frame.height
            );

            if (child.leaf) {
                _.each(child.children, function(leaf, i) {
                    this.ctx.strokeStyle = this.leafColors[i];
                    this.ctx.strokeRect(
                        leaf[0] - this.origin.x,
                        leaf[1] - this.origin.y,
                        leaf[2] - leaf[0],
                        leaf[3] - leaf[1]
                    );
                }.bind(this))
            } else {
                this.drawChildren(child);
            }
        }.bind(this));
    }
};
