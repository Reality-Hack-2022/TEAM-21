// -----JS CODE-----
// @input float swipeDistance = 0.5
// @input float swipeTime = 0.5

global.touchpad = script;

script.forwardSwipe = false;
script.reverseSwipe = false;
script.upwardSwipe = false;
script.downwardSwipe = false;
script.touchStart = vec2.zero();
script.touchTime = 0;

// At the end of every frame, clear all flags.
script.createEvent("LateUpdateEvent").bind(function () {
    script.tapEvent = false;
    script.forwardSwipe = false;
    script.reverseSwipe = false;
    script.upwardSwipe = false;
    script.downwardSwipe = false;
});

script.createEvent("TouchStartEvent").bind(function (eventData) {
    script.touchStart = eventData.getTouchPosition();
    script.touchTime = getTime();
});

script.createEvent("TouchEndEvent").bind(function (eventData) {
    var duration = getTime() - script.touchTime;
    var delta = eventData.getTouchPosition().sub(script.touchStart);
    if (duration < script.swipeTime) 
    {
        //we're going horizontal
        if (delta.x > script.swipeDistance)
        {
            print("[---] Forward swipe");
            script.forwardSwipe = true;
            global.appController.onSwipeForward();
            return;
        }
        else if (delta.x < -script.swipeDistance)
        {
            print("[---] Reverse swipe");
            script.reverseSwipe = true;
            global.appController.onSwipeBackward();
            return;
        }
        //we're going vertical
        else if (delta.y > script.swipeDistance)
        {
            print("[---] Downward swipe");
            script.downwardSwipe = true;
            global.appController.onSwipeDown();
            return;
        }
        else if (delta.y < -script.swipeDistance)
        {
            print("[---] Upward swipe");
            script.upwardSwipe = true;
            global.appController.onSwipeUp();
            return;
        }
    }
    
    script.tapEvent = true;
    global.appController.onTap();
    print("[---] Tapped, time: " + duration.toFixed(2) + " // distance: " + delta.x.toFixed(2));
});
