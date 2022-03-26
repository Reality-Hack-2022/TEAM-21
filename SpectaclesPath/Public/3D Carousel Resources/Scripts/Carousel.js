// Carousel.js
// Version: 1.0.0
// Event: Awake
// Description: Creates a UI carousel widget from a given scene object with a number of children in it.
// API provider usage: 
//           script.api.setIndex = function (index) {
//               print("Carousel's current index set to " + index)
//           }

global.carousel = script;

//@input SceneObject iconsRoot
//@input Component.Script apiProvider
//@input Component.Camera camera
//@ui {"widget":"separator"}
//@input float swipeSensitivity
//@ui {"widget":"separator"}
//@input float depthPosition
//@input float verticalPosition
//@ui {"widget":"separator"}
//@input int margin = 20
//@input float scale = 1.0
//@ui {"widget":"separator"}
//@input int layerIndex
//@input bool touchBlock


if (!script.camera) {
    print("Error: Please set camera to attach carousel.");
    return;
}


if (!script.iconsRoot) {
    print("Error: Please set iconsRoot, the object with child icons in it.");
    return;
}


if (script.touchBlock) {
    global.touchSystem.touchBlocking = true;
}


// Declare carousel
var Carousel = function () {
    this.root = script.getSceneObject();
    this.initPosition = script.camera.screenSpaceToWorldSpace(new vec2(0.5, script.verticalPosition), script.depthPosition);
    this.currentPosition = this.initPosition;
    this.root.getTransform().setLocalPosition(this.initPosition);
    this.currentIndex = 0;
    this.onChangeSubscribers = [];
};


Carousel.prototype.build = function (count) {
    var len = script.iconsRoot.getChildrenCount();
    for (var i = 0; i < len; i++) {
        var sourceObject = script.iconsRoot.getChild(i);
        var icon = this.root.copyWholeHierarchy(sourceObject);
        icon.getTransform().setLocalPosition(new vec3(i * script.margin, 0, 0));
        icon.getTransform().setLocalScale(new vec3(script.scale, script.scale, script.scale));
        icon.getTransform().setLocalRotation(quat.fromEulerAngles(0.35, 0.78, 0.25));
        if (script.layerIndex > 0) {
            icon.setRenderLayer(script.layerIndex);
            for (var j = 0; j < icon.getChildrenCount(); j++) {
                icon.getChild(j).setRenderLayer(script.layerIndex);
            }
        }
    }
};


Carousel.prototype.setIndex = function (index) {
    this.currentPosition = this.initPosition.add(new vec3(index * -script.margin, 0, 0));
    this.currentIndex = index;

    for (var i = 0; i < this.onChangeSubscribers.length; i++) {
        this.onChangeSubscribers[i].call(this.onChangeSubscribers[i], index);
    }

    if (script.apiProvider && script.apiProvider.api.setIndex) {
        script.apiProvider.api.setIndex(index)
    }
};


Carousel.prototype.lerp = function () {
    var thisPos = this.root.getTransform().getLocalPosition();
    var newPos = vec3.lerp(this.currentPosition, thisPos, 0.8);
    this.root.getTransform().setLocalPosition(newPos);

    for (var i = 0; i < this.root.getChildrenCount(); i++) {
        var currentScale = this.root.getChild(i).getTransform().getLocalScale();
        var lerpScale = vec3.lerp(currentScale, new vec3(script.scale, script.scale, script.scale), 0.25);
        this.root.getChild(i).getTransform().setLocalScale(lerpScale);
    }

    var currChildScale = this.root.getChild(this.currentIndex).getTransform().getLocalScale();
    var currLerpScale = vec3.lerp(currChildScale, vec3.one(), 0.25);
    this.root.getChild(this.currentIndex).getTransform().setLocalScale(currLerpScale);
};


Carousel.prototype.updateInitPosition = function (pos) {
    this.initPosition = pos;
    this.currentPosition = this.initPosition;
    this.root.getTransform().setLocalPosition(this.initPosition);
};


// Build carousel
var carousel = new Carousel();
carousel.build();
carousel.setIndex(1);


// Setup Touch gestures
var touched = false;
var touchPos = vec2.zero();
var rootLocalPos = vec3.zero();

script.createEvent("UpdateEvent").bind(function () {
    carousel.lerp();
});


script.createEvent("TouchStartEvent").bind(function (data) {
    rootLocalPos = carousel.root.getTransform().getLocalPosition();
    touchPos = data.getTouchPosition();
    touched = true;
});


script.createEvent("TouchMoveEvent").bind(function (data) {
    if (!touched) {
        return;
    }
    var movePos = data.getTouchPosition();
    var delta = movePos.x - touchPos.x;
    carousel.currentPosition = rootLocalPos.add(new vec3(delta * script.swipeSensitivity, 0, 0));
});


script.createEvent("TouchEndEvent").bind(function (data) {
    var newStyle = Math.round(carousel.currentPosition.x / script.margin);
    newStyle = Math.max(-script.iconsRoot.getChildrenCount() + 1, newStyle);
    newStyle = Math.min(0, newStyle);
    carousel.setIndex(-newStyle);
    touched = false;
});


script.api.onChange = {
    add: function (fun) {
        carousel.onChangeSubscribers.push(fun);
    },
    remove: function (fun) {
        carousel.onChangeSubscribers.pop(fun);
    }
};
