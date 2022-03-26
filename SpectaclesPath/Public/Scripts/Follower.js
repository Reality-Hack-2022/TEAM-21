// -----JS CODE-----

//@input Component.Camera camera
//@input bool lockX
//@input bool lockY
//@input bool lockZ
//@input float smoothingAmmount
//@input vec3 offset

script._transform;

script.createEvent("TurnOnEvent").bind(function()
{
    script._transform = script.getTransform();
});

script.createEvent("UpdateEvent").bind(function()
{
    var targetPos = script.camera.getTransform().getWorldPosition();
    var pos = script.getTransform().getWorldPosition();
    pos.x = smoothFloat(pos.x, targetPos.x, script.smoothingAmmount);
    pos.y = smoothFloat(pos.y, targetPos.y, script.smoothingAmmount);
    pos.z = smoothFloat(pos.z, targetPos.z, script.smoothingAmmount);
    script._transform.setWorldPosition(pos);
});

function smoothFloat(src, targ, smoothAmount)
{
    return (smoothAmount * src) + ((1 - smoothAmount) * targ);
}