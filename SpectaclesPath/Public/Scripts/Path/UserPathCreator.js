// -----JS CODE-----
//@input Component.Camera camera
//@input float yValue

global.userPathCreator = script;
var store = global.persistentStorageSystem.store;
//var pathKey = "lastPath";
var posKey = "posArray";
var rotKey = "rotArray";
var pathPosData = [];
var pathRotData = [];

script.activate = function()
{
    // check for stored path
    var storedPathPosData = retrievePathPosData();
    var storedPathRotData = retrievePathRotData();

    var posDataLength = storedPathPosData.length;
    var rotDataLength = storedPathRotData.length;
    if (posDataLength != rotDataLength) { print("ERROR: Path Position and Rotation Data Does Not Match!!!"); }
    else if (posDataLength <= 1)
    {
        // no path data stored
        print("No PathData found in persistent storage");
    }
    else
    {
        // path data found
        print("Found PathData in persistent storage with length: " + posDataLength);
    }
}

script.createEvent("TouchStartEvent").bind(function()
{
    getAndStorePathData();
});

script.createEvent("TouchEndEvent").bind(function()
{
    //print("A touch hath ended");
});

function getAndStorePathData()
{
    addDataToPath(getDevicePos(), getDeviceRot());
    //print("Adding position: " + pos.toString());
    storePathData(pathPosData, pathRotData);
}

function addDataToPath(pos, rot)
{
    pathPosData.push(pos);
    pathRotData.push(rot);
}

function storePathData(posData, rotData)
{
    store.putVec3Array(posKey, posData);
    store.putQuatArray(rotKey, rotData);
}
function retrievePathPosData() { return store.getVec3Array(posKey); }
function retrievePathRotData() { return store.getQuatArray(rotKey); }

function getDevicePos() 
{ 
    var pos = script.camera.getTransform().getWorldPosition();
    pos.y = script.yValue;
    return pos;
}
function getDeviceRot() { return script.camera.getTransform().getWorldRotation(); }

function encapsulateData(pos, rot)
{
    var t = 
    {
        "position": pos,
        "rotation": rot,
    };
    return t;
}
script.api.retrieveEncapsulatedData = function()
{
    //print("Encapsulating Data called");
    var posData = retrievePathPosData();
    var rotData = retrievePathRotData();
    var pathData = [];
    
    if (posData.length != rotData.length)
    {
        print("ERROR: Path Position and Rotation Data Does Not Match!!!");
    }
    else
    {
        print("Encapsulating Data");
        
        for (var i = 0; i < posData.length; i++)
        {
            pathData.push(encapsulateData(posData[i], rotData[i]));
        }
    }
    
    return pathData;
}
