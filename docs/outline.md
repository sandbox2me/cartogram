Cartogram 2.0
=============

Cartogram is a fast, lightweight graphics engine targeting WebGL. Built on top of Redux and ThreeJS.

Cartogram
====
Cartogram(el, options)

properties
  width
  height
  state

methods
  registerSDFont(name, definition)
  registerFont(name, fontface)
  registerType(name, definition)
  getDefaultScene()
  render(callback)


Actor
====

properties
  name
    - Name of this actor.
    - Has to be unique within the parent group. Doesn't have to be globally unique.
  definition
    - The definition object for this actor.
    - Considered read-only.
  group
    - The group this actor belongs to.
    - Considered read-only.
  scene
    - The scene this actor belongs to.
  types
    - Shape instances collected by their respective type.
    - { Rectangle: [rectangleInstances...]}
  children
    - Shape instance dictionary
    - { shapeName: shapeInstance }
  path
    - The scene path of this actor, including its group.
    - "/group-name/actor-name"
  position
    - The relative position within the actor's group.
  originPosition
    - The absolute position of the actor in the scene.
  angle
    - Rotation angle in degrees.
  layer
    - Current layer of the actor.
  axisAlignedBBox
    - The unrotated bounding box that contains the actor. The size adjusts when the actor rotates.
  originBBox
    - The absolute bounding box of the actor and its shapes.
    - This bounding box always fits the children of the actor, unlike the axis-aligned bounding box.
  bbox
    - The relative bounding box of the actor and its shapes.
    - This bounding box always fits the children of the actor, unlike the axis-aligned bounding box.

methods
  checkHitMask(position)
    - If this actor has a shape that defines its hit mask, checks for an intersection between that shape and the given position.
  iterateChildren()
    - private
    - Converts shape definitions into shape type instances
  updateChild(properties)
    - private
    - Used by the scene renderer to update shapes
  set(shapeName, properties)
    - Manually update properties of a particular named shape on the actor.
  setShapeProps(props)
    - Update actor shapeProps. Use this to update custom property values you've defined as placeholders on actor shapes.
    - Provided object merges with existing property object.
    - Actor will re-render.
  translate(position)
    - Move actor relatively from current position to new position.
  moveTo(position)
    - Move actor absolutely to new position
  destroy()
    - Queues this actor to be destroyed.
  rotate(angle)
    - Rotate the actor and its shapes (except those with the 'rotate' property set to false), angle in degrees.
  changeLayer(layer)
    - Move the actor onto a new layer
  trigger(eventName, data)
    - Trigger the event defined on the actor with given data.


Group
====

properties
  path
  originBBox
  axisAlignedBBox
  bbox
  position
  angle
  layer

methods
  addActor(actor)
  removeActor(actorName)
  addActorObject(actor)
  removeActorObject(actor)
  updateShapes(shapeName, properties)
  updateShapeProps(props)
  translate(position)
  moveTo(position)
  rotate(angle)
  changeLayer(layer)
  toTop()
  trigger(e, data, triggerActors=false)


Font
====

methods
  canUseFor(str)
  getDimensionsForSize(character, size)


Font -> SDFFont
====
  SDFFont(dispatch, name, definition, texture)


Font -> TTFFont
====
  TTFFont(name, fontface, options)

methods
  addCharacter(character)



Scene
====
Scene(name, store)
properties
  name
  store
  dispatch
  eventBus
  camera
  path
  rtree
  typedTrees
  builders
  threeScenes


methods
  on()
  off()
  trigger()
  addCameraController(controller)
  setCameraZoomRange(min, max)
  addGroup(group)
  addGroups([groups])
  updateShape(shapeTypeInstance, properties)
  pushChange(change)
  pushChanges([changes])
  objectsAtPath(path)
  buildersForLayer(layer)
  worldToScreenPositionVector(position)
  screenToWorldPosition(position)
  actorsAtWorldPosition(position, radius=1)
  actorsAtScreenPosition(position, radius=1)
  groupsAtScreenPosition(position)
  actorsInScreenRegion(bbox)
  actorAtPath(path)
  groupAtPath(path)
  registerLayers(layers)
  getLayerValue(layer)
  forceRedraw()
  setCursor(style, options={})
  sceneBBox()
  sceneCenter()


Camera
====
methods
  getCamera()
  updatePosition(triggerChange=true)
  moveTo(position)
  zoomToFit(bbox)


Path
====
methods
  ls(path)
  cp(src, dest)
    Not implemented
  rm(path)
    Not implemented
  cat(path)
  get(path)
    Not implemented
  groupFromPath(path)


RTree
====
methods
  insert(shapeType)
  insertShapes(shapes)
  insertActors(actors)
  reset()
  search(bbox)
  seatchPoint(point)
  toJSON()
  getSize()
  getCenter()


# Shape Type Classes

BaseType
====
  BaseType(shape, actor)

properties
  actor
  shape
  path
  originPosition
  position
  angle
  index
  shapeBBox
  axisAlignedBBox
  originBBox

methods
  update(properties)
  get(property)
  setIndex(index)
  checkIntersection(position)


BaseType::PointCircle
====

properties
  size
  radius
  fill
  stroke
  strokeWidth


BaseType::Rectangle
====

properties
  size
  fill


Rectangle::Text
====

properties
  fill
  fontSize
  font
  string
  chunks
  size


# Builders

Builders are what the scene renderer uses to generate the mesh and texture data for ThreeJS/WebGL.

Most shapes can be considered to be textured rectangles, so most things are actually subclasses of the Rectangle builder. This allows for custom effects on each shape type.

Rectangle
====

The basis of most builders. This builder leverages GL Instancing via ThreeJS's InstancedBufferGeometry, and related InstancedBufferAttributes. Instancing lets us define a single geometry (vertices, UVs, and triangle indices), and a set of attributes. Each attribute is defined with an array that is the size of the number of shapes in the scene. So we only define a single mesh, and instruct the GPU to draw as many instances of that shape as we want. Each instance can have different attribute values for the GL shader to use.

This allows for really fast rendering, as the JS engine only has to manage simple arrays of shapes and doesn't have to build the meshes required for thousands of rectangles before uploading to the GPU.

properties
  vertexShader
  fragmentShader
  material
  builderType
  renderOrder
  mesh

methods
  updateAttributesAtIndex(index)
  shapesToTop(indexes)
  reindex()
  addShapes(shapes, state)
  removeShapes(shapes, state)
  yankShapes(indexes)


Rectangle::PointCircle
====

Text
====

Rectangle::Font
====



# Definitions
Cartogram scenes are built from basic JS objects. A group is a collection of actors, each actor contains a collection of shapes.

## Group
{
    name: '',
    rotateChildren: false,
    position: {},
    angle: 0,
    layer: 'default',
    actors: [],
    events: {
      name: (groupInstance, data) => {}
    },
}

## Actor
{
    name: '',
    position: {},
    shapes: [],
    shapeProps: {},
    events: {
      name: (actorInstance, data) => {}
    },
}

## Shape

### Circle
{
    type: 'PointCircle',
    name: '',
    position: {},
    radius: 0,
    fill:,
    strokeWidth,
    stroke:,
    hitMask: false,
    rotate: false,
}

### Text
{
    type: 'Text',
    name: '',
    position: {},
    font: '',
    size: 12,
    string: '',
    fill:,
    angle:,
    rotate: false,
}

### Rectangle
{
    type: 'Rectangle',
    name: '',
    position: {},
    size: {},
    fill: {},
    angle:,
    hitMask:,
}
