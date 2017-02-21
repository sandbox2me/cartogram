import _ from 'lodash';
import {
    InstancedBufferAttribute,
    RawShaderMaterial,
    Mesh,
    RepeatWrapping
} from 'three';
import Rectangle from './rectangle';
import vertexShader from 'shaders/instanced_texture_rectangle_vertex.glsl';
import fragmentShader from 'shaders/instanced_texture_rectangle_fragment.glsl';

class TextureRectangle extends Rectangle {
    initializeGeometry() {
        if (!this.shapes.length) {
            return;
        }

        this.texture = this.sceneState.getIn(['images', 'images', this.shapes[0].get('texture')]);

        super.initializeGeometry();
    }

    _attributes() {
        this.offsets = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 3), 3).setDynamic(true);
        this.textureOffset = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 2), 2).setDynamic(true);
        this.scales = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 2), 2).setDynamic(true);
        this.angles = new InstancedBufferAttribute(new Float32Array(this.shapes.length), 1).setDynamic(true);
        this.textureMultiplier = new InstancedBufferAttribute(new Float32Array(this.shapes.length), 1).setDynamic(true);

        this.shapes.forEach((shapeTypeInstance, i) => {
            let position = shapeTypeInstance.position;
            this.offsets.setXYZ(i, position.x, position.y, position.z);

            let size = shapeTypeInstance.size;
            this.scales.setXY(i, size.width, size.height);

            let textureOffset = shapeTypeInstance.textureOffset;
            this.textureOffset.setXY(i, textureOffset.x, textureOffset.y);

            this.textureMultiplier.setX(i, shapeTypeInstance.textureMultiplier);

            let angle = shapeTypeInstance.angle;
            this.angles.setX(i, angle);

            shapeTypeInstance.setIndex(i);
        });

        this.geometry.addAttribute('offset', this.offsets);
        this.geometry.addAttribute('scale', this.scales);
        this.geometry.addAttribute('angle', this.angles);
        this.geometry.addAttribute('textureMultiplier', this.textureMultiplier);
        this.geometry.addAttribute('textureOffset', this.textureOffset);
    }

    updateAttributesAtIndex(index) {
        let shapeTypeInstance = this.shapes[index];

        if (!shapeTypeInstance) {
            console.warn(`Rectangle at index ${index} not found. Returning.`);
            return;
        }

        let { position, textureOffset, textureMultiplier, angle, size, fill } = shapeTypeInstance;

        this.scales.setXY(index, size.width, size.height);
        this.offsets.setXYZ(index, position.x, position.y, position.z);
        this.angles.setX(index, angle);
        this.textureOffset.setXY(index, textureOffset.x, textureOffset.y);
        this.textureMultiplier = textureMultiplier;

        this.geometry.attributes.scale.needsUpdate = true;
        this.geometry.attributes.offset.needsUpdate = true;
        this.geometry.attributes.angle.needsUpdate = true;
        this.geometry.attributes.textureOffset.needsUpdate = true;
        this.geometry.attributes.textureMultiplier.needsUpdate = true;


        if (this.material.uniforms.uSampler.value.uuid !== this.texture.texture.uuid) {
            // Font texture updated, refresh uniform
            this.texture.texture.wrapS = RepeatWrapping;
            this.texture.texture.wrapT = RepeatWrapping;
            this.texture.texture.repeat.set(100, 100);
            this.material.uniforms.uSampler.value = this.texture.texture;

            this.material.needsUpdate = true;
        }
    }

    get material() {
        if (!this._material) {
            this._material = new RawShaderMaterial({
                uniforms: {
                    uLoaded: {
                        type: 'i',
                        value: Number(this.texture.isLoaded)
                    },
                    uSampler: {
                        type: 't',
                        value: this.texture.texture
                    }
                },
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
                transparent: true
            });
        }

        return this._material;
    }

    get vertexShader() {
        return vertexShader;
    }

    get fragmentShader() {
        return fragmentShader;
    }

    get builderType() {
        return 'TextureRectangle';
    }

    get renderOrder() {
        return 0;
    }
}

export default TextureRectangle;
