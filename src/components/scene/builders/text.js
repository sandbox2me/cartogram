import {
    BufferAttribute,
    InstancedBufferAttribute,
    InstancedBufferGeometry,
    Mesh,
    RawShaderMaterial,
    Vector4,
} from 'three';

// What is text other than a whole bunch of little rectangles next to each other?
import Rectangle from './rectangle';

import vertexShader from 'shaders/instanced_text_vertex.glsl';
import fragmentShader from 'shaders/instanced_text_fragment.glsl';


class Text extends Rectangle {
    constructor(shapes, font) {
        super(shapes);
        this.font = font;
    }
    initialize() {
        this.parseStrings();
        this._constructVertices();
        this._constructUVs();

        this._offset();
        this._scales();
        this._colors();
    }

    _constructUVs() {
        this.uvs = new BufferAttribute(new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ]), 2);

        this.geometry.addAttribute('uv', this.uvs);
    }

    parseStrings() {
        this.chunkedStrings = {};

        this.shapes.forEach((shape, i) => {
            // let string = shape.shape.te
        });
    }

    _scales() {
        this.scales = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 2), 2);

        this.shapes.forEach((shape, i) => {
            let size = shape.type.size;
            this.scales.setXY(i, size.width, size.height);
        });

        this.geometry.addAttribute('scale', this.scales);
    }

    _colors() {
        this.colors = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 4), 4);

        this.shapes.forEach((shape, i) => {
            this.colors.setXYZW(i, 1.0, 1.0, 1.0, 1.0);
        });

        this.geometry.addAttribute('color', this.colors);
    }

    // get vertexShader() {
    //     return vertexShader;
    // }
    //
    // get fragmentShader() {
    //     return fragmentShader;
    // }
}

export default Text;
