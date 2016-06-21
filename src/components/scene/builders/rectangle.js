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
        this.angles = new InstancedBufferAttribute(new Float32Array(this.shapes.length), 1).setDynamic(true);

        this.shapes.forEach((shapeTypeInstance, i) => {
            let position = shapeTypeInstance.position;
            this.offsets.setXYZ(i, position.x, position.y, position.z);

            let size = shapeTypeInstance.size;
            this.scales.setXY(i, size.width, size.height);

            // Assuming r,g,b,[a] object. Handle other things plz.
            let color = shapeTypeInstance.fill;
            this.colors.setXYZW(i, color.r, color.g, color.b, (color.a === undefined ? 1.0 : color.a));

            let angle = shapeTypeInstance.angle;
            this.angles.setX(i, angle);

            shapeTypeInstance.setIndex(i);
        });

        this.geometry.addAttribute('offset', this.offsets);
        this.geometry.addAttribute('scale', this.scales);
        this.geometry.addAttribute('color', this.colors);
        this.geometry.addAttribute('angle', this.angles);
    }

    updateAttributesAtIndex(index) {
        let shapeTypeInstance = this.shapes[index];

        if (!shapeTypeInstance) {
            console.warn(`Rectangle at index ${index} not found. Returning.`);
            return;
        }


        let { position, angle, size, fill } = shapeTypeInstance;

        this.scales.setXY(index, size.width, size.height);
        this.offsets.setXYZ(index, position.x, position.y, position.z);
        this.colors.setXYZW(index, fill.r, fill.g, fill.b, (fill.a === undefined ? 1.0 : fill.a));
        this.angles.setX(index, angle);

        this.geometry.attributes.scale.needsUpdate = true;
        this.geometry.attributes.offset.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        this.geometry.attributes.angle.needsUpdate = true;
    }

    _groupIndexes(indexes) {
        let indexGroups = [[]];
        let currentGroup = 0;

        // Sort numbers properly
        indexes.sort((a, b) => a - b);

        if (indexes[indexes.length - 1] - indexes[0] === indexes.length) {
            // We have one sequence of indexes
            indexGroups[0] = indexes;
        } else {
            indexes.forEach((index, i) => {
                // Create groups of sequential indexes -> [[10, 12, 13, 14], [22, 23, 24]]
                if (i === 0 || indexes[i - 1] + 1 === index) {
                    indexGroups[currentGroup].push(index);
                } else {
                    indexGroups.push([index]);
                    currentGroup += 1;
                }
            });
        }

        return indexGroups;
    }

    shapesToTop(indexes) {
        let indexGroups = this._groupIndexes(indexes);

        // Extract all the groups of shapes and push them onto the end
        this.shapes = indexGroups.map(
            (group) => this.shapes.splice(group[0], group.length)
        ).reduce(
            (shapes, instanceGroup) => shapes.concat(instanceGroup),
            this.shapes
        );
    }

    reindex() {
        this.shapes.forEach((shapeTypeInstance, i) => {
            if (shapeTypeInstance.index !== i) {
                shapeTypeInstance.setIndex(i);
                this.updateAttributesAtIndex(i);
            }
        });
    }

    addShapes(shapes, sceneState) {
        this.sceneState = sceneState;

        let oldShapesCount = this.shapes.length;
        this.shapes = this.shapes.concat(shapes);

        this.initializeGeometry();
        this._mesh = undefined;
    }

    removeShapes(shapes, sceneState) {
        this.sceneState = sceneState;

        this.shapes = _.difference(this.shapes, shapes);

        if (this.shapes.length) {
            this.initializeGeometry();
        }
        this._mesh = undefined;
    }

    yankShapes(indexes) {
        // This is like removeShapes except we only have the indexes
        let indexGroups = this._groupIndexes(indexes);

        this._mesh = undefined;

        let shapes = indexGroups.reverse().map(
            (group) => this.shapes.splice(group[0], group.length)
        ).reduce(
            (shapes, instanceGroup) => shapes.concat(instanceGroup),
            []
        );

        this.shapes = _.compact(this.shapes);
        this.reindex();

        if (this.shapes.length) {
            this.initializeGeometry();
        }

        return shapes;
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

    get builderType() {
        return 'Rectangle';
    }

    get renderOrder() {
        return 0;
    }

    get mesh() {
        if (!this._mesh && this.shapes.length) {
            this._mesh = new Mesh(this.geometry, this.material);
            this._mesh.frustumCulled = false;
            this._mesh.builderType = this.builderType;
            this._mesh.depthTest = false;
            this._mesh.renderOrder = this.renderOrder;
        }

        if (!this._mesh) {
            return [];
        }
        return [this._mesh];
    }
}

export default Rectangle;
