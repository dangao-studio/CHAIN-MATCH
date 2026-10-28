gdjs._20027_30059_38754Code = {};
gdjs._20027_30059_38754Code.localVariables = [];
gdjs._20027_30059_38754Code.idToCallbackMap = new Map();
gdjs._20027_30059_38754Code.GDGameLogoObjects1= [];
gdjs._20027_30059_38754Code.GDGameLogoObjects2= [];
gdjs._20027_30059_38754Code.GDSTARTObjects1= [];
gdjs._20027_30059_38754Code.GDSTARTObjects2= [];
gdjs._20027_30059_38754Code.GDSettingObjects1= [];
gdjs._20027_30059_38754Code.GDSettingObjects2= [];
gdjs._20027_30059_38754Code.GDSettingsBGObjects1= [];
gdjs._20027_30059_38754Code.GDSettingsBGObjects2= [];
gdjs._20027_30059_38754Code.GDSettingsTitleObjects1= [];
gdjs._20027_30059_38754Code.GDSettingsTitleObjects2= [];
gdjs._20027_30059_38754Code.GDBACKObjects1= [];
gdjs._20027_30059_38754Code.GDBACKObjects2= [];
gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1= [];
gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects2= [];
gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1= [];
gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects2= [];
gdjs._20027_30059_38754Code.GDBGM_9595TextObjects1= [];
gdjs._20027_30059_38754Code.GDBGM_9595TextObjects2= [];
gdjs._20027_30059_38754Code.GDSFX_9595TextObjects1= [];
gdjs._20027_30059_38754Code.GDSFX_9595TextObjects2= [];
gdjs._20027_30059_38754Code.GD_9537002_9526694Objects1= [];
gdjs._20027_30059_38754Code.GD_9537002_9526694Objects2= [];
gdjs._20027_30059_38754Code.GDbgObjects1= [];
gdjs._20027_30059_38754Code.GDbgObjects2= [];
gdjs._20027_30059_38754Code.GDNewSpriteObjects1= [];
gdjs._20027_30059_38754Code.GDNewSpriteObjects2= [];
gdjs._20027_30059_38754Code.GDCustomCursorObjects1= [];
gdjs._20027_30059_38754Code.GDCustomCursorObjects2= [];
gdjs._20027_30059_38754Code.GDIGObjects1= [];
gdjs._20027_30059_38754Code.GDIGObjects2= [];
gdjs._20027_30059_38754Code.GDYTObjects1= [];
gdjs._20027_30059_38754Code.GDYTObjects2= [];
gdjs._20027_30059_38754Code.GDDCObjects1= [];
gdjs._20027_30059_38754Code.GDDCObjects2= [];
gdjs._20027_30059_38754Code.GD_9520171_9532057Objects1= [];
gdjs._20027_30059_38754Code.GD_9520171_9532057Objects2= [];
gdjs._20027_30059_38754Code.GDNewSprite2Objects1= [];
gdjs._20027_30059_38754Code.GDNewSprite2Objects2= [];
gdjs._20027_30059_38754Code.GD_9520171_95320572Objects1= [];
gdjs._20027_30059_38754Code.GD_9520171_95320572Objects2= [];


