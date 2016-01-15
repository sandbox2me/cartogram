import {
    BufferAttribute,
    InstancedBufferAttribute,
    InstancedBufferGeometry,
    Mesh,
    MeshBasicMaterial,
    RawShaderMaterial,
    Vector4,
    DoubleSide,
} from 'three';

// What is text other than a whole bunch of little rectangles next to each other?
import Rectangle from './rectangle';

import vertexShader from 'shaders/instanced_text_vertex.glsl';
import fragmentShader from 'shaders/instanced_text_fragment.glsl';


class Text extends Rectangle {
    initialize() {
        this.font = this.sceneState.get('fonts').get('fonts').get(this.shapes[0].shape.font);

        this.parseStrings();
        this._constructVertices();

        this._attributes();
    }

    parseStrings() {
        this.objectCount = 0;
        this.shapes.forEach((shape) => { this.objectCount += shape.type.chunks.length; });
    }

    _attributes() {
        this.scales = new InstancedBufferAttribute(new Float32Array(this.objectCount * 2), 2);
        this.fontSizes = new InstancedBufferAttribute(new Float32Array(this.objectCount), 1);
        this.offsets = new InstancedBufferAttribute(new Float32Array(this.objectCount * 3), 3);
        this.colors = new InstancedBufferAttribute(new Float32Array(this.objectCount * 4), 4);
        this.texOffsets = new InstancedBufferAttribute(new Float32Array(this.objectCount * 4), 4);

        this.shapes.forEach((shape, i) => {
            let { position, bbox } = shape.type;
            let { size, fill } = shape.shape;

            shape.type.chunks.forEach((chunk, j) => {
                let index = i + j;

                // Resize character
                this.scales.setXY(index, chunk.width, chunk.height);

                // Pass in font size
                this.fontSizes.setX(index, size);

                // Position character
                // console.log(index, chunk.x * 1.2, chunk.y, this.objectCount);
                this.offsets.setXYZ(index, chunk.x - bbox.width / 2 - position.x, chunk.y + bbox.height / 2 + position.y, position.z);

                // Color character
                this.colors.setXYZW(index, fill.r, fill.g, fill.b, 1.0);

                // Character texture UV offsets
                this.texOffsets.setXYZW(index, chunk.uv.x, chunk.uv.y, chunk.uv.width, chunk.uv.height);
            });
        });

        this.geometry.addAttribute('scale', this.scales);
        this.geometry.addAttribute('fontSize', this.fontSizes);
        this.geometry.addAttribute('offset', this.offsets);
        this.geometry.addAttribute('color', this.colors);
        this.geometry.addAttribute('texOffset', this.texOffsets);
    }

    get vertexShader() {
        return vertexShader;
    }

    get fragmentShader() {
        return fragmentShader;
    }

    get material() {
        if (!this._material) {
            // debugger
            this._material = new RawShaderMaterial({
                uniforms: {
                    uSampler: {
                        type: 't',
                        value: this.font.texture
                    },
                    uTexSize: {
                        type: 'v2',
                        value: { x: this.font.metrics.common.scaleW, y: this.font.metrics.common.scaleH }
                    },
                    uMaxZoom: {
                        type: 'f',
                        value: 100, //maxZoom
                    },
                    uMaxSmoothing: {
                        type: 'f',
                        value: 8.0, //maxSmoothing
                    },
                    uMinSmoothing: {
                        type: 'f',
                        value: 1.0, //minSmoothing
                    }
                },
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
                side: DoubleSide,
                transparent: true
            });
        }

        return this._material;
    }
}

export default Text;
