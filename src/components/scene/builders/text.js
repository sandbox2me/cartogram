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
    initialize() {
        this.font = this.sceneState.get('fonts').get('fonts').get(this.shapes[0].shape.font);

        this.parseStrings();
        this._constructVertices();
        this._constructUVs();

        this._attributes();
    }

    _constructUVs() {
        this.uvs = new BufferAttribute(new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ]), 2);

        this.geometry.addAttribute('uv', this.uvs);

        let fontTextureSize = new BufferAttribute(new Float32Array([
            this.font.metrics.common.scaleW,
            this.font.metrics.common.scaleH
        ]), 2);
        this.geometry.addAttribute('texSize', fontTextureSize);
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

            shape.type.chunks.forEach((chunk, j) => {
                let index = i + j;

                // Resize character
                this.scales.setXY(index, chunk.width, chunk.height);

                // Pass in font size
                this.fontSizes.setX(index, shape.shape.size);

                // Position character
                // console.log(index, chunk.x * 1.2, chunk.y, this.objectCount);
                this.offsets.setXYZ(index, chunk.x - position.x - bbox.width / 2, position.y - (-chunk.y) , position.z);

                // Color character
                this.colors.setXYZW(index, 1.0, 1.0, 1.0, 1.0);

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
            this._material = new RawShaderMaterial({
                uniforms: {
                    uTexSize: {
                        type: 'v2',
                        value: { x: this.font.metrics.common.scaleW, y: this.font.metrics.common.scaleH }
                    },
                    uMaxZoom: {
                        type: 'f',
                        value: maxZoom
                    },
                    uMaxSmoothing: {
                        type: 'f',
                        value: maxSmoothing
                    },
                    uMinSmoothing: {
                        type: 'f',
                        value: minSmoothing
                    }
                },
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
                transparent: true
            });
        }

        return this._material;
    }
}

export default Text;
