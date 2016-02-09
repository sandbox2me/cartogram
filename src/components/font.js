export default class Font {
    canUseFor(str) {
        return true;
    }

    getDimensionsForSize(character, size) {
        let heightRatio = this.metrics.chars[character].height / this.metrics.info.size,
            widthRatio = this.metrics.chars[character].width / this.metrics.info.size,
            xAdvanceRatio = this.metrics.chars[character].xadvance / this.metrics.info.size,
            xOffsetRatio = this.metrics.chars[character].xoffset / this.metrics.info.size,
            yOffsetRatio = this.metrics.chars[character].yoffset / this.metrics.info.size;

        return {
            height: heightRatio * size,
            width: widthRatio * size,
            xAdvance: xAdvanceRatio * size,
            xOffset: xOffsetRatio * size,
            yOffset: yOffsetRatio * size
        };
    }
}
