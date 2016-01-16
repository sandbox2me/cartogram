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

import vertexShader from 'shaders/instanced_circle_vertex.glsl';
import fragmentShader from 'shaders/instanced_circle_fragment.glsl';


class PointCircle extends Rectangle {
    _attributes() {
        this.scales = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 2), 2);
        this.offsets = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 3), 3);
        this.colors = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 4), 4);

        this.shapes.forEach((shape, i) => {
            let { position, bbox, size } = shape.type;
            let { fill } = shape.shape;

            this.scales.setXY(i, size.width, size.height);
            this.offsets.setXYZ(i, position.x, position.y, position.z);
            this.colors.setXYZW(i, fill.r, fill.g, fill.b, 1.0);

            this.geometry.addAttribute('scale', this.scales);
            this.geometry.addAttribute('offset', this.offsets);
            this.geometry.addAttribute('color', this.colors);
        });
    }

    get vertexShader() {
        return vertexShader;
    }

    get fragmentShader() {
        return fragmentShader;
    }
}

export default PointCircle;
