import _ from 'lodash';
import Font from './font';

class Text {
    constructor(shapes, rtree, sceneState) {
        this._fontCache = {};
        this.addShapes(shapes, sceneState);
    }

    updateAttributesAtIndex(index) {
        let font = index.split(':')[0];

        this._fontCache[font].updateAttributesAtIndex(index);
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
