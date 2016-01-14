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
        this.objectCount = 0;
        this.shapes.forEach((shape) => { this.objectCount += shape.type.chunks.length; });
    }

    _scales() {
        this.scales = new InstancedBufferAttribute(new Float32Array(this.objectCount * 2), 2);

        this.shapes.forEach((shape, i) => {
            shape.type.chunks.forEach((chunk, j) => {
                this.scales.setXY(i + j, chunk.width, chunk.height);
            });
        });

        this.geometry.addAttribute('scale', this.scales);
    }

    _offset() {
        this.offsets = new InstancedBufferAttribute(new Float32Array(this.objectCount * 3), 3);

        this.shapes.forEach((shape, i) => {
            let position = shape.type.position;
            let bbox = shape.type.bbox;
            shape.type.chunks.forEach((chunk, j) => {
                console.log(i + j, chunk.x * 1.2, chunk.y, this.objectCount);
                this.offsets.setXYZ(i + j, (chunk.x * 3) - position.x - bbox.width / 2, position.y - (-chunk.y) , position.z);
            });
        });

        this.geometry.addAttribute('offset', this.offsets);
    }

    _colors() {
        this.colors = new InstancedBufferAttribute(new Float32Array(this.objectCount * 4), 4);

        this.shapes.forEach((shape, i) => {
            shape.type.chunks.forEach((chunk, j) => {
                this.colors.setXYZW(i + j, 1.0, 1.0, 1.0, 1.0);
            });
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
