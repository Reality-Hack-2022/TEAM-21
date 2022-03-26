// -----JS CODE-----
// PulseScale.js
// Uses a modified easeInOutCirc function to simulate a "pulse" scaling effect.
// https://easings.net/#easeInOutCirc
// Version: 1.0.0
// Author: Ted Brown
// August 2021

script.baseScale = script.getTransform().getLocalScale();
script.maxScale = script.baseScale.uniformScale(3);

script.createEvent("UpdateEvent").bind(function () {
    var t = (Math.sin(getTime() * 2) + 1) / 2;
    t = script.peak(t);
    script.getTransform().setLocalScale(vec3.lerp(script.baseScale, script.maxScale, t));
});

script.peak = function(x) {
    if (x > 0.5) return script.peak(1 - x);
    return (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2;
}