gdjs._20027_30059_38754Code.userFunc0xbb14b0 = function GDJSInlineCode(runtimeScene) {
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
gdjs._20027_30059_38754Code.userFunc0xda0ca8 = function GDJSInlineCode(runtimeScene) {
"use strict";
 // ==========================================
 // CHAIN / MATCH
 // ScreenFX V9 - CCTV + DEPTH RGB
 //
 // 1. CRT 曲面
 // 2. 大範圍暈影
 // 3. 水平掃描線
 // 4. 少量動態雜訊
 // 5. 移動訊號線
 // 6. 遠近漸變 RGB 色差
 //
 // 不需要額外素材
 // ==========================================


 // ==========================================
 // 1. 效果設定
 // ==========================================

 // ===== CCTV =====

 const SCANLINE = 0.10;
 const NOISE = 0.015;

 const CURVATURE = 0.035;

 const VIGNETTE = 0.45;
 const VIGNETTE_START = 0.35;
 const VIGNETTE_END = 1.20;

 const ROLLING_LINE = 0.018;
 const ROLL_SPEED = 0.06;

 const LINE_SPACING = 4.0;


 // ===== RGB 遠近色差 =====

 // 畫面中央色差（像素）
 const RGB_NEAR = 0.2;

 // 畫面四周色差（像素）
 const RGB_FAR = 3.5;

 // 色差呼吸強度
 // 0 = 不呼吸
 const RGB_BREATH = 0.12;

 // 色差呼吸速度
 const RGB_SPEED = 0.65;


 // ==========================================
 // 2. 取得 PixiJS
 // ==========================================

 if (
   typeof PIXI !== "undefined" &&
   PIXI.Filter
 ) {

   const container =
     runtimeScene.getRenderer()
       .getPIXIContainer();

   const width = Math.max(
     1,
     runtimeScene.getViewportWidth()
   );

   const height = Math.max(
     1,
     runtimeScene.getViewportHeight()
   );

   let fx = runtimeScene._chainScreenFX;


   // ========================================
   // 3. 初始化濾鏡
   // ========================================

   if (
     !fx ||
     fx.version !== 9 ||
     fx.container !== container
   ) {

     // 移除舊版 ScreenFX
     if (
       fx &&
       fx.filter &&
       fx.container
     ) {

       fx.container.filters =
         (fx.container.filters || [])
           .filter(f => f !== fx.filter);
     }


     // ======================================
     // 4. CCTV + RGB Shader
     // ======================================

     const fragment = `
       precision mediump float;

       varying vec2 vTextureCoord;

       uniform sampler2D uSampler;
       uniform vec4 inputClamp;

       uniform vec2 uScreenSize;

       uniform float uTime;

       uniform float uScanline;
       uniform float uNoise;
       uniform float uCurve;
       uniform float uVignette;

       uniform float uVignetteStart;
       uniform float uVignetteEnd;

       uniform float uRolling;
       uniform float uRollSpeed;
       uniform float uLineSpacing;

       // RGB 色差
       uniform float uRGBNear;
       uniform float uRGBFar;
       uniform float uRGBBreath;
       uniform float uRGBSpeed;


       // ================================
       // 隨機雜訊函式
       // ================================

       float hash(vec2 p) {

         return fract(
           sin(dot(
             p,
             vec2(127.1, 311.7)
           )) * 43758.5453
         );
       }


       void main(void) {

         // ================================
         // A. 畫面座標
         // ================================

         vec2 range = max(
           inputClamp.zw - inputClamp.xy,
           vec2(0.0001)
         );

         vec2 uv =
           (vTextureCoord - inputClamp.xy)
           / range;

         vec2 centered =
           uv * 2.0 - 1.0;


         // ================================
         // B. CRT 曲面
         // ================================

         float radius =
           dot(centered, centered);

         vec2 bent =
           centered *
           (1.0 + uCurve * radius);

         vec2 curvedUV =
           bent * 0.5 + 0.5;


         // ================================
         // C. 曲面邊緣
         // ================================

         float edgeDistance = min(
           min(
             curvedUV.x,
             1.0 - curvedUV.x
           ),
           min(
             curvedUV.y,
             1.0 - curvedUV.y
           )
         );

         float edgeMask =
           smoothstep(
             -0.005,
             0.016,
             edgeDistance
           );


         // ================================
         // D. RGB 遠近計算
         // ================================

         // 計算離畫面中心的距離
         float distanceFromCenter =
           length(
             centered *
             vec2(1.0, 0.92)
           );

         // 0 = 中央
         // 1 = 四周
         float depth =
           smoothstep(
             0.12,
             1.20,
             distanceFromCenter
           );

         // 中央色差弱
         // 越靠近四周色差越強
         float rgbStrength =
           mix(
             uRGBNear,
             uRGBFar,
             depth
           );

         // 非常緩慢的呼吸變化
         float breathing =
           1.0 +
           sin(uTime * uRGBSpeed)
           * uRGBBreath;

         rgbStrength *= breathing;


         // ================================
         // E. RGB 分離方向
         // ================================

         // 讓色差沿著中心向外擴散
         vec2 direction =
           centered /
           max(length(centered), 0.0001);

         // 將像素位移換成 UV 位移
         vec2 rgbOffset =
           direction *
           rgbStrength /
           max(uScreenSize, vec2(1.0));

         // 紅色向外
         vec2 redUV =
           curvedUV + rgbOffset;

         // 藍色向內
         vec2 blueUV =
           curvedUV - rgbOffset;

         // 分別限制在畫面範圍內
         vec2 normalUV =
           clamp(curvedUV, 0.0, 1.0);

         redUV =
           clamp(redUV, 0.0, 1.0);

         blueUV =
           clamp(blueUV, 0.0, 1.0);


         // ================================
         // F. 讀取 RGB 三個通道
         // ================================

         vec2 normalSample = mix(
           inputClamp.xy,
           inputClamp.zw,
           normalUV
         );

         vec2 redSample = mix(
           inputClamp.xy,
           inputClamp.zw,
           redUV
         );

         vec2 blueSample = mix(
           inputClamp.xy,
           inputClamp.zw,
           blueUV
         );

         vec4 original = texture2D(
           uSampler,
           normalSample
         );

         vec4 redPart = texture2D(
           uSampler,
           redSample
         );

         vec4 bluePart = texture2D(
           uSampler,
           blueSample
         );

         // 合成三個顏色通道
         vec3 color = vec3(
           redPart.r,
           original.g,
           bluePart.b
         );


         // ================================
         // G. CCTV 水平掃描線
         // ================================

         float pixelY =
           uv.y * uScreenSize.y;

         float scan =
           0.5 +
           0.5 * cos(
             pixelY *
             6.2831853 /
             max(uLineSpacing, 1.0)
           );

         color *=
           1.0 - scan * uScanline;


         // ================================
         // H. 少量動態雜訊
         // ================================

         vec2 noiseCell =
           floor(
             uv * uScreenSize / 3.0
           );

         float frame =
           floor(uTime * 16.0);

         float randomNoise =
           hash(
             noiseCell +
             vec2(
               frame * 1.7,
               frame * 2.3
             )
           ) - 0.5;

         color += vec3(
           randomNoise *
           uNoise *
           original.a
         );


         // ================================
         // I. 緩慢移動的訊號線
         // ================================

         float rollY =
           fract(uTime * uRollSpeed);

         float rollingBand =
           exp(
             -abs(uv.y - rollY) * 90.0
           );

         color *=
           1.0 -
           rollingBand * uRolling;


         // ================================
         // J. 大範圍暈影
         // ================================

         float vignette =
           smoothstep(
             uVignetteStart,
             uVignetteEnd,
             distanceFromCenter
           );

         color *=
           1.0 -
           vignette * uVignette;


         // ================================
         // K. CRT 曲面黑邊
         // ================================

         color *= edgeMask;

         float alpha = mix(
           1.0,
           original.a,
           edgeMask
         );


         // ================================
         // L. 輸出畫面
         // ================================

         gl_FragColor = vec4(
           clamp(color, 0.0, 1.0),
           clamp(alpha, 0.0, 1.0)
         );

       }
     `;


     // ======================================
     // 5. 建立 PixiJS Filter
     // ======================================

     const filter = new PIXI.Filter(
       undefined,
       fragment,
       {

         uScreenSize: [
           width,
           height
         ],

         uTime: 0,

         // CCTV
         uScanline: SCANLINE,
         uNoise: NOISE,

         uCurve: CURVATURE,
         uVignette: VIGNETTE,

         uVignetteStart:
           VIGNETTE_START,

         uVignetteEnd:
           VIGNETTE_END,

         uRolling: ROLLING_LINE,
         uRollSpeed: ROLL_SPEED,

         uLineSpacing: LINE_SPACING,

         // RGB 遠近
         uRGBNear: RGB_NEAR,
         uRGBFar: RGB_FAR,
         uRGBBreath: RGB_BREATH,
         uRGBSpeed: RGB_SPEED

       }
     );


     // 保留其他已存在的濾鏡
     container.filters = [
       ...(container.filters || []),
       filter
     ];


     // 套用到整個畫面
     container.filterArea =
       new PIXI.Rectangle(
         0,
         0,
         width,
         height
       );


     // ======================================
     // 6. 儲存特效狀態
     // ======================================

     fx = {

       version: 9,

       container,
       filter,

       time: 0

     };

     runtimeScene._chainScreenFX = fx;

   }


   // ========================================
   // 7. 每幀更新
   // ========================================

   const dt = Math.max(
     0,
     Math.min(
       runtimeScene.getElapsedTime() / 1000,
       0.05
     )
   );

   fx.time += dt;


   // ========================================
   // 8. 更新 CCTV 參數
   // ========================================

   const uniforms =
     fx.filter.uniforms;

   uniforms.uTime =
     fx.time;

   uniforms.uScanline =
     SCANLINE;

   uniforms.uNoise =
     NOISE;

   uniforms.uCurve =
     CURVATURE;

   uniforms.uVignette =
     VIGNETTE;

   uniforms.uVignetteStart =
     VIGNETTE_START;

   uniforms.uVignetteEnd =
     VIGNETTE_END;

   uniforms.uRolling =
     ROLLING_LINE;

   uniforms.uRollSpeed =
     ROLL_SPEED;

   uniforms.uLineSpacing =
     LINE_SPACING;


   // ========================================
   // 9. 更新 RGB 遠近參數
   // ========================================

   uniforms.uRGBNear =
     RGB_NEAR;

   uniforms.uRGBFar =
     RGB_FAR;

   uniforms.uRGBBreath =
     RGB_BREATH;

   uniforms.uRGBSpeed =
     RGB_SPEED;


   // ========================================
   // 10. 更新畫面尺寸
   // ========================================

   uniforms.uScreenSize = [
     width,
     height
   ];

   fx.container.filterArea.width =
     width;

   fx.container.filterArea.height =
     height;

 }

};
gdjs._20027_30059_38754Code.userFunc0x11add08 = function GDJSInlineCode(runtimeScene) {
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
gdjs._20027_30059_38754Code.mapOfGDgdjs_9546_959520027_959530059_959538754Code_9546GDIGObjects1Objects = Hashtable.newFrom({"IG": gdjs._20027_30059_38754Code.GDIGObjects1});
gdjs._20027_30059_38754Code.mapOfGDgdjs_9546_959520027_959530059_959538754Code_9546GDDCObjects1Objects = Hashtable.newFrom({"DC": gdjs._20027_30059_38754Code.GDDCObjects1});
gdjs._20027_30059_38754Code.mapOfGDgdjs_9546_959520027_959530059_959538754Code_9546GDYTObjects1Objects = Hashtable.newFrom({"YT": gdjs._20027_30059_38754Code.GDYTObjects1});
gdjs._20027_30059_38754Code.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
{
}

}


{


gdjs._20027_30059_38754Code.userFunc0xbb14b0(runtimeScene);

}


{


let isConditionTrue_0 = false;
{
}

}


{


gdjs._20027_30059_38754Code.userFunc0xda0ca8(runtimeScene);

}


{


gdjs._20027_30059_38754Code.userFunc0x11add08(runtimeScene);

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.sound.isMusicOnChannelStopped(runtimeScene, 1);
}
if (isConditionTrue_0) {
{gdjs.evtTools.sound.playMusicOnChannel(runtimeScene, "Performance.mp3", 1, true, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getGame().getVariables().getFromIndex(2)), 1);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("BGM_Slider"), gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1);
gdjs.copyArray(runtimeScene.getObjects("SFX_Slider"), gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1);
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1[i].SetValue(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getGame().getVariables().getFromIndex(2)), null);
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1[i].SetValue(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getGame().getVariables().getFromIndex(3)), null);
}
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("BGM_Slider"), gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1);
{runtimeScene.getGame().getVariables().getFromIndex(2).setNumber((( gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1.length === 0 ) ? 0 :gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1[0].Value(null)));
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("SFX_Slider"), gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1);
{runtimeScene.getGame().getVariables().getFromIndex(3).setNumber((( gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1.length === 0 ) ? 0 :gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1[0].Value(null)));
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("START"), gdjs._20027_30059_38754Code.GDSTARTObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs._20027_30059_38754Code.GDSTARTObjects1.length;i<l;++i) {
    if ( gdjs._20027_30059_38754Code.GDSTARTObjects1[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs._20027_30059_38754Code.GDSTARTObjects1[k] = gdjs._20027_30059_38754Code.GDSTARTObjects1[i];
        ++k;
    }
}
gdjs._20027_30059_38754Code.GDSTARTObjects1.length = k;
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "選擇", false);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Setting"), gdjs._20027_30059_38754Code.GDSettingObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs._20027_30059_38754Code.GDSettingObjects1.length;i<l;++i) {
    if ( gdjs._20027_30059_38754Code.GDSettingObjects1[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs._20027_30059_38754Code.GDSettingObjects1[k] = gdjs._20027_30059_38754Code.GDSettingObjects1[i];
        ++k;
    }
}
gdjs._20027_30059_38754Code.GDSettingObjects1.length = k;
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(0).setNumber(1);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("BACK"), gdjs._20027_30059_38754Code.GDBACKObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs._20027_30059_38754Code.GDBACKObjects1.length;i<l;++i) {
    if ( gdjs._20027_30059_38754Code.GDBACKObjects1[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs._20027_30059_38754Code.GDBACKObjects1[k] = gdjs._20027_30059_38754Code.GDBACKObjects1[i];
        ++k;
    }
}
gdjs._20027_30059_38754Code.GDBACKObjects1.length = k;
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(0).setNumber(0);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 1);
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("BACK"), gdjs._20027_30059_38754Code.GDBACKObjects1);
gdjs.copyArray(runtimeScene.getObjects("BGM_Slider"), gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1);
gdjs.copyArray(runtimeScene.getObjects("BGM_Text"), gdjs._20027_30059_38754Code.GDBGM_9595TextObjects1);
gdjs.copyArray(runtimeScene.getObjects("SFX_Slider"), gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1);
gdjs.copyArray(runtimeScene.getObjects("SFX_Text"), gdjs._20027_30059_38754Code.GDSFX_9595TextObjects1);
gdjs.copyArray(runtimeScene.getObjects("START"), gdjs._20027_30059_38754Code.GDSTARTObjects1);
gdjs.copyArray(runtimeScene.getObjects("Setting"), gdjs._20027_30059_38754Code.GDSettingObjects1);
gdjs.copyArray(runtimeScene.getObjects("SettingsBG"), gdjs._20027_30059_38754Code.GDSettingsBGObjects1);
gdjs.copyArray(runtimeScene.getObjects("SettingsTitle"), gdjs._20027_30059_38754Code.GDSettingsTitleObjects1);
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSettingsBGObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSettingsBGObjects1[i].hide(false);
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSettingsTitleObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSettingsTitleObjects1[i].hide(false);
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDBACKObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDBACKObjects1[i].hide(false);
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSTARTObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSTARTObjects1[i].hide();
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSettingObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSettingObjects1[i].hide();
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1[i].hide(false);
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1[i].hide(false);
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDBGM_9595TextObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDBGM_9595TextObjects1[i].hide(false);
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSFX_9595TextObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSFX_9595TextObjects1[i].hide(false);
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("BACK"), gdjs._20027_30059_38754Code.GDBACKObjects1);
gdjs.copyArray(runtimeScene.getObjects("BGM_Slider"), gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1);
gdjs.copyArray(runtimeScene.getObjects("BGM_Text"), gdjs._20027_30059_38754Code.GDBGM_9595TextObjects1);
gdjs.copyArray(runtimeScene.getObjects("SFX_Slider"), gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1);
gdjs.copyArray(runtimeScene.getObjects("SFX_Text"), gdjs._20027_30059_38754Code.GDSFX_9595TextObjects1);
gdjs.copyArray(runtimeScene.getObjects("START"), gdjs._20027_30059_38754Code.GDSTARTObjects1);
gdjs.copyArray(runtimeScene.getObjects("Setting"), gdjs._20027_30059_38754Code.GDSettingObjects1);
gdjs.copyArray(runtimeScene.getObjects("SettingsBG"), gdjs._20027_30059_38754Code.GDSettingsBGObjects1);
gdjs.copyArray(runtimeScene.getObjects("SettingsTitle"), gdjs._20027_30059_38754Code.GDSettingsTitleObjects1);
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSettingsBGObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSettingsBGObjects1[i].hide();
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSettingsTitleObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSettingsTitleObjects1[i].hide();
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDBACKObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDBACKObjects1[i].hide();
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSTARTObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSTARTObjects1[i].hide(false);
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSettingObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSettingObjects1[i].hide(false);
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1[i].hide();
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1[i].hide();
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDBGM_9595TextObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDBGM_9595TextObjects1[i].hide();
}
}
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSFX_9595TextObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSFX_9595TextObjects1[i].hide();
}
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("BGM_Slider"), gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1);
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1[i].SetValue(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getGame().getVariables().getFromIndex(2)), null);
}
}
{gdjs.evtTools.sound.setMusicOnChannelVolume(runtimeScene, 1, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getGame().getVariables().getFromIndex(2)));
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("SFX_Slider"), gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1);
{for(var i = 0, len = gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1.length ;i < len;++i) {
    gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1[i].SetValue(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getGame().getVariables().getFromIndex(3)), null);
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("IG"), gdjs._20027_30059_38754Code.GDIGObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._20027_30059_38754Code.mapOfGDgdjs_9546_959520027_959530059_959538754Code_9546GDIGObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
}
if (isConditionTrue_0) {
{gdjs.evtTools.window.openURL("https://www.instagram.com/dan_gao_art/", runtimeScene);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("DC"), gdjs._20027_30059_38754Code.GDDCObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._20027_30059_38754Code.mapOfGDgdjs_9546_959520027_959530059_959538754Code_9546GDDCObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
}
if (isConditionTrue_0) {
{gdjs.evtTools.window.openURL("https://discord.gg/PEhev2yKB", runtimeScene);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("YT"), gdjs._20027_30059_38754Code.GDYTObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._20027_30059_38754Code.mapOfGDgdjs_9546_959520027_959530059_959538754Code_9546GDYTObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
}
if (isConditionTrue_0) {
{gdjs.evtTools.window.openURL("https://www.youtube.com/@Dan_Gao_art", runtimeScene);
}
}

}


};

