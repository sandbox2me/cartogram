import _ from 'lodash';

import Rectangle from './rectangle';
import {
    degToRad,
} from 'utils/math';

class Text extends Rectangle {
    constructor(shape, actor) {
        super(shape, actor);
        this.calculate();
    }

    _checkType(shape) {
        if (shape.type !== 'Text') {
            throw new Error(`Type mismatch, expected 'Rectangle' got '${ shape.type }'`);
        }
    }

    calculate() {
        this.calculateChunks();
        this.calculateSize();
    }

    calculateChunks() {
        let fontName = this.font;
        let font = this.actor.scene.state.get('fonts').get('fonts').get(fontName);
        let chunks = [];
        let x = 0;

        let originalFont = this.get('originalFont');
        if (originalFont) {
            fontName = originalFont;
            font = this.actor.scene.state.get('fonts').get('fonts').get(originalFont);
        }

        if (!font.canUseFor(this.string) && font.fallback) {
            let fallback = font.fallback;
            console.log(`can't render string '${ this.string }' with '${fontName}' using fallback ${fallback}`)
            originalFont = fontName;

            font = this.actor.scene.state.get('fonts').get('fonts').get(fallback);
            this.shape = {...this.shape, font: fallback, originalFont };
        } else {
            if (originalFont) {
                // We've reset back to the original font, away from the fallback
                this.shape = {...this.shape, font: originalFont, originalFont: undefined };
                // font =
                console.log(`returning to original font, '${ originalFont }'`)
            }
            console.log(`rendering string '${ this.string }' with '${fontName}'`)
        }

        let textureWidth = font.metrics.common.scaleW;
        let textureHeight = font.metrics.common.scaleH;

        if (!font) {
            throw new Error(`Font '${ this.font }' not found`);
        }

        _.each(this.string, (character, index) => {
            let dimensions = font.getDimensionsForSize(character, this.fontSize);
            let { width, height, xOffset, yOffset, xAdvance } = dimensions;
            let minX = -(width / 2);
            let minY = height / 2;

            yOffset = yOffset || 0;

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
            console.log(chunks, minY, dimensions, { width, height, xOffset, yOffset, xAdvance }, this.fontSize, charMetrics)

            x += xAdvance; // - xOffset;
        });

        this._chunks = chunks;
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
            throw new Error(`Error finding size for string '${ this.string }'`);
        }

        this._size = {
            width: maxX - minX,
            height: maxY - minY
        };
    }

    hasChangedString() {
        return this._string !== this.get('string');
    }

    positionForChunk(chunkIndex) {
        let chunk = this._chunks[chunkIndex];
        let bbox = this.shapeBBox;

        let chunkOrigin = {
            x: -(bbox.width / 2),
            y: (bbox.height / 2),
        };

        let position = {
            x: chunkOrigin.x + chunk.x,
            y: chunkOrigin.y + chunk.y,
        };

        if (this.angle !== 0) {
            let angleCos = Math.cos(this.angle);
            let angleSin = Math.sin(this.angle);

            let { x, y } = position;

            position.x = ((x * angleCos) - (y * angleSin));
            position.y = ((x * angleSin) + (y * angleCos));
        }

        position.x += this.position.x;
        position.y += this.position.y;

        return position;
    }

    get fill() {
        return this.get('fill');
    }

    get fontSize() {
        return this.get('size');
    }

    get font() {
        return this.get('font');
    }

    get string() {
        this._string = this.get('string');
        return this._string;
    }

    get chunks() {
        return this._chunks;
    }

    get size() {
        return this._size;
    }
};

export default Text;
