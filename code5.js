gdjs._32080_31639Code = {};
gdjs._32080_31639Code.localVariables = [];
gdjs._32080_31639Code.idToCallbackMap = new Map();
gdjs._32080_31639Code.GDFinalScoreTextObjects1= [];
gdjs._32080_31639Code.GDFinalScoreTextObjects2= [];
gdjs._32080_31639Code.GDbgObjects1= [];
gdjs._32080_31639Code.GDbgObjects2= [];
gdjs._32080_31639Code.GDretryObjects1= [];
gdjs._32080_31639Code.GDretryObjects2= [];
gdjs._32080_31639Code.GDMENUObjects1= [];
gdjs._32080_31639Code.GDMENUObjects2= [];
gdjs._32080_31639Code.GDNewSpriteObjects1= [];
gdjs._32080_31639Code.GDNewSpriteObjects2= [];
gdjs._32080_31639Code.GDCustomCursorObjects1= [];
gdjs._32080_31639Code.GDCustomCursorObjects2= [];


gdjs._32080_31639Code.userFunc0xc98358 = function GDJSInlineCode(runtimeScene) {
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
gdjs._32080_31639Code.userFunc0x16e9f10 = function GDJSInlineCode(runtimeScene) {
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
gdjs._32080_31639Code.userFunc0xbaa448 = function GDJSInlineCode(runtimeScene) {
"use strict";

 // ==========================================
 // CHAIN / MATCH
 // FLOW LINES V1
 //
 // 流動等高線 / 柔和波浪背景
 //
 // 特點：
 // - 灰色細線緩慢起伏
 // - 線條局部聚集、散開
 // - 波動中心慢慢移動
 // - 整體帶有呼吸感
 //
 // 不使用 Shader / 濾鏡
 // 不需要任何圖片物件
 // 不修改技能與遊戲 UI
 // ==========================================

 (() => {

   // ========================================
   // 1. 可以修改的設定
   // ========================================

   // 專用圖層名稱
   const LAYER_NAME = "FlowLines";

   // 線條間距
   // 越小，線條越密集
   const LINE_SPACING = 42;

   // 線條粗細
   const LINE_WIDTH = 4;

   // 線條顏色：灰色
   const LINE_COLOR = 0x3cff2a;

   // 線條透明度
   // 0 = 完全透明
   // 1 = 完全不透明
   const LINE_ALPHA = 0.25;

   // 基礎波浪的彎曲幅度
   const CURVE_STRENGTH = 22;

   // 局部流動的變形幅度
   const FLOW_STRENGTH = 35;

   // 線條聚集、散開的幅度
   const GATHER_STRENGTH = 0.18;

   // 動畫速度
   const FLOW_SPEED = 0.55;

   // 呼吸速度
   const BREATH_SPEED = 0.35;

   // 線條繪製的精細度
   // 越小越平滑，但比較吃效能
   const SAMPLE_STEP = 24;

   // 每秒重繪次數
   const TARGET_FPS = 30;


   // ========================================
   // 2. 檢查圖層與 PixiJS
   // ========================================

   if (
     typeof PIXI === "undefined" ||
     typeof PIXI.Graphics !== "function"
   ) {
     return;
   }

   if (!runtimeScene.hasLayer(LAYER_NAME)) {

     // 只顯示一次警告
     if (!runtimeScene._flowLinesWarning) {

       console.warn(
         "Flow Lines：找不到 FlowLines 圖層"
       );

       runtimeScene._flowLinesWarning = true;
     }

     return;
   }

   const layer = runtimeScene
     .getLayer(LAYER_NAME)
     .getRendererObject();

   if (!layer) {
     return;
   }

   const W = runtimeScene.getViewportWidth();
   const H = runtimeScene.getViewportHeight();

   let fx = runtimeScene._flowLinesV1;


   // ========================================
   // 3. 第一次建立線條畫布
   // ========================================

   if (
     !fx ||
     fx.layer !== layer ||
     fx.width !== W ||
     fx.height !== H ||
     !fx.graphics ||
     fx.graphics.parent !== layer
   ) {

     // 清理舊的效果
     if (fx && fx.graphics) {

       if (fx.graphics.parent) {
         fx.graphics.parent.removeChild(
           fx.graphics
         );
       }

       fx.graphics.destroy();
     }

     // 建立 PixiJS 繪圖物件
     const graphics = new PIXI.Graphics();

     // 不攔截滑鼠或觸控
     graphics.interactive = false;

     // 放在指定圖層最下方
     layer.addChildAt(graphics, 0);

     // 記錄狀態
     fx = {
       layer: layer,
       graphics: graphics,
       width: W,
       height: H,
       time: 0,
       accumulator: 0,
       firstFrame: true
     };

     runtimeScene._flowLinesV1 = fx;
   }


   // ========================================
   // 4. 更新時間
   // ========================================

   const dt = Math.max(
     0,
     Math.min(
       runtimeScene.getElapsedTime() / 1000,
       0.05
     )
   );

   fx.time += dt;
   fx.accumulator += dt;


   // ========================================
   // 5. 限制重繪頻率
   // ========================================

   if (
     !fx.firstFrame &&
     fx.accumulator < 1 / TARGET_FPS
   ) {
     return;
   }

   fx.firstFrame = false;
   fx.accumulator = 0;

   const t = fx.time;

   const g = fx.graphics;


   // ========================================
   // 6. 計算流動中心
   //
   // 讓變形區域緩慢移動
   // ========================================

   const centerX =
     W * (
       0.5 +
       Math.sin(t * 0.12) * 0.25
     );

   const centerY =
     H * (
       0.5 +
       Math.cos(t * 0.10) * 0.22
     );


   // ========================================
   // 7. 整體呼吸強度
   // ========================================

   const breath =
     Math.sin(t * BREATH_SPEED);

   // 將 -1~1 轉換為 0~1
   const breath01 =
     (breath + 1) / 2;


   // ========================================
   // 8. 開始重新繪製
   // ========================================

   g.clear();

   // 繪製範圍稍微超出畫面
   // 避免波動時露出邊界
   const MARGIN = 130;

   const left = -MARGIN;
   const right = W + MARGIN;

   const top = -MARGIN;
   const bottom = H + MARGIN;


   // ========================================
   // 9. 逐條畫出流動等高線
   // ========================================

   let lineIndex = 0;

   for (
     let baseY = top;
     baseY <= bottom;
     baseY += LINE_SPACING
   ) {

     // --------------------------------------
     // A. 讓每條線有些微深淺差異
     // --------------------------------------

     const lineAlpha =
       LINE_ALPHA *
       (
         0.75 +
         Math.sin(
           lineIndex * 0.65 +
           t * 0.15
         ) * 0.20
       );

     g.lineStyle(
       LINE_WIDTH,
       LINE_COLOR,
       lineAlpha
     );


     // --------------------------------------
     // B. 逐點計算線條位置
     // --------------------------------------

     let firstPoint = true;

     for (
       let x = left;
       x <= right + SAMPLE_STEP;
       x += SAMPLE_STEP
     ) {

       // ====================================
       // 10. 基礎柔和波浪
       // ====================================

       // 第一層：較細的曲線
       const wave1 =
         Math.sin(
           x * 0.006 +
           baseY * 0.007 -
           t * FLOW_SPEED
         ) * CURVE_STRENGTH;

       // 第二層：更大的慢波浪
       const wave2 =
         Math.sin(
           x * 0.003 +
           baseY * 0.004 +
           t * 0.24
         ) * CURVE_STRENGTH * 0.65;


       // ====================================
       // 11. 計算局部變形範圍
       // ====================================

       const dx = x - centerX;
       const dy = baseY - centerY;

       // 越接近中心，影響越明顯
       const nx = dx / (W * 0.35);
       const ny = dy / (H * 0.48);

       const influence = Math.exp(
         -(nx * nx + ny * ny)
       );


       // ====================================
       // 12. 流動的局部波紋
       // ====================================

       const localWave =
         Math.sin(
           dx * 0.009 -
           t * FLOW_SPEED * 1.2 +
           baseY * 0.005
         );

       const flow =
         localWave *
         influence *
         FLOW_STRENGTH;


       // ====================================
       // 13. 線條聚集與散開
       //
       // 呼吸時會改變局部線距
       // ====================================

       const gather =
         dy *
         influence *
         GATHER_STRENGTH *
         breath;


       // ====================================
       // 14. 組合最終位置
       // ====================================

       const finalY =
         baseY +
         wave1 +
         wave2 +
         flow * (0.65 + breath01 * 0.35) +
         gather;

       // 很輕微的橫向漂移
       const finalX =
         x +
         Math.sin(
           baseY * 0.006 +
           t * 0.20
         ) * 5;


       // ====================================
       // 15. 畫線
       // ====================================

       if (firstPoint) {

         g.moveTo(finalX, finalY);
         firstPoint = false;

       } else {

         g.lineTo(finalX, finalY);

       }
     }

     lineIndex++;
   }

 })();

};
gdjs._32080_31639Code.userFunc0xda0ca8 = function GDJSInlineCode(runtimeScene) {
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
gdjs._32080_31639Code.userFunc0x112d820 = function GDJSInlineCode(runtimeScene) {
"use strict";
const score = runtimeScene
  .getGame()
  .getVariables()
  .get("FinalScore")
  .getAsNumber();

const text = runtimeScene
  .getObjects("FinalScoreText")[0];

if (text) {
  text.setString("FINAL SCORE\n" + score);
}


};
gdjs._32080_31639Code.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
{
}

}


{


gdjs._32080_31639Code.userFunc0xc98358(runtimeScene);

}


{


let isConditionTrue_0 = false;
{
}

}


{


gdjs._32080_31639Code.userFunc0x16e9f10(runtimeScene);

}


{


let isConditionTrue_0 = false;
{
}

}


{


gdjs._32080_31639Code.userFunc0xbaa448(runtimeScene);

}


{


gdjs._32080_31639Code.userFunc0xda0ca8(runtimeScene);

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
{gdjs.evtTools.sound.stopMusicOnChannel(runtimeScene, 2);
}
}

}


{


gdjs._32080_31639Code.userFunc0x112d820(runtimeScene);

}


{

gdjs.copyArray(runtimeScene.getObjects("retry"), gdjs._32080_31639Code.GDretryObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs._32080_31639Code.GDretryObjects1.length;i<l;++i) {
    if ( gdjs._32080_31639Code.GDretryObjects1[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs._32080_31639Code.GDretryObjects1[k] = gdjs._32080_31639Code.GDretryObjects1[i];
        ++k;
    }
}
gdjs._32080_31639Code.GDretryObjects1.length = k;
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "loading", true);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("MENU"), gdjs._32080_31639Code.GDMENUObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs._32080_31639Code.GDMENUObjects1.length;i<l;++i) {
    if ( gdjs._32080_31639Code.GDMENUObjects1[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs._32080_31639Code.GDMENUObjects1[k] = gdjs._32080_31639Code.GDMENUObjects1[i];
        ++k;
    }
}
gdjs._32080_31639Code.GDMENUObjects1.length = k;
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "主畫面", false);
}
}

}


};