gdjs._20027_30059_38754Code.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs._20027_30059_38754Code.GDGameLogoObjects1.length = 0;
gdjs._20027_30059_38754Code.GDGameLogoObjects2.length = 0;
gdjs._20027_30059_38754Code.GDSTARTObjects1.length = 0;
gdjs._20027_30059_38754Code.GDSTARTObjects2.length = 0;
gdjs._20027_30059_38754Code.GDSettingObjects1.length = 0;
gdjs._20027_30059_38754Code.GDSettingObjects2.length = 0;
gdjs._20027_30059_38754Code.GDSettingsBGObjects1.length = 0;
gdjs._20027_30059_38754Code.GDSettingsBGObjects2.length = 0;
gdjs._20027_30059_38754Code.GDSettingsTitleObjects1.length = 0;
gdjs._20027_30059_38754Code.GDSettingsTitleObjects2.length = 0;
gdjs._20027_30059_38754Code.GDBACKObjects1.length = 0;
gdjs._20027_30059_38754Code.GDBACKObjects2.length = 0;
gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1.length = 0;
gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects2.length = 0;
gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1.length = 0;
gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects2.length = 0;
gdjs._20027_30059_38754Code.GDBGM_9595TextObjects1.length = 0;
gdjs._20027_30059_38754Code.GDBGM_9595TextObjects2.length = 0;
gdjs._20027_30059_38754Code.GDSFX_9595TextObjects1.length = 0;
gdjs._20027_30059_38754Code.GDSFX_9595TextObjects2.length = 0;
gdjs._20027_30059_38754Code.GD_9537002_9526694Objects1.length = 0;
gdjs._20027_30059_38754Code.GD_9537002_9526694Objects2.length = 0;
gdjs._20027_30059_38754Code.GDbgObjects1.length = 0;
gdjs._20027_30059_38754Code.GDbgObjects2.length = 0;
gdjs._20027_30059_38754Code.GDNewSpriteObjects1.length = 0;
gdjs._20027_30059_38754Code.GDNewSpriteObjects2.length = 0;
gdjs._20027_30059_38754Code.GDCustomCursorObjects1.length = 0;
gdjs._20027_30059_38754Code.GDCustomCursorObjects2.length = 0;
gdjs._20027_30059_38754Code.GDIGObjects1.length = 0;
gdjs._20027_30059_38754Code.GDIGObjects2.length = 0;
gdjs._20027_30059_38754Code.GDYTObjects1.length = 0;
gdjs._20027_30059_38754Code.GDYTObjects2.length = 0;
gdjs._20027_30059_38754Code.GDDCObjects1.length = 0;
gdjs._20027_30059_38754Code.GDDCObjects2.length = 0;
gdjs._20027_30059_38754Code.GD_9520171_9532057Objects1.length = 0;
gdjs._20027_30059_38754Code.GD_9520171_9532057Objects2.length = 0;
gdjs._20027_30059_38754Code.GDNewSprite2Objects1.length = 0;
gdjs._20027_30059_38754Code.GDNewSprite2Objects2.length = 0;
gdjs._20027_30059_38754Code.GD_9520171_95320572Objects1.length = 0;
gdjs._20027_30059_38754Code.GD_9520171_95320572Objects2.length = 0;

