gdjs._24341_23566Code = {};
gdjs._24341_23566Code.localVariables = [];
gdjs._24341_23566Code.idToCallbackMap = new Map();
gdjs._24341_23566Code.GDBootBGObjects1= [];
gdjs._24341_23566Code.GDBootBGObjects2= [];
gdjs._24341_23566Code.GDBootTextObjects1= [];
gdjs._24341_23566Code.GDBootTextObjects2= [];
gdjs._24341_23566Code.GDAudioButtonObjects1= [];
gdjs._24341_23566Code.GDAudioButtonObjects2= [];
gdjs._24341_23566Code.GDNewSpriteObjects1= [];
gdjs._24341_23566Code.GDNewSpriteObjects2= [];
gdjs._24341_23566Code.GDCustomCursorObjects1= [];
gdjs._24341_23566Code.GDCustomCursorObjects2= [];


gdjs._24341_23566Code.userFunc0xda0ca8 = function GDJSInlineCode(runtimeScene) {
"use strict";
 // ==========================================
 // CHAIN / MATCH
 // 全場景 UI HOVER 音效 V2
 //
 // 滑鼠移入按鈕：播放一次
 // 停留按鈕：不重複
 // 離開後再次移入：重新播放
 // ==========================================

 const SOUND = "UI_Hover.mp3";
 
const VOLUME = Math.max(0, Math.min(100,
  runtimeScene.getGame()
    .getVariables()
    .get("SFXVolume")
    .getAsNumber()
));
  

 // 沒有以 Button 結尾的按鈕，
 // 可以將名稱加入這裡。
 const EXTRA_BUTTONS = [
   "PauseHome",
   "PauseRestart",
   "Skill1Button",
   "Skill2Button",
   "Skill3Button",
   "START", 
   "Setting",
   "BACK",
   "SelectLeft",
   "SelectLight",
   "TimedButton",
   "FreeButton",
   "ConfirmButton",
   "retry",
   "MENU",
   "NewButton"
 ];

 // 記住上一次滑鼠停在哪顆按鈕
 if (runtimeScene._uiHoverLast === undefined) {
   runtimeScene._uiHoverLast = null;
 }

 // 遊戲是否正在暫停
 const isGame = runtimeScene.getName() === "遊戲";

 const isPaused = isGame &&
   runtimeScene.getVariables()
     .get("PauseOpen")
     .getAsNumber() === 1;

 // 暫停選單中的按鈕
 const pauseButtons = [
   "PauseButton2",
   "PauseHome",
   "PauseRestart"
 ];

 // 取得圖層順序
 const layers = [];
 runtimeScene.getAllLayerNames(layers);

 let hovered = null;
 let highest = -Infinity;

 // 搜尋目前場景中的按鈕
 const objects =
   runtimeScene.getAdhocListOfAllInstances();

 for (const obj of objects) {

   const name = obj.getName();

   // 自動辨識 Button / Button2 等名稱
   const isButton =
     /Button\d*$/i.test(name) ||
     EXTRA_BUTTONS.includes(name);

   if (!isButton) continue;

   // 忽略隱藏的按鈕
   if (!obj.isVisible()) continue;

   const layer = runtimeScene.getLayer(
     obj.getLayer()
   );

   if (!layer.isVisible()) continue;

   // 暫停時不偵測底下的遊戲按鈕
   if (isGame) {

     const isPauseMenu =
       pauseButtons.includes(name);

     if (isPaused && !isPauseMenu) {
       continue;
     }

     if (!isPaused && isPauseMenu) {
       continue;
     }
   }

   // 滑鼠不在按鈕上就跳過
   if (!obj.cursorOnObject()) continue;

   // 按鈕重疊時，選最上面的
   const layerIndex =
     layers.indexOf(obj.getLayer());

   const order =
     layerIndex * 100000 + obj.getZOrder();

   if (order > highest) {
     highest = order;
     hovered = obj;
   }
 }

 // 游標進入另一顆按鈕時才播聲音
 if (hovered !== runtimeScene._uiHoverLast) {

   if (hovered) {

     gdjs.evtTools.sound.playSound(
       runtimeScene,
       SOUND,
       false,
       VOLUME,
       1
     );
   }

   // 記住目前按鈕，沒有則記 null
   runtimeScene._uiHoverLast = hovered;
 }

};
gdjs._24341_23566Code.userFunc0x8c4840 = function GDJSInlineCode(runtimeScene) {
"use strict";

 // ========================================
 // CHAIN / MATCH
 // 自訂滑鼠游標 V1
 // ========================================

 const cursor = runtimeScene
   .getObjects("CustomCursor")[0];

 if (cursor) {

   // 隱藏原本的系統滑鼠
   gdjs.evtTools.input.hideCursor(runtimeScene);

   // 取得滑鼠在游標圖層的位置
   const x = gdjs.evtTools.input.getCursorX(
     runtimeScene,
     cursor.getLayer(),
     0
   );

   const y = gdjs.evtTools.input.getCursorY(
     runtimeScene,
     cursor.getLayer(),
     0
   );

   // 讓自訂圖片跟著滑鼠
   cursor.setPosition(x, y);

   // 放在該圖層最上方
   cursor.setZOrder(99999);

   cursor.hide(false);
 }

};
gdjs._24341_23566Code.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
{
}

}


