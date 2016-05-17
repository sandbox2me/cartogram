import {
    InstancedBufferAttribute,
    Mesh
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
        this.strokes = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 4), 4);
        this.strokeWidths = new InstancedBufferAttribute(new Float32Array(this.shapes.length * 4), 4);
        this.angles = new InstancedBufferAttribute(new Float32Array(this.shapes.length), 1).setDynamic(true);

        this.shapes.forEach((shapeTypeInstance, i) => {
            let { position, size, fill, stroke, strokeWidth, angle } = shapeTypeInstance;

            this.scales.setXY(i, size.width, size.height);
            this.offsets.setXYZ(i, position.x, position.y, position.z);
            this.colors.setXYZW(i, fill.r, fill.g, fill.b, (fill.a === undefined ? 1.0 : fill.a));
            this.strokes.setXYZW(i, stroke.r, stroke.g, stroke.b, (stroke.a === undefined ? 1.0 : stroke.a));
            this.strokeWidths.setX(i, strokeWidth);

            this.angles.setX(i, angle || 0);

            shapeTypeInstance.setIndex(i);
        });
        this.geometry.addAttribute('scale', this.scales);
        this.geometry.addAttribute('offset', this.offsets);
        this.geometry.addAttribute('color', this.colors);
        this.geometry.addAttribute('stroke', this.strokes);
        this.geometry.addAttribute('strokeWidth', this.strokeWidths);
        this.geometry.addAttribute('angle', this.angles);
    }

    updateAttributesAtIndex(index) {
        let shapeTypeInstance = this.shapes[index];
        let { position, size, fill, stroke, strokeWidth, angle } = shapeTypeInstance;

        this.scales.setXY(index, size.width, size.height);
        this.offsets.setXYZ(index, position.x, position.y, position.z);
        this.colors.setXYZW(index, fill.r, fill.g, fill.b, (fill.a === undefined ? 1.0 : fill.a));
        this.strokes.setXYZW(index, stroke.r, stroke.g, stroke.b, (stroke.a === undefined ? 1.0 : stroke.a));
        this.strokeWidths.setX(index, strokeWidth);
        this.angles.setX(index, angle || 0);

        this.geometry.attributes.scale.needsUpdate = true;
        this.geometry.attributes.offset.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        this.geometry.attributes.stroke.needsUpdate = true;
        this.geometry.attributes.strokeWidth.needsUpdate = true;
        this.geometry.attributes.angle.needsUpdate = true;
    }

    get vertexShader() {
        return vertexShader;
    }

    get fragmentShader() {
        return fragmentShader;
    }

    get builderType() {
        return 'PointCircle';
    }

    get renderOrder() {
        return 1;
    }
}

export default PointCircle;
