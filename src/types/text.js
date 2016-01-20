import _ from 'lodash';

import BaseType from './base';

class Text extends BaseType {
    constructor(shape, actor) {
        if (shape.type !== 'Text') {
            throw new Error(`Type mismatch, expected 'Rectangle' got '${ shape.type }'`);
        }

        super(shape, actor);

        this.calculateChunks();
        this.calculateSize();
    }

    calculateChunks() {
        let font = this.actor.scene.state.get('fonts').get('fonts').get(this.shape.font);
        let chunks = [];
        let x = 0;

        let textureWidth = font.metrics.common.scaleW;
        let textureHeight = font.metrics.common.scaleH;

        if (!font) {
            throw new Error(`Font '${ this.shape.font }' not found`);
        }

        _.each(this.shape.string, (character, index) => {
            console.log(`chunking '${ character }'`)

            let { width, height, xOffset, yOffset, xAdvance } = font.getDimensionsForSize(character, this.shape.size);
            let minX = -(width / 2);
            let minY = height / 2;

            let charX = x - minX;
            let charY = -minY - yOffset;

            let charMetrics = font.metrics.chars[character];
            let charLeft = charMetrics.x / textureWidth;
            let charTop = 1 - charMetrics.y / textureHeight;
            let charTexWidth = charMetrics.width / textureWidth;
            let charTexHeight = charMetrics.height / textureHeight;

            chunks.push({
                character,
                width,
                height,
                x: charX,
                y: charY,
                uv: {
                    x: charLeft,
                    y: charTop,
                    width: charTexWidth,
                    height: charTexHeight
                }
            });

            x += xAdvance; // - xOffset;
        });

        this.chunks = chunks;
    }

    calculateSize() {
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        let i;

        this.chunks.forEach((chunk, i) => {
            let { x, y, width, height } = chunk;

            if (x - width / 2 < minX) {
                minX = x - width / 2;
            }
            if (x + width / 2 > maxX ) {
                maxX = x + width / 2;
            }
            if (y - height / 2 < minY) {
                minY = y - height / 2;
            }
            if (y + height / 2 > maxY ) {
                maxY = y + height / 2;
            }
        });

        if (maxX === -Infinity) {
            debugger
            throw new Error(`Error finding size for string '${ this.shape.string }'`);
        }

        this.size = {
            width: maxX - minX,
            height: maxY - minY
        };
    }

    get bbox() {
        if (!this._bbox) {
            let size = this.size;
            let position = this.position;

            this._bbox = {
                x: position.x - (size.width / 2),
                y: position.y - (size.height / 2),
                width: size.width,
                height: size.height,
            };
        }
        return this._bbox;
    }
};

export default Text;
