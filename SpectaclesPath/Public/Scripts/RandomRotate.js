// -----JS CODE-----
// RandomRotate.js
// Generates a random rotation and applies it every frame to the local rotation
// Version: 1.0.0
// Author: Ted Brown
// August 2021

var x = (Math.random() * 720) - 360;
var y = (Math.random() * 720) - 360;
var z = (Math.random() * 720) - 360;
script.rotationVec3 = new vec3(x, y, z).normalize().uniformScale(5 + Math.random() * 5);

script.createEvent("UpdateEvent").bind(function () {
    var r = script.getTransform().getLocalRotation();
    r = r.multiply(quat.fromEulerVec(script.rotationVec3.uniformScale(getDeltaTime())));
    script.getTransform().setLocalRotation(r);
});
