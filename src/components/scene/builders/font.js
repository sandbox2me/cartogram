import {
    InstancedBufferAttribute,
    RawShaderMaterial,
} from 'three';

// What is text other than a whole bunch of little rectangles next to each other?
import Rectangle from './rectangle';

import sdfVertexShader from 'shaders/instanced_text_vertex.glsl';
import sdfFragmentShader from 'shaders/instanced_text_fragment.glsl';

import atlasVertexShader from 'shaders/instanced_atlas_rectangle_vertex.glsl';
import atlasFragmentShader from 'shaders/instanced_atlas_rectangle_fragment.glsl';


class Font extends Rectangle {
    initializeGeometry() {
        if (!this.shapes.length) {
            return;
        }

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
        this.angles = new InstancedBufferAttribute(new Float32Array(this.objectCount), 1);

        let index = 0;
        this.shapes.forEach((shapeTypeInstance, shapeIndex) => {
            let { position, shapeBBox, fontSize, fill, angle } = shapeTypeInstance;

            if (shapeTypeInstance.chunks.length) {
                // debugger;
            }

            shapeTypeInstance.chunks.forEach((chunk, i) => {
                chunk.renderIndex = index;

                let chunkPosition = shapeTypeInstance.positionForChunk(i);

                // Resize character
                this.scales.setXY(index, chunk.width, chunk.height);

                // Pass in font size
                this.fontSizes.setX(index, fontSize);

                // Position character
                // this.offsets.setXYZ(index, position.x - (shapeBBox.width / 2) + chunk.x, position.y + (shapeBBox.height / 2) + chunk.y, position.z);
                this.offsets.setXYZ(index, chunkPosition.x, chunkPosition.y, position.z);

                // Color character
                this.colors.setXYZW(index, fill.r, fill.g, fill.b, (fill.a === undefined ? 1.0 : fill.a));

                // Character texture UV offsets
                this.texOffsets.setXYZW(index, chunk.uv.x, chunk.uv.y, chunk.uv.width, chunk.uv.height);

                // Individual character angle
                this.angles.setX(index, angle);

                index++;
            });

            shapeTypeInstance.setIndex(`${ this.font.name }:${ shapeIndex }`);
        });

        this.geometry.addAttribute('scale', this.scales);
        this.geometry.addAttribute('fontSize', this.fontSizes);
        this.geometry.addAttribute('offset', this.offsets);
        this.geometry.addAttribute('color', this.colors);
        this.geometry.addAttribute('texOffset', this.texOffsets);
        this.geometry.addAttribute('angle', this.angles);
    }

    updateAttributesAtIndex(fullIndex) {
        let index = fullIndex.split(':')[1];
        let shapeTypeInstance = this.shapes[index];

        if (!shapeTypeInstance) {
            console.warn(`Text at index ${fullIndex} not found. Returning.`);
            return;
        }

        let { position, shapeBBox, fontSize, fill, angle } = shapeTypeInstance;

        shapeTypeInstance.chunks.forEach((chunk, i) => {
            let chunkIndex = chunk.renderIndex;
            let chunkPosition = shapeTypeInstance.positionForChunk(i);

            // Resize character
            this.scales.setXY(chunkIndex, chunk.width, chunk.height);

            // Pass in font size
            this.fontSizes.setX(chunkIndex, fontSize);

            // Position character
            // this.offsets.setXYZ(chunkIndex, position.x - (shapeBBox.width / 2) + chunk.x, position.y + (shapeBBox.height / 2) + chunk.y, position.z);
            this.offsets.setXYZ(chunkIndex, chunkPosition.x, chunkPosition.y, position.z);

            // Color character
            this.colors.setXYZW(chunkIndex, fill.r, fill.g, fill.b, (fill.a === undefined ? 1.0 : fill.a));

            // Character texture UV offsets
            this.texOffsets.setXYZW(chunkIndex, chunk.uv.x, chunk.uv.y, chunk.uv.width, chunk.uv.height);

            // Individual character angle
            this.angles.setX(chunkIndex, angle);
        });

        this.geometry.attributes.scale.needsUpdate = true;
        this.geometry.attributes.fontSize.needsUpdate = true;
        this.geometry.attributes.offset.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        this.geometry.attributes.texOffset.needsUpdate = true;
        this.geometry.attributes.angle.needsUpdate = true;

        if (this.material.uniforms.uLoaded.value !== Number(this.font.isLoaded)) {
            this.material.uniforms.uLoaded.value = Number(this.font.isLoaded);
            this.material.needsUpdate = true;
        }

        if (this.material.uniforms.uSampler.value.uuid !== this.font.texture.uuid) {
            // Font texture updated, refresh uniform
            this.material.uniforms.uSampler.value = this.font.texture;
            this.material.needsUpdate = true;
        }
    }

    reindex() {
        this.shapes.forEach((shapeTypeInstance, i) => {
            let index = `${ this.font.name }:${ i }`;

            if (shapeTypeInstance.index !== index) {
                shapeTypeInstance.setIndex(index);
                this.updateAttributesAtIndex(index);
            }
        });
    }

    get vertexShader() {
        if (this.font.isTTF) {
            return atlasVertexShader;
        } else {
            return sdfVertexShader;
        }
    }

    get fragmentShader() {
        if (this.font.isTTF) {
            console.log(this.font, 'atlas fragment shader plz!')
            return atlasFragmentShader;
        } else {
            console.log(this.font, 'sdf fragment shader plz!')
            return sdfFragmentShader;
        }
    }

    get material() {
        if (!this._material) {
            this._material = new RawShaderMaterial({
                uniforms: {
                    uLoaded: {
                        type: 'i',
                        value: Number(this.font.isLoaded)
                    },
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

    get builderType() {
        return `Text:${ this.font.name }`;
    }

    get renderOrder() {
        return 2;
    }

    get mesh() {
        let mesh = super.mesh;

        if (!mesh.length) {
            return [undefined];
        }

        return mesh;
    }
}

export default Font;
