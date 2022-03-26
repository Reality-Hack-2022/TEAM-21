// -----JS CODE-----
// STATE MACHINE
// @input bool printTransitions
// @input string initialState

global.stateMachine = script;

// This is an example
global.stateName = {
    findFloor: "findFloor",
    tap: "tap",
    move: "move",
    hasNotBeenSet: "hasNotBeenSet"
}

// this will be Component.ScriptComponent that is a copy of "_BaseState"
script.activeState; 
script.states = new Object();

script.getStateName = function () {
    if (script.activeState === undefined) {
        return "undefined";
    }
    return script.activeState.stateName;
}

script.goToState = function (stateName) {
    
    // Exit the current state
    if (script.activeState !== undefined) {
        if (script.printTransitions == true) {
            print("State Machine: Exit " + script.activeState.stateName);
        }
        script.activeState.exit();
        script.activeState.getSceneObject().enabled = false;
    }

    // Find and enter the requested state
    if (stateName in script.states) {
        script.activeState = script.states[stateName];
        if (script.printTransitions == true) {
            print("State Machine: Enter " + script.activeState.stateName);
        }
        script.activeState.getSceneObject().enabled = true;
        script.activeState.enter();
    }
    else {
        print("[!!!] State Machine Error: State [" + stateName + "] not found");
        script.activeState = undefined;
    }
}

// Called by copies of "_BaseState" on Awake
// Make sure they are lower in the hierarchy than this!
script.register = function (scriptObject) {
    var stateName = scriptObject.stateName;
    
    if (stateName === undefined) {
        print("[!!!] State Machine Error: Can't register a state without a stateName");
    }
    else if (stateName in script.states) {
        print("[!!!] State Machine Error: Duplicate state " + stateName + " ignored");
    }
    else {
        script.states[stateName] = scriptObject;
    }
}

script.createEvent("OnStartEvent").bind(function() {
    if (script.initialState === "") {
        print("[!!!] State Machine Error: Initial state not set");
        return;
    }
    
    if (Object.keys(script.states).length === 0) {
        print("[!!!] State Machine Error: No states have been added");
        return;
    }
    
    // Disable all state objects (don't exit them: that should be separate)
    for (var s in script.states) {
        script.states[s].getSceneObject().enabled = false;
    };
    
    if (script.initialState in script.states === false) {
        print("[!!!] State Machine Error: Initial state " + script.initialState + " is not registered");
        return;
    }
    
    // Go to the initial state as defined in the inspector
    global.stateMachine.goToState(script.initialState);
});

script.createEvent("UpdateEvent").bind(function() {
    // This avoids problems during capture on Spectacles
    if (getDeltaTime() === 0) {
        return;
    }
    
    if (script.activeState !== undefined) {
        script.activeState.process();
    }
});
