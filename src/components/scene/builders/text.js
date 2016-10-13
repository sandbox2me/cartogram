import _ from 'lodash';
import Font from './font';

class Text {
    constructor(shapes, rtree, sceneState) {
        this._fontCache = {};
        this._sceneState = sceneState;
        this.addShapes(shapes, sceneState);
    }

    updateAttributesAtIndex(index, _sourceShapeTypeInstance) {
        let splitIndex = index.split(':');
        let fontName = splitIndex[0];
        let font = this._fontCache[fontName];

        if (!font) {
            font = this.addShapesToFont(_sourceShapeTypeInstance.font, [_sourceShapeTypeInstance], this._sceneState);
        }
        let shapeTypeInstance = font.shapes[splitIndex[1]];

        if (!shapeTypeInstance) {
            console.warn(`Text at index ${index} not found. Returning.`);
            return;
        }


        if (shapeTypeInstance.hasChangedString()) {
            // Recalculate and re-render the string
            font.removeShapes([shapeTypeInstance], font.sceneState);

            shapeTypeInstance.calculate();


            // Check if the font changed
            if (shapeTypeInstance.font !== fontName) {
                fontName = shapeTypeInstance.font;
            }
            this.addShapesToFont(fontName, [shapeTypeInstance], font.sceneState);

            // font.addShapes([shapeTypeInstance], font.sceneState);
        } else {
            font.updateAttributesAtIndex(index);
        }

    }

    shapesToTop(fontIndexes) {
        let groupedByFont = {};

        fontIndexes.forEach((fontIndex) => {
            let [fontName, index] = fontIndex.split(':');

            if (!groupedByFont[fontName]) {
                groupedByFont[fontName] = [];
            }
            groupedByFont[fontName].push(index);
        });

        _.forEach(groupedByFont, (indexes, fontName) => {
            this._fontCache[fontName].shapesToTop(indexes);
        });
    }

    reindex() {
        _.forEach(this._fontCache, (font) => font.reindex());
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

    addShapesToFont(fontName, shapes, sceneState) {
        if (!(fontName in this._fontCache)) {
            this._fontCache[fontName] = new Font(shapes, null, sceneState);
        } else {
            this._fontCache[fontName].addShapes(shapes, sceneState);
        }
        return this._fontCache[fontName];
    }

    addShapes(shapes, sceneState) {
        let shapeFontMap = this._buildShapeFontMap(shapes);

        _.forEach(shapeFontMap, (shapes, font) => this.addShapesToFont(font, shapes, sceneState));
    }

    removeShapes(shapes, sceneState) {
        let shapeFontMap = this._buildShapeFontMap(shapes);

        _.forEach(shapeFontMap, (shapes, font) => {
            this._fontCache[font].removeShapes(shapes, sceneState);
        });
    }

    yankShapes(fontIndexes) {
        let groupedByFont = {};

        fontIndexes.forEach((fontIndex) => {
            let [fontName, index] = fontIndex.split(':');

            if (!groupedByFont[fontName]) {
                groupedByFont[fontName] = [];
            }
            groupedByFont[fontName].push(Number(index));
        });

        let shapes = _.reduce(
            groupedByFont,
            (shapes, indexes, fontName) => shapes.concat(this._fontCache[fontName].yankShapes(indexes)),
            []
        );

        return shapes;
    }

    get mesh() {
        let meshes = [];

        _.forEach(this._fontCache, (font) => meshes.push(...font.mesh));

        return _.compact(meshes);
    }
}

export default Text;
