import _ from 'lodash';
import Font from './font';

class Text {
    constructor(shapes, rtree, sceneState) {
        this._fontCache = {};
        this.addShapes(shapes, sceneState);
    }

    updateAttributesAtIndex(index) {
        let splitIndex = index.split(':');
        let fontName = splitIndex[0];
        let font = this._fontCache[fontName];
        let shapeTypeInstance = font.shapes[splitIndex[1]];

        if (shapeTypeInstance.hasChangedString()) {
            // Recalculate and re-render the string
            font.removeShapes([shapeTypeInstance], font.sceneState);

            shapeTypeInstance.calculate();
            font.addShapes([shapeTypeInstance], font.sceneState);
        } else {
            font.updateAttributesAtIndex(index);
        }

    }

    _buildShapeFontMap(shapes) {
        let shapeFontMap = {};

        shapes.forEach((shape) => {
            let font = shape.font;

            if (!shapeFontMap[font]) {
                shapeFontMap[font] = [];
            }
            shapeFontMap[font].push(shape);
        });

        return shapeFontMap;
    }

    addShapes(shapes, sceneState) {
        let shapeFontMap = this._buildShapeFontMap(shapes);

        _.forEach(shapeFontMap, (shapes, font) => {
            if (!(font in this._fontCache)) {
                this._fontCache[font] = new Font(shapes, null, sceneState);
            } else {
                this._fontCache[font].addShapes(shapes, sceneState);
            }
        });
    }

    removeShapes(shapes, sceneState) {
        let shapeFontMap = this._buildShapeFontMap(shapes);

        _.forEach(shapeFontMap, (shapes, font) => {
            this._fontCache[font].removeShapes(shapes, sceneState);
        });
    }

    get mesh() {
        let meshes = [];

        _.forEach(this._fontCache, (font) => meshes.push(...font.mesh));

        return meshes;
    }
}

export default Text;
