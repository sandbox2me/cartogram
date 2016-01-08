import {
    BufferGeometry,
    BufferAttribute,
    Color,
    Points,
    PointsMaterial,
    ShaderMaterial,
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
    constructor(points) {
        this.points = points;

        // Create initial array
        this.vertices = new Float32Array(this.points.length * 3);

        this.geometry = new BufferGeometry();
        this.mesh = null;
        this.material = null;

        this._assignVertices();
        this._createMesh();
    }

    _assignVertices() {
        this.points.forEach((point, i) => {
            this.vertices[i * 3 + 0] = point.x;
            this.vertices[i * 3 + 1] = point.y;
            this.vertices[i * 3 + 2] = point.z;
        });

        this.geometry.addAttribute('position', new BufferAttribute(this.vertices, 3));
    }

    _createMesh() {
        // this.material = new PointsMaterial({ color: 0xffffff, size: 20.0 });
        this.material = new ShaderMaterial({
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
