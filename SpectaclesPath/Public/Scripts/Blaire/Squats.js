// -----JS CODE-----
// PLANE TRACKER EXAMPLE
// For Lens Studio on Next Generation Spectacles
// - Uses Plane Tracker to position an object in the world
// - If the plane is invalid, hides the object and shows the problem with on-screen text
// - Activates on start
// - Tap to set object position
// Ted Brown / November 30, 2021

// @input SceneObject cameraObject
// @input SceneObject targetObject
// @input Component.Text currentHeight
// @input Component.Text jumpCounter
// @input Component.Text currentExercise

// @input Component.Text scoreText
// @input Component.Text highScoreText

var currentScore = 0;
var highScore = 0;

var baseHeight = 0;
var camHeight = 0;
var startHeight = 0;

var squatCounter = 0;
var jumpCounter = 0;
var lungeCounter = 0;

var cam = vec3.zero();

var current_exercise = "Neutral Position";
var last_exercise = "Neutral Position";

// Define the key which the persistent storage system will use to save the data to
const highScoreKey = "hs_template_high_score";

// Get the data associated with the key from the persistent storage system
var persistentStorageSystem = global.persistentStorageSystem.store;
highScore = persistentStorageSystem.getFloat(highScoreKey) || 0;

// Update the high score label
updateHighScoreText();
 
function updateScoreText() {
    script.scoreText.text = "Score: " + currentScore.toString();
}

function updateHighScoreText() {
    script.highScoreText.text = "Top Score: " + highScore.toString();
}


function setHighScore() {
    if (currentScore > highScore) {
        highScore = squatCounter;

        // Set the data associated with the key from the persistent storage system
        persistentStorageSystem.putFloat(highScoreKey, currentScore);

        // Update the high score text since its been updated
        updateHighScoreText();
    }
}

function resetGame() {
    currentScore = 0;
    jumpCounter = 0;
    updateScoreText();
}

function endGame() {
    setHighScore();
    resetGame();
}

script.floorPosition = vec3.zero();
script.foundFloor = false;

script.createEvent("OnStartEvent").bind(function () {
    global.planeTracker.start();    
});

script.createEvent("UpdateEvent").bind(function () {
    if (script.foundFloor === true) {
        cam = script.cameraObject.getTransform().getWorldPosition();
        var deltaY = Math.abs(cam.y - script.floorPosition.y);
        script.currentHeight.text = deltaY.toFixed(2) + "cm";
        camHeight = cam.y;
        //print("camHeight: " + camHeight);
        //print("startHeight: " + startHeight);
        //print("deltaY: " + deltaY);        
        script.currentExercise.text=(baseHeight - camHeight).toFixed(0);



  if ((startHeight - camHeight) > 80)
    {
        if(last_exercise != "Squat")
        {
            squatCounter++;
            print("squatCounter: " + squatCounter);
            currentScore = squatCounter;
            updateScoreText();
        }
        script.currentExercise.text = "SQUAT";
        last_exercise = "Squat";
        //exercisePosition = ExercisePosition.SquatPosition;
    }
  else if((startHeight - camHeight) < -80)
    {
        if(last_exercise != "Jump")
        {
            jumpCounter++;
            script.jumpCounter.text = jumpCounter + "Jumps";
            print("jumpCounter: " + jumpCounter);
        }
        script.currentExercise.text = "JUMP";
        last_exercise = "Jump";
    }
  else
    {
        script.currentExercise.text = "BASEPOSITION";
        last_exercise = "BasePosition";
    }
        return;
    }
    
    if (global.planeTracker.isActive === false) {
        return;
    }
    
    if (global.planeTracker.isValidSurface === true) {
        script.targetObject.enabled = true;
        script.targetObject.getTransform().setWorldPosition(global.planeTracker.position);
        script.targetObject.getTransform().setWorldRotation(global.planeTracker.rotation);
    }
    else {
        script.targetObject.enabled = false;
    }
});

script.createEvent("TapEvent").bind(function () {
    if (global.planeTracker.isValidSurface === true) {
        if (global.planeTracker.surface === global.planeTracker.surfaceType.floor) {
            global.planeTracker.stop();    
            script.foundFloor = true;
            script.floorPosition = global.planeTracker.position;
            camHeight = cam.y;
            startHeight = cam.y;
            return;
        }
    }
});

