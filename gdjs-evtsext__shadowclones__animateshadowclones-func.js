
if (typeof gdjs.evtsExt__ShadowClones__AnimateShadowClones !== "undefined") {
  gdjs.evtsExt__ShadowClones__AnimateShadowClones.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__ShadowClones__AnimateShadowClones = {};
gdjs.evtsExt__ShadowClones__AnimateShadowClones.idToCallbackMap = new Map();
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1= [];
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects2= [];
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects3= [];
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDShadowCloneObjectObjects1= [];
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDShadowCloneObjectObjects2= [];
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDShadowCloneObjectObjects3= [];


gdjs.evtsExt__ShadowClones__AnimateShadowClones.mapOfGDgdjs_9546evtsExt_9595_9595ShadowClones_9595_9595AnimateShadowClones_9546GDPrimaryObjectObjects1Objects = Hashtable.newFrom({"PrimaryObject": gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1});
gdjs.evtsExt__ShadowClones__AnimateShadowClones.mapOfGDgdjs_9546evtsExt_9595_9595ShadowClones_9595_9595AnimateShadowClones_9546GDShadowCloneObjectObjects1Objects = Hashtable.newFrom({"ShadowCloneObject": gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDShadowCloneObjectObjects1});
gdjs.evtsExt__ShadowClones__AnimateShadowClones.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getArgument("MatchScaleX");
}
if (isConditionTrue_0) {
{eventsFunctionContext.localVariables[0].getFromIndex(7).setNumber(1);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getArgument("MatchScaleY");
}
if (isConditionTrue_0) {
{eventsFunctionContext.localVariables[0].getFromIndex(1).setNumber(1);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getArgument("MatchAngle");
}
if (isConditionTrue_0) {
{eventsFunctionContext.localVariables[0].getFromIndex(0).setNumber(1);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getArgument("MatchAnimation");
}
if (isConditionTrue_0) {
{eventsFunctionContext.localVariables[0].getFromIndex(3).setNumber(1);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getArgument("MatchAnimationFrame");
}
if (isConditionTrue_0) {
{eventsFunctionContext.localVariables[0].getFromIndex(4).setNumber(1);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getArgument("MatchVerticalFlip");
}
if (isConditionTrue_0) {
{eventsFunctionContext.localVariables[0].getFromIndex(5).setNumber(1);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = eventsFunctionContext.getArgument("MatchHorizontalFlip");
}
if (isConditionTrue_0) {
{eventsFunctionContext.localVariables[0].getFromIndex(6).setNumber(1);
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(eventsFunctionContext.getObjects("PrimaryObject"), gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1);
gdjs.copyArray(eventsFunctionContext.getObjects("ShadowCloneObject"), gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDShadowCloneObjectObjects1);
{gdjs.evtsExt__ShadowClones__AnimateShadowClonesWithCapabilities.func(runtimeScene, gdjs.evtsExt__ShadowClones__AnimateShadowClones.mapOfGDgdjs_9546evtsExt_9595_9595ShadowClones_9595_9595AnimateShadowClones_9546GDPrimaryObjectObjects1Objects, eventsFunctionContext.getBehaviorName("Scale"), eventsFunctionContext.getBehaviorName("Flippable"), eventsFunctionContext.getBehaviorName("Opacity"), eventsFunctionContext.getBehaviorName("Animation"), gdjs.evtsExt__ShadowClones__AnimateShadowClones.mapOfGDgdjs_9546evtsExt_9595_9595ShadowClones_9595_9595AnimateShadowClones_9546GDShadowCloneObjectObjects1Objects, eventsFunctionContext.getBehaviorName("Scale"), eventsFunctionContext.getBehaviorName("Flippable"), eventsFunctionContext.getBehaviorName("Opacity"), eventsFunctionContext.getBehaviorName("Animation"), eventsFunctionContext.getArgument("ClonesCount"), Math.max(1, eventsFunctionContext.getArgument("GapFrames")), ((( gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Opacity")).getOpacity()) - eventsFunctionContext.getArgument("FadeSpeed")) / (( gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Opacity")).getOpacity()), ((( gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Opacity")).getOpacity()) - eventsFunctionContext.getArgument("FadeSpeed") * eventsFunctionContext.getArgument("ClonesCount")) / (( gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Opacity")).getOpacity()), (( gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1.length === 0 ) ? 0 :gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1[0].getBehavior(eventsFunctionContext.getBehaviorName("Scale")).getScale()) - eventsFunctionContext.getArgument("ClonesCount") * eventsFunctionContext.getArgument("ShrinkSpeed") / 100, eventsFunctionContext.getArgument("ShadowCloneLayer"), eventsFunctionContext.getArgument("ShadowCloneZValue"), eventsFunctionContext.localVariables[0].getFromIndex(7).getAsNumber(), eventsFunctionContext.localVariables[0].getFromIndex(1).getAsNumber(), eventsFunctionContext.localVariables[0].getFromIndex(0).getAsNumber(), eventsFunctionContext.localVariables[0].getFromIndex(3).getAsNumber(), eventsFunctionContext.localVariables[0].getFromIndex(4).getAsNumber(), eventsFunctionContext.localVariables[0].getFromIndex(5).getAsNumber(), eventsFunctionContext.localVariables[0].getFromIndex(6).getAsNumber(), eventsFunctionContext);
}
}

}


};gdjs.evtsExt__ShadowClones__AnimateShadowClones.eventsList1 = function(runtimeScene, eventsFunctionContext) {

{


{
const variables = new gdjs.VariablesContainer();
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("MatchAngleValue", variable);
}
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("MatchScaleYValue", variable);
}
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("CopyOfMatchAngleValue", variable);
}
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("MatchAnimationValue", variable);
}
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("MatchAnimationFrameValue", variable);
}
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("MatchVerticalFlipValue", variable);
}
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("MatchHorizontalFlipValue", variable);
}
{
const variable = new gdjs.Variable();
variable.setNumber(0);
variables._declare("MatchScaleXValue", variable);
}
eventsFunctionContext.localVariables.push(variables);
}
let isConditionTrue_0 = false;
{

{ //Subevents
gdjs.evtsExt__ShadowClones__AnimateShadowClones.eventsList0(runtimeScene, eventsFunctionContext);} //End of subevents
}
eventsFunctionContext.localVariables.pop();

}


};

