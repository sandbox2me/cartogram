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

        this.geometry = new InstancedBufferGeometry();

        this.initialize();
    }

    initialize() {
        this._constructVertices();
        this._attributes();
    }

    _constructVertices() {
        // Based on THREE.PlaneBufferGeometry
        // https://github.com/mrdoob/three.js/blob/master/src/extras/geometries/PlaneBufferGeometry.js
        let width = 1;
        let height = 1;

        let width_half = width / 2;
    	let height_half = height / 2;

    	let gridX = 1;
    	let gridY = 1;

    	let gridX1 = gridX + 1;
    	let gridY1 = gridY + 1;

    	let segment_width = width / gridX;
    	let segment_height = height / gridY;

    	let vertices = new Float32Array(gridX1 * gridY1 * 3);
    	let normals = new Float32Array(gridX1 * gridY1 * 3);
    	let uvs = new Float32Array(gridX1 * gridY1 * 2);

    	let offset = 0;
    	let offset2 = 0;
        let x, y, iy, ix;

    	for (iy = 0; iy < gridY1; iy++) {

    		y = iy * segment_height - height_half;

    		for (ix = 0; ix < gridX1; ix++) {
    			x = ix * segment_width - width_half;

    			vertices[offset] = x;
    			vertices[offset + 1] = - y;

    			normals[offset + 2] = 1;

    			uvs[offset2] = ix / gridX;
    			uvs[offset2 + 1] = 1 - (iy / gridY);

    			offset += 3;
    			offset2 += 2;
    		}
    	}

    	offset = 0;

    	let indices = new ((vertices.length / 3) > 65535 ? Uint32Array : Uint16Array)(gridX * gridY * 6);
    	for (iy = 0; iy < gridY; iy++) {
    		for (ix = 0; ix < gridX; ix++) {
    			let a = ix + gridX1 * iy;
    			let b = ix + gridX1 * (iy + 1);
    			let c = (ix + 1) + gridX1 * (iy + 1);
    			let d = (ix + 1) + gridX1 * iy;

    			indices[offset] = a;
    			indices[offset + 1] = b;
    			indices[offset + 2] = d;

    			indices[offset + 3] = b;
    			indices[offset + 4] = c;
    			indices[offset + 5] = d;

    			offset += 6;
    		}
    	}

    	this.geometry.setIndex(new BufferAttribute(indices, 1));
    	this.geometry.addAttribute('position', new BufferAttribute(vertices, 3));
    	this.geometry.addAttribute('normal', new BufferAttribute(normals, 3));
    	this.geometry.addAttribute('uv', new BufferAttribute(uvs, 2));
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
                transparent: true
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
