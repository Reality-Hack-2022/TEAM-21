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
// @input Component.ScriptComponent drawPath
// @input Component.ScriptComponent userPathCreator
// @input Component.ScriptComponent pathDataManager
// @input Component.ScriptComponent placeObjectsOnPath
//@ui {"widget":"group_end"}

global.appController = script;

script.menuOpen = true;
script.menuIndex;


script.createEvent("OnStartEvent").bind(function()
{
    script.audio.audioTrack = script.startupSound;
    script.audio.play(0);
});


script.onSwipeForward = function() { }
script.onSwipeBackward = function() { }
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
    var curPos = script.carousel.getTransform().getLocalPosition();
    global.tweenManager.stopTween(script.carousel, "menuMove");
    global.tweenManager.setStartValue(script.carousel, "menuMove", curPos);
    global.tweenManager.setEndValue(script.carousel, "menuMove", script.closedMenuPos);
    global.tweenManager.startTween(script.carousel, "menuMove", moveComplete, moveStart, moveStop);
    script.menuOpen = false;
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
    script.audio.audioTrack = script.returnToMenuSound;
    script.audio.play(0);
    print("Exiting Current");
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
            print("was 0");
            break;
        case 1:
            print("Was 1");
            break;
        case 2:
            print("was 2");
            break;
        case 3:
            print("was 3");
            break;
        case 4:
            print("was 4");
            break;
        case 5:
            print("was 5");
            break;
    }
    print("Menu Item " + script.menuIndex + " selected");
}
script.hideMenu = function()
{
    
}


script.createNewRunningPath = function()
{
    script.userPathCreator.enabled = true;
}
script.loadLastRunningPath = function()
{
    
}
script.startRunningExperience = function()
{
    global.placeObjectsOnPath.enabled = true;
}
script.stopRunningExperience = function()
{
    global.placeObjectsOnPath.enabled = false;
}
script.startSquatsExperience = function()
{
    
}