gdjs.evtsExt__ShadowClones__AnimateShadowClones.func = function(runtimeScene, PrimaryObject, ShadowCloneObject, ClonesCount, GapFrames, FadeSpeed, ShrinkSpeed, ShadowCloneLayer, ShadowCloneZValue, MatchScaleX, MatchScaleY, MatchAngle, MatchAnimation, MatchAnimationFrame, MatchVerticalFlip, MatchHorizontalFlip, parentEventsFunctionContext) {
let scopeInstanceContainer = null;
var eventsFunctionContext = {
  _objectsMap: {
"PrimaryObject": PrimaryObject
, "ShadowCloneObject": ShadowCloneObject
},
  _objectArraysMap: {
"PrimaryObject": gdjs.objectsListsToArray(PrimaryObject)
, "ShadowCloneObject": gdjs.objectsListsToArray(ShadowCloneObject)
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("ShadowClones"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("ShadowClones"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "ClonesCount") return ClonesCount;
if (argName === "GapFrames") return GapFrames;
if (argName === "FadeSpeed") return FadeSpeed;
if (argName === "ShrinkSpeed") return ShrinkSpeed;
if (argName === "ShadowCloneLayer") return ShadowCloneLayer;
if (argName === "ShadowCloneZValue") return ShadowCloneZValue;
if (argName === "MatchScaleX") return MatchScaleX;
if (argName === "MatchScaleY") return MatchScaleY;
if (argName === "MatchAngle") return MatchAngle;
if (argName === "MatchAnimation") return MatchAnimation;
if (argName === "MatchAnimationFrame") return MatchAnimationFrame;
if (argName === "MatchVerticalFlip") return MatchVerticalFlip;
if (argName === "MatchHorizontalFlip") return MatchHorizontalFlip;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1.length = 0;
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects2.length = 0;
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects3.length = 0;
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDShadowCloneObjectObjects1.length = 0;
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDShadowCloneObjectObjects2.length = 0;
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDShadowCloneObjectObjects3.length = 0;

gdjs.evtsExt__ShadowClones__AnimateShadowClones.eventsList1(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects1.length = 0;
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects2.length = 0;
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDPrimaryObjectObjects3.length = 0;
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDShadowCloneObjectObjects1.length = 0;
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDShadowCloneObjectObjects2.length = 0;
gdjs.evtsExt__ShadowClones__AnimateShadowClones.GDShadowCloneObjectObjects3.length = 0;


return;
}

gdjs.evtsExt__ShadowClones__AnimateShadowClones.registeredGdjsCallbacks = [];