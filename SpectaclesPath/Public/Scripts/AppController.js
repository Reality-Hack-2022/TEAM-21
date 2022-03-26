// -----JS CODE-----

//@ui {"widget":"group_start", "label":"Sound FX"}
// @input Component.AudioComponent audio
// @input Asset.AudioTrackAsset startupSound
// @input Asset.AudioTrackAsset menuItemSelected
// @input Asset.AudioTrackAsset menuSwiped
// @input Asset.AudioTrackAsset returnToMenuSound
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Carousel Menu"}
// @input Component.ScriptComponent carouselSubscriber
// @input Component.Text menuLabel
// @input SceneObject carousel
// @input vec3 openMenuPos
// @input vec3 closedMenuPos
//@ui {"widget":"group_end"}

//@ui {"widget":"group_start", "label":"Path Drawing"}
// @input SceneObject pathStuff
// @input Component.ScriptComponent drawPath
// @input Component.ScriptComponent userPathCreator
// @input Component.ScriptComponent pathDataManager
// @input Component.ScriptComponent placeObjectsOnPath
//@ui {"widget":"group_end"}

global.appController = script;

script.menuOpen = true;
script.menuIndex = 1;
script.newPathMode = false;


script.createEvent("OnStartEvent").bind(function()
{
    global.planeTracker.start();
    script.audio.audioTrack = script.startupSound;
    script.audio.play(0);
});


script.onSwipeUp = function()
{
    var curPos = script.carousel.getTransform().getLocalPosition();
    if (!script.carousel.enabled) 
    { 
        curPos = script.closedMenuPos;
        script.carousel.enabled = true;
        script.exitCurrent();
    }
    global.tweenManager.stopTween(script.carousel, "menuMove");
    global.tweenManager.setStartValue(script.carousel, "menuMove", curPos);
    global.tweenManager.setEndValue(script.carousel, "menuMove", script.openMenuPos);
    global.tweenManager.startTween(script.carousel, "menuMove", moveComplete, moveStart, moveStop);
    script.menuOpen = true;
}
script.onSwipeDown = function()
{
//    var curPos = script.carousel.getTransform().getLocalPosition();
//    global.tweenManager.stopTween(script.carousel, "menuMove");
//    global.tweenManager.setStartValue(script.carousel, "menuMove", curPos);
//    global.tweenManager.setEndValue(script.carousel, "menuMove", script.closedMenuPos);
//    global.tweenManager.startTween(script.carousel, "menuMove", moveComplete, moveStart, moveStop);
//    script.menuOpen = false;
}
script.onSwipeForward = function() 
{
    if (script.newPathMode)
    {
        global.userPathCreator.getAndStorePathData();
        script.audio.audioTrack = script.menuSwiped;
        script.audio.play(0);
    }
}
script.onSwipeBackward = function()
{
    if (script.newPathMode)
    {
        script.endNewPathMode();
    }
}

function moveStart()  {
    
}
function moveStop() {
    
}
function moveComplete() {
    
}

script.onTap = function()
{
    if (script.menuOpen)
    {
        script.selectMenuItem();
        script.audio.audioTrack = script.menuItemSelected;
        script.audio.play(0);
    }
}

script.exitCurrent = function()
{
    print("Exiting Current");
    script.audio.audioTrack = script.returnToMenuSound;
    script.audio.play(0);
    
    script.stopRunningExperience();
}

script.setHighlighted = function(index)
{
    if (script.menuOpen && index != script.menuIndex)
    {
        script.audio.audioTrack = script.menuSwiped;
        script.audio.play(0);
        script.menuIndex = index;
        switch (index)
        {
            case 0:
                script.menuLabel.text = "Jumping Jacks";
                break;
            case 1:
                script.menuLabel.text = "Running";
                break;
            case 2:
                script.menuLabel.text = "Squats";
                break;
            case 3:
                script.menuLabel.text = "Comming Soon: Yoga";
                break;
            case 4:
                script.menuLabel.text = "Comming Soon: Weights";
                break;
            case 5:
                script.menuLabel.text = "Comming Soon: Sprints";
                break;
            case 6:
                script.menuLabel.text = "Set new path";
                break;
        }
    }
    
}
script.showMenu = function()
{
    
}
script.selectMenuItem = function()
{
    script.carousel.enabled = false;
    script.menuOpen = false;
    switch (script.menuIndex)
    {
        case 0:
            print("selected Jump");
            break;
        case 1:
            print("selected Run");
            script.startRunningExperience();
            break;
        case 2:
            print("selected Squat");
            break;
        case 3:
            print("selected Yoga");
            break;
        case 4:
            print("selected Weights");
            break;
        case 5:
            print("selected Sprint");
            break;
        case 6:
            script.createNewRunningPath();
            print("selected NewPath");
            break;
    }
    //print("Menu Item " + script.menuIndex + " selected");
}
script.hideMenu = function()
{
    
}


script.createNewRunningPath = function()
{
    //script.userPathCreator.enabled = true;
    global.userPathCreator.clearPathData();
    script.newPathMode = true;
    print("Create new running path");
}
script.endNewPathMode = function()
{
    script.newPathMode = false;
    script.onSwipeUp(); //returns back to menu
    print("End creating new running path");
}
script.loadLastRunningPath = function()
{
    global.drawPath.activate();
}
script.startRunningExperience = function()
{
    //global.globalPathDataManager.activate();
    global.globalPathDataManager.loadCachedPath();
    global.drawPath.enabled = true;
    global.drawPath.activate();
    script.placeObjectsOnPath.enabled = true;
    print("Starting running Experience");
}
script.stopRunningExperience = function()
{
    global.drawPath.enabled = false;
    script.placeObjectsOnPath.enabled = false;
    print("Ending running Experience");
}
script.startSquatsExperience = function()
{
    
}


