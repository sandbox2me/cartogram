import {
    BufferAttribute,
    InstancedBufferAttribute,
    InstancedBufferGeometry,
    Mesh,
    MeshBasicMaterial,
    RawShaderMaterial,
    Vector4,
} from 'three';

// What is text other than a whole bunch of little rectangles next to each other?
import Rectangle from './rectangle';

import vertexShader from 'shaders/instanced_text_vertex.glsl';
import fragmentShader from 'shaders/instanced_text_fragment.glsl';


class Text extends Rectangle {
    initializeGeometry() {
        this.font = this.sceneState.get('fonts').get('fonts').get(this.shapes[0].font);

        this.parseStrings();

        super.initializeGeometry();
    }

    parseStrings() {
        this.objectCount = 0;
        this.shapes.forEach((shapeTypeInstance) => { this.objectCount += shapeTypeInstance.chunks.length; });
    }

    _attributes() {
        this.scales = new InstancedBufferAttribute(new Float32Array(this.objectCount * 2), 2);
        this.fontSizes = new InstancedBufferAttribute(new Float32Array(this.objectCount), 1);
        this.offsets = new InstancedBufferAttribute(new Float32Array(this.objectCount * 3), 3);
        this.colors = new InstancedBufferAttribute(new Float32Array(this.objectCount * 4), 4);
        this.texOffsets = new InstancedBufferAttribute(new Float32Array(this.objectCount * 4), 4);

        let index = 0;
        this.shapes.forEach((shapeTypeInstance, shapeIndex) => {
            let { position, bbox, fontSize, fill } = shapeTypeInstance;

            if (shapeTypeInstance.chunks.length) {
                // debugger;
            }

            shapeTypeInstance.chunks.forEach((chunk) => {
                chunk.renderIndex = index;

                // Resize character
                this.scales.setXY(index, chunk.width, chunk.height);

                // Pass in font size
                this.fontSizes.setX(index, fontSize);

                // Position character
                this.offsets.setXYZ(index, position.x - (bbox.width / 2) + chunk.x, position.y + (bbox.height / 2) + chunk.y, position.z);

                // Color character
                this.colors.setXYZW(index, fill.r, fill.g, fill.b, 1.0);

                // Character texture UV offsets
                this.texOffsets.setXYZW(index, chunk.uv.x, chunk.uv.y, chunk.uv.width, chunk.uv.height);

                index++;
            });

            shapeTypeInstance.setIndex(shapeIndex);
        });

        this.geometry.addAttribute('scale', this.scales);
        this.geometry.addAttribute('fontSize', this.fontSizes);
        this.geometry.addAttribute('offset', this.offsets);
        this.geometry.addAttribute('color', this.colors);
        this.geometry.addAttribute('texOffset', this.texOffsets);
    }

    updateAttributesAtIndex(index) {
        let shapeTypeInstance = this.shapes[index];
        let { position, bbox, fontSize, fill } = shapeTypeInstance;

        shapeTypeInstance.chunks.forEach((chunk) => {
            let chunkIndex = chunk.renderIndex;

            // Resize character
            this.scales.setXY(chunkIndex, chunk.width, chunk.height);

            // Pass in font size
            this.fontSizes.setX(chunkIndex, fontSize);

            // Position character
            this.offsets.setXYZ(chunkIndex, position.x - (bbox.width / 2) + chunk.x, position.y + (bbox.height / 2) + chunk.y, position.z);


            // Color character
            this.colors.setXYZW(chunkIndex, fill.r, fill.g, fill.b, 1.0);

            // Character texture UV offsets
            this.texOffsets.setXYZW(chunkIndex, chunk.uv.x, chunk.uv.y, chunk.uv.width, chunk.uv.height);
        });

        this.geometry.attributes.scale.needsUpdate = true;
        this.geometry.attributes.fontSize.needsUpdate = true;
        this.geometry.attributes.offset.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        this.geometry.attributes.texOffset.needsUpdate = true;

        if (this.material.uniforms.uSampler.value.uuid !== this.font.texture.uuid) {
            // Font texture updated, refresh uniform
            this.material.uniforms.uSampler.value = this.font.texture;
            this.material.needsUpdate = true;
        }
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
                transparent: true
            });
        }

        return this._material;
    }
}

export default Text;