{


gdjs._24341_23566Code.userFunc0xda0ca8(runtimeScene);

}


{


gdjs._24341_23566Code.userFunc0x8c4840(runtimeScene);

}


{


let isConditionTrue_0 = false;
{
}

}


{

gdjs.copyArray(runtimeScene.getObjects("AudioButton"), gdjs._24341_23566Code.GDAudioButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs._24341_23566Code.GDAudioButtonObjects1.length;i<l;++i) {
    if ( gdjs._24341_23566Code.GDAudioButtonObjects1[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs._24341_23566Code.GDAudioButtonObjects1[k] = gdjs._24341_23566Code.GDAudioButtonObjects1[i];
        ++k;
    }
}
gdjs._24341_23566Code.GDAudioButtonObjects1.length = k;
if (isConditionTrue_0) {
{gdjs.evtTools.sound.playMusicOnChannel(runtimeScene, "Performance.mp3", 1, true, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getGame().getVariables().getFromIndex(2)), 1);
}
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "主畫面", false);
}
{gdjs.evtTools.sound.setMusicOnChannelVolume(runtimeScene, 1, 20);
}
}

}


{


let isConditionTrue_0 = false;
{
{gdjs.evtTools.sound.preloadMusic(runtimeScene, "Fruitful-Day.mp3");
}
}

}


{


let isConditionTrue_0 = false;
{
{gdjs.evtTools.sound.preloadMusic(runtimeScene, "UI_Hover.mp3");
}
}

}


};

gdjs._24341_23566Code.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs._24341_23566Code.GDBootBGObjects1.length = 0;
gdjs._24341_23566Code.GDBootBGObjects2.length = 0;
gdjs._24341_23566Code.GDBootTextObjects1.length = 0;
gdjs._24341_23566Code.GDBootTextObjects2.length = 0;
gdjs._24341_23566Code.GDAudioButtonObjects1.length = 0;
gdjs._24341_23566Code.GDAudioButtonObjects2.length = 0;
gdjs._24341_23566Code.GDNewSpriteObjects1.length = 0;
gdjs._24341_23566Code.GDNewSpriteObjects2.length = 0;
gdjs._24341_23566Code.GDCustomCursorObjects1.length = 0;
gdjs._24341_23566Code.GDCustomCursorObjects2.length = 0;

gdjs._24341_23566Code.eventsList0(runtimeScene);
gdjs._24341_23566Code.GDBootBGObjects1.length = 0;
gdjs._24341_23566Code.GDBootBGObjects2.length = 0;
gdjs._24341_23566Code.GDBootTextObjects1.length = 0;
gdjs._24341_23566Code.GDBootTextObjects2.length = 0;
gdjs._24341_23566Code.GDAudioButtonObjects1.length = 0;
gdjs._24341_23566Code.GDAudioButtonObjects2.length = 0;
gdjs._24341_23566Code.GDNewSpriteObjects1.length = 0;
gdjs._24341_23566Code.GDNewSpriteObjects2.length = 0;
gdjs._24341_23566Code.GDCustomCursorObjects1.length = 0;
gdjs._24341_23566Code.GDCustomCursorObjects2.length = 0;


return;

}

gdjs['_24341_23566Code'] = gdjs._24341_23566Code;
