// -----JS CODE-----
// This shows how to use the Spatial Compass

// @input SceneObject cameraObject
// @input SceneObject targetObject
// @input SceneObject instructionsObject

script.targetObject.setParentPreserveWorldTransform(null);
script.instructionsObject.setParentPreserveWorldTransform(script.cameraObject);
script.instructionsObject.getTransform().setLocalPosition(new vec3(0, -15, -100));

script.placeTarget = function () {
    // Define a position 200cm in front of the user, on a flat plane
    var headPosition = script.cameraObject.getTransform().getWorldPosition();
    var forward = script.cameraObject.getTransform().getWorldRotation().multiplyVec3(vec3.back());
    forward.y = 0;
    var position = headPosition.add(forward.uniformScale(200));
    
    // Move the target object to the target position
    script.targetObject.getTransform().setWorldPosition(position);
    
    // Track that position
    global.spatialPointer.track(position);    
}

script.createEvent("OnStartEvent").bind(function () {
    script.placeTarget();
});

script.createEvent("TapEvent").bind(function () {
    script.placeTarget();
    script.instructionsObject.enabled = false;
});

