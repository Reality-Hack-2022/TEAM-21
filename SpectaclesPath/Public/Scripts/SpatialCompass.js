// -----JS CODE-----
// SpatialPointer.js
// Controls the rotation of a screen element that points at either a 360 degree angle or a world position.
// The rotation affects the local Y rotation of the pointerObject.
// Version: 1.1.0
// Author: Ted Brown
// March 2022

// @input SceneObject pointerObject
// @input SceneObject cameraObject

global.spatialPointer = script;

script.pointerObject.enabled = false;
script.ringArrowScript = script.pointerObject.getComponent("Component.ScriptComponent");
script.targetPosition = undefined;

script.hidePointer = function () {
    script.pointerObject.enabled = false;
    script.targetPosition = undefined;
}

// Rotate to face an angle that has these cardinal directions.
//   0 up
//  90 right
// 180 down
// 270 left
// (fractional numbers like 33.3, 42.45667, etc, are fine)
script.setAngle = function (degrees) {
    script.pointerObject.enabled = true;
    
    // Clear the target position
    script.targetPosition = undefined;
    
    // Flip to handle our counter-clockwise right-handed system
    degrees += 180;
    var angle = degrees * (Math.PI / 180);
    
    // Convert to quaternion
    var r = quat.angleAxis(angle, vec3.down());
    script.pointerObject.getTransform().setLocalRotation(r);
    script.timer = 0;
    
    if (script.ringArrowScript !== undefined) {
        script.ringArrowScript.bounce(3, 1);
    }
}

// Continuously track a world position
script.track = function (position) {
    script.pointerObject.enabled = true;
    script.targetPosition = position;
    script.aimAtPosition(position);
}

script.createEvent("UpdateEvent").bind(function () {
    // If we are tracking a target position, leave the pointer enabled and aim at it
    if (script.targetPosition !== undefined) {
        script.aimAtPosition(script.targetPosition);
        return;
    }

    // Otherwise, hide the arrow
    script.pointerObject.enabled = false;
});

// Rotate towards a world position
script.aimAtPosition = function (position) {
    // Get direction from pointer to target position
    // The target position you use makes a difference.
    // Try some of the following for yourself:
    // - The pointer object
    // - The camera object
    // - The camera object with an offset (default)
    
    //var targetPosition = script.pointerObject.getTransform().getWorldPosition();
    // var targetPosition = script.cameraObject.getTransform().getWorldPosition();
    var targetPosition = script.cameraObject.getTransform().getWorldPosition().add(script.cameraObject.getTransform().back.uniformScale(50));
    var direction = position.sub(targetPosition).normalize();
    
    // Transform direction into camera space
    direction = script.cameraObject.getTransform().getInvertedWorldTransform().multiplyDirection(direction);
    
    // Flatten the direction
    direction.y = 0;
    
    // Convert to quaternion
    var r = quat.lookAt(direction, vec3.up());
    
    // Rotate the pointer object
    script.pointerObject.getTransform().setLocalRotation(r);
}