// Generates an instanced geometry of rectangles, shader controlled scaling/rotation/color
import {
    BufferAttribute,
    InstancedBufferAttribute,
    InstancedBufferGeometry,
    Mesh,
    RawShaderMaterial,
    Vector4,
} from 'three';

import vertexShader from 'shaders/instanced_rectangle_vertex.glsl';
import fragmentShader from 'shaders/instanced_rectangle_fragment.glsl';


class Rectangle {
    constructor(shapes, rtree, sceneState) {
        this.sceneState = sceneState;
        this.shapes = shapes;


        this.initializeGeometry();
    }

    initializeGeometry() {
        this.geometry = new InstancedBufferGeometry();
        this._constructVertices();
        this._attributes();
    }

    _constructVertices() {
        let vertices = new Float32Array([
            -0.5, 0.5, 0,
            0.5, 0.5, 0,
            -0.5, -0.5, 0,
            0.5, -0.5, 0
        ]);

        let uvs = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ]);

        let indices = new Uint16Array([
            2, 1, 0,
            3, 1, 2,
        ]);

    	this.geometry.addAttribute('position', new BufferAttribute(vertices, 3));
    	this.geometry.addAttribute('uv', new BufferAttribute(uvs, 2));
        this.geometry.setIndex(new BufferAttribute(indices, 1));
    }

    _attributes() {
        this.offsets = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 3), 3).setDynamic(true);
        this.scales = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 2), 2).setDynamic(true);
        this.colors = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 4), 4).setDynamic(true);

        this.shapes.forEach((shapeTypeInstance, i) => {
            let position = shapeTypeInstance.position;
            this.offsets.setXYZ(i, position.x, position.y, position.z);

            let size = shapeTypeInstance.shape.size;
            this.scales.setXY(i, size.width, size.height);

            // Assuming r,g,b object. Handle other things plz.
            let color = shapeTypeInstance.shape.fill;
            this.colors.setXYZW(i, color.r, color.g, color.b, 1.0);

            shapeTypeInstance.setIndex(i);
        });

        this.geometry.addAttribute('offset', this.offsets);
        this.geometry.addAttribute('scale', this.scales);
        this.geometry.addAttribute('color', this.colors);
    }

    updateAttributesAtIndex(index) {
        let shapeTypeInstance = this.shapes[index];

        let { position, bbox } = shapeTypeInstance;
        let { fill, size } = shapeTypeInstance.shape;

        this.scales.setXY(index, size.width, size.height);
        this.offsets.setXYZ(index, position.x, position.y, position.z);
        this.colors.setXYZW(index, fill.r, fill.g, fill.b, 1.0);

        this.geometry.attributes.scale.needsUpdate = true;
        this.geometry.attributes.offset.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
    }

    addShapes(shapes, sceneState) {
        this.sceneState = sceneState;

        let oldShapesCount = this.shapes.length;
        this.shapes = this.shapes.concat(shapes);

        this.initializeGeometry();
        this._mesh = undefined;
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
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
                transparent: true
            });
        }

        return this._material;
    }

    get mesh() {
        if (!this._mesh) {
            this._mesh = new Mesh(this.geometry, this.material);
            this._mesh.frustumCulled = false;
            this._mesh.builderType = 'Rectangle';
        }

        return this._mesh;
    }
}

export default Rectangle;
