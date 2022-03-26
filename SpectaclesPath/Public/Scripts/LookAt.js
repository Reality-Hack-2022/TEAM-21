// @input SceneObject lookTarget
// @input float lookAtSpeed
// @input bool onlyY

if (script.lookTarget == null) {
    return;
}   

var lookTargetT = script.lookTarget.getTransform();

script.createEvent("UpdateEvent").bind(function () {
    
    script.lookAtSpeed = (script.lookAtSpeed?script.lookAtSpeed:1);
    script.onlyY = (script.onlyY?script.onlyY:false);
            
        var to = (lookTargetT.x != null?lookTargetT:lookTargetT.getWorldPosition());
        var fr = script.getTransform().getWorldPosition();
    
        to.y = (script.onlyY?fr.y:to.y);

        var _lookRotation = quat.lookAt(to.sub(fr).normalize(), vec3.up());
        var rotationStep = quat.slerp(script.getTransform().getWorldRotation(), _lookRotation, getDeltaTime() * script.lookAtSpeed);    
    
        script.getTransform().setWorldRotation(rotationStep);
});