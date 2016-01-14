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
    constructor(shapes, rtree) {
        this.shapes = shapes;

        this.geometry = new InstancedBufferGeometry();

        this.initialize();
    }

    initialize() {
        this._constructVertices();
        this._attributes();
    }

    _constructVertices() {
        let positions = [
            [-1.0, -1.0,  1.0],
            [ 1.0, -1.0,  1.0],
            [ 1.0,  1.0,  1.0],

            [ 1.0,  1.0,  1.0],
            [-1.0,  1.0,  1.0],
            [-1.0, -1.0,  1.0]
        ];
        let vertices = new Float32Array(6 * 3);
        let i;

        for (i = 0; i < positions.length; i++) {
            vertices[i * 3 + 0] = positions[i][0];
            vertices[i * 3 + 1] = positions[i][1];
            vertices[i * 3 + 2] = positions[i][2];
        }

        this.geometry.addAttribute('position', new BufferAttribute(vertices, 3));
    }

    _attributes() {
        this.offsets = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 3), 3);
        this.scales = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 2), 2);
        this.colors = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 4), 4);

        this.shapes.forEach((shape, i) => {
            let position = shape.type.position;
            this.offsets.setXYZ(i, position.x, position.y, position.z);

            let size = shape.shape.size;
            this.scales.setXY(i, size.width, size.height);

            // Assuming r,g,b object. Handle other things plz.
            let color = shape.shape.fill;
            this.colors.setXYZW(i, color.r, color.g, color.b, 1.0);
        });

        this.geometry.addAttribute('offset', this.offsets);
        this.geometry.addAttribute('scale', this.scales);
        this.geometry.addAttribute('color', this.colors);
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
                transparent: false
            });
        }

        return this._material;
    }

    get mesh() {
        if (!this._mesh) {
            this._mesh = new Mesh(this.geometry, this.material);
            this._mesh.frustumCulled = false;
        }

        return this._mesh;
    }
}

export default Rectangle;