gdjs._32080_31639Code.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs._32080_31639Code.GDFinalScoreTextObjects1.length = 0;
gdjs._32080_31639Code.GDFinalScoreTextObjects2.length = 0;
gdjs._32080_31639Code.GDbgObjects1.length = 0;
gdjs._32080_31639Code.GDbgObjects2.length = 0;
gdjs._32080_31639Code.GDretryObjects1.length = 0;
gdjs._32080_31639Code.GDretryObjects2.length = 0;
gdjs._32080_31639Code.GDMENUObjects1.length = 0;
gdjs._32080_31639Code.GDMENUObjects2.length = 0;
gdjs._32080_31639Code.GDNewSpriteObjects1.length = 0;
gdjs._32080_31639Code.GDNewSpriteObjects2.length = 0;
gdjs._32080_31639Code.GDCustomCursorObjects1.length = 0;
gdjs._32080_31639Code.GDCustomCursorObjects2.length = 0;

gdjs._32080_31639Code.eventsList0(runtimeScene);
gdjs._32080_31639Code.GDFinalScoreTextObjects1.length = 0;
gdjs._32080_31639Code.GDFinalScoreTextObjects2.length = 0;
gdjs._32080_31639Code.GDbgObjects1.length = 0;
gdjs._32080_31639Code.GDbgObjects2.length = 0;
gdjs._32080_31639Code.GDretryObjects1.length = 0;
gdjs._32080_31639Code.GDretryObjects2.length = 0;
gdjs._32080_31639Code.GDMENUObjects1.length = 0;
gdjs._32080_31639Code.GDMENUObjects2.length = 0;
gdjs._32080_31639Code.GDNewSpriteObjects1.length = 0;
gdjs._32080_31639Code.GDNewSpriteObjects2.length = 0;
gdjs._32080_31639Code.GDCustomCursorObjects1.length = 0;
gdjs._32080_31639Code.GDCustomCursorObjects2.length = 0;


return;

}

gdjs['_32080_31639Code'] = gdjs._32080_31639Code;
