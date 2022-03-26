// -----JS CODE-----
// RingArrow.js
// A visual element that can "bounce" its arrow to signal a direction
// Version: 1.0.0
// Author: Ted Brown
// August 2021

// @input SceneObject arrowObject

script.duration = 0;
script.timer = 0;
script.basePosition = script.arrowObject.getTransform().getLocalPosition();
script.targetPosition = vec3.zero();

script.bounce = function (distance, duration) {
    // this value is due to unit issues between Blender and Lens Studio
    distance /= 1000;
    script.targetPosition = script.basePosition.add(vec3.down().uniformScale(distance));
    script.duration = duration;
    script.timer = 0;
}

script.createEvent("UpdateEvent").bind(function () {
    // Avoids a known issue when capturing on Spectacles
    if (getDeltaTime() === 0) return;
    
    script.timer += getDeltaTime();
    if (script.timer >= script.duration) {
        script.arrowObject.getTransform().setLocalPosition(script.basePosition);
    }
    else {
        var t = script.timer / script.duration;
        var easeOutCubic = 1 - Math.pow(1 - t, 3);
        var lerp = Math.sin(easeOutCubic * Math.PI);
        script.arrowObject.getTransform().setLocalPosition(vec3.lerp(script.basePosition, script.targetPosition, lerp));
    }
});
