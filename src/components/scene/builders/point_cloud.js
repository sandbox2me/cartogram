import {
    BufferGeometry,
    BufferAttribute,
    Color,
    Points,
    PointsMaterial,
    RawShaderMaterial,
    Vector3,
} from 'three';

import pointFragment from 'shaders/point_fragment.glsl';
import pointVertex from 'shaders/point_vertex.glsl';


export default class PointCloudBuilder {
    /**
     * PointCloudBuilder class
     *
     * Builds a point cloud
     *
     * @param  {[Object]} points An array of basic vectors
     */
    constructor(shapes) {
        this.shapes = shapes;

        // Create initial array

        this.geometry = new BufferGeometry();
        this.mesh = null;
        this.material = null;

        this._assignVertices();
        this._createMesh();
    }

    _assignVertices() {
        this.vertices = new BufferAttribute(new Float32Array(this.shapes.length * 3), 3);
        this.colors = new BufferAttribute(new Float32Array(this.shapes.length * 4), 4);
        this.sizes = new BufferAttribute(new Float32Array(this.shapes.length), 1);

        this.shapes.forEach((shape, i) => {
            let { radius, fill } = shape.shape;
            let position = shape.type.position;

            this.vertices.setXYZ(i, position.x, position.y, position.z);
            this.sizes.setX(i, radius);
            this.colors.setXYZW(i, fill.r, fill.g, fill.b, 1.0);
        });

        this.geometry.addAttribute('position', this.vertices);
        this.geometry.addAttribute('fill', this.colors);
        this.geometry.addAttribute('size', this.sizes);
    }

    _createMesh() {
        // this.material = new PointsMaterial({ color: 0xffffff, size: 20.0 });
        this.material = new RawShaderMaterial({
            vertexShader: pointVertex,
            fragmentShader: pointFragment,
            transparent: true
        });
        this.mesh = new Points(this.geometry, this.material);
    }

    getMesh() {
        return this.mesh;
    }

    getMaterial() {
        return this.material;
    }
};