gdjs._20027_30059_38754Code.eventsList0(runtimeScene);
gdjs._20027_30059_38754Code.GDGameLogoObjects1.length = 0;
gdjs._20027_30059_38754Code.GDGameLogoObjects2.length = 0;
gdjs._20027_30059_38754Code.GDSTARTObjects1.length = 0;
gdjs._20027_30059_38754Code.GDSTARTObjects2.length = 0;
gdjs._20027_30059_38754Code.GDSettingObjects1.length = 0;
gdjs._20027_30059_38754Code.GDSettingObjects2.length = 0;
gdjs._20027_30059_38754Code.GDSettingsBGObjects1.length = 0;
gdjs._20027_30059_38754Code.GDSettingsBGObjects2.length = 0;
gdjs._20027_30059_38754Code.GDSettingsTitleObjects1.length = 0;
gdjs._20027_30059_38754Code.GDSettingsTitleObjects2.length = 0;
gdjs._20027_30059_38754Code.GDBACKObjects1.length = 0;
gdjs._20027_30059_38754Code.GDBACKObjects2.length = 0;
gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects1.length = 0;
gdjs._20027_30059_38754Code.GDBGM_9595SliderObjects2.length = 0;
gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects1.length = 0;
gdjs._20027_30059_38754Code.GDSFX_9595SliderObjects2.length = 0;
gdjs._20027_30059_38754Code.GDBGM_9595TextObjects1.length = 0;
gdjs._20027_30059_38754Code.GDBGM_9595TextObjects2.length = 0;
gdjs._20027_30059_38754Code.GDSFX_9595TextObjects1.length = 0;
gdjs._20027_30059_38754Code.GDSFX_9595TextObjects2.length = 0;
gdjs._20027_30059_38754Code.GD_9537002_9526694Objects1.length = 0;
gdjs._20027_30059_38754Code.GD_9537002_9526694Objects2.length = 0;
gdjs._20027_30059_38754Code.GDbgObjects1.length = 0;
gdjs._20027_30059_38754Code.GDbgObjects2.length = 0;
gdjs._20027_30059_38754Code.GDNewSpriteObjects1.length = 0;
gdjs._20027_30059_38754Code.GDNewSpriteObjects2.length = 0;
gdjs._20027_30059_38754Code.GDCustomCursorObjects1.length = 0;
gdjs._20027_30059_38754Code.GDCustomCursorObjects2.length = 0;
gdjs._20027_30059_38754Code.GDIGObjects1.length = 0;
gdjs._20027_30059_38754Code.GDIGObjects2.length = 0;
gdjs._20027_30059_38754Code.GDYTObjects1.length = 0;
gdjs._20027_30059_38754Code.GDYTObjects2.length = 0;
gdjs._20027_30059_38754Code.GDDCObjects1.length = 0;
gdjs._20027_30059_38754Code.GDDCObjects2.length = 0;
gdjs._20027_30059_38754Code.GD_9520171_9532057Objects1.length = 0;
gdjs._20027_30059_38754Code.GD_9520171_9532057Objects2.length = 0;
gdjs._20027_30059_38754Code.GDNewSprite2Objects1.length = 0;
gdjs._20027_30059_38754Code.GDNewSprite2Objects2.length = 0;
gdjs._20027_30059_38754Code.GD_9520171_95320572Objects1.length = 0;
gdjs._20027_30059_38754Code.GD_9520171_95320572Objects2.length = 0;


return;

}

gdjs['_20027_30059_38754Code'] = gdjs._20027_30059_38754Code;
