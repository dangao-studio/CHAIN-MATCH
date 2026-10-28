gdjs._36984_25799Code = {};
gdjs._36984_25799Code.localVariables = [];
gdjs._36984_25799Code.idToCallbackMap = new Map();
gdjs._36984_25799Code.GDTimedButtonObjects1= [];
gdjs._36984_25799Code.GDTimedButtonObjects2= [];
gdjs._36984_25799Code.GDFreeButtonObjects1= [];
gdjs._36984_25799Code.GDFreeButtonObjects2= [];
gdjs._36984_25799Code.GDChar1ButtonObjects1= [];
gdjs._36984_25799Code.GDChar1ButtonObjects2= [];
gdjs._36984_25799Code.GDChar2ButtonObjects1= [];
gdjs._36984_25799Code.GDChar2ButtonObjects2= [];
gdjs._36984_25799Code.GDChar3ButtonObjects1= [];
gdjs._36984_25799Code.GDChar3ButtonObjects2= [];
gdjs._36984_25799Code.GDChar4ButtonObjects1= [];
gdjs._36984_25799Code.GDChar4ButtonObjects2= [];
gdjs._36984_25799Code.GDChar5ButtonObjects1= [];
gdjs._36984_25799Code.GDChar5ButtonObjects2= [];
gdjs._36984_25799Code.GDChar6ButtonObjects1= [];
gdjs._36984_25799Code.GDChar6ButtonObjects2= [];
gdjs._36984_25799Code.GDCharacterPreviewObjects1= [];
gdjs._36984_25799Code.GDCharacterPreviewObjects2= [];
gdjs._36984_25799Code.GDConfirmButtonObjects1= [];
gdjs._36984_25799Code.GDConfirmButtonObjects2= [];
gdjs._36984_25799Code.GDSelectLeftObjects1= [];
gdjs._36984_25799Code.GDSelectLeftObjects2= [];
gdjs._36984_25799Code.GDSelectRightObjects1= [];
gdjs._36984_25799Code.GDSelectRightObjects2= [];
gdjs._36984_25799Code.GDCharacterInfoBGObjects1= [];
gdjs._36984_25799Code.GDCharacterInfoBGObjects2= [];
gdjs._36984_25799Code.GDCharacterInfoTitleObjects1= [];
gdjs._36984_25799Code.GDCharacterInfoTitleObjects2= [];
gdjs._36984_25799Code.GDCharacterInfoTextObjects1= [];
gdjs._36984_25799Code.GDCharacterInfoTextObjects2= [];
gdjs._36984_25799Code.GDCharacterHoverAreaObjects1= [];
gdjs._36984_25799Code.GDCharacterHoverAreaObjects2= [];
gdjs._36984_25799Code.GDCharacterInfoBioObjects1= [];
gdjs._36984_25799Code.GDCharacterInfoBioObjects2= [];
gdjs._36984_25799Code.GD_9537002_9526694Objects1= [];
gdjs._36984_25799Code.GD_9537002_9526694Objects2= [];
gdjs._36984_25799Code.GDbgObjects1= [];
gdjs._36984_25799Code.GDbgObjects2= [];
gdjs._36984_25799Code.GDESCObjects1= [];
gdjs._36984_25799Code.GDESCObjects2= [];
gdjs._36984_25799Code.GDESC2Objects1= [];
gdjs._36984_25799Code.GDESC2Objects2= [];
gdjs._36984_25799Code.GDESC_9595TEXTObjects1= [];
gdjs._36984_25799Code.GDESC_9595TEXTObjects2= [];
gdjs._36984_25799Code.GDNewButtonObjects1= [];
gdjs._36984_25799Code.GDNewButtonObjects2= [];
gdjs._36984_25799Code.GDCustomCursorObjects1= [];
gdjs._36984_25799Code.GDCustomCursorObjects2= [];


gdjs._36984_25799Code.userFunc0x18a5d38 = function GDJSInlineCode(runtimeScene) {
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
gdjs._36984_25799Code.userFunc0x8c4840 = function GDJSInlineCode(runtimeScene) {
"use strict";

 // ==========================================
 // CHAIN / MATCH
 // GRID DISTORTION V1
 //
 // 網格呼吸 / 柔和波紋變形
 //
 // 不需要 Sprite
 // 不使用 Shader / BlurFilter
 // 不影響遊戲操作及技能
 // ==========================================


 // ==========================================
 // 1. 可以自由修改的設定
 // ==========================================

 // 專用圖層
 const GRID_LAYER = "GridBreath";

 // 網格間距：越小越密集
 const GRID_SPACING = 100;

 // 線條寬度
 const LINE_WIDTH = 4;

 // 線條顏色：灰色
 const LINE_COLOR = 0x3cff2a;

 // 透明度：0 ~ 1
 const LINE_ALPHA = 0.22;

 // 變形幅度：越大越有波浪感
 const DISTORT_STRENGTH = 24;

 // 呼吸幅度
 const BREATH_STRENGTH = 12;

 // 動畫速度
 const WAVE_SPEED = 0.75;

 // 呼吸速度
 const BREATH_SPEED = 0.55;

 // 波紋密度
 const WAVE_FREQUENCY = 0.012;

 // 每格分成幾段繪製
 // 越高越平滑，但比較吃效能
 const SEGMENTS = 2;

 // 動畫更新頻率
 const TARGET_FPS = 30;


 // ==========================================
 // 2. 確認圖層與 PixiJS
 // ==========================================

 if (
   typeof PIXI !== "undefined" &&
   typeof PIXI.Graphics === "function" &&
   runtimeScene.hasLayer(GRID_LAYER)
 ) {

   const layer = runtimeScene
     .getLayer(GRID_LAYER)
     .getRendererObject();

   if (layer) {

     const W = runtimeScene.getViewportWidth();
     const H = runtimeScene.getViewportHeight();

     let fx = runtimeScene._gridBreathFX;


     // ======================================
     // 3. 第一次建立網格
     // ======================================

     if (
       !fx ||
       fx.layer !== layer ||
       fx.width !== W ||
       fx.height !== H ||
       fx.graphics.parent !== layer
     ) {

       // 清除舊的網格
       if (fx && fx.graphics) {
         fx.graphics.destroy();
       }

       const graphics = new PIXI.Graphics();

       // 不攔截滑鼠 / 觸控
       graphics.interactive = false;

       // 放進指定圖層
       layer.addChildAt(graphics, 0);

       fx = {
         layer: layer,
         graphics: graphics,
         width: W,
         height: H,
         time: 0,
         accumulator: 0,
         firstFrame: true
       };

       runtimeScene._gridBreathFX = fx;
     }


     // ======================================
     // 4. 計算時間
     // ======================================

     const dt = Math.max(
       0,
       Math.min(
         runtimeScene.getElapsedTime() / 1000,
         0.05
       )
     );

     fx.time += dt;
     fx.accumulator += dt;


     // ======================================
     // 5. 限制重繪頻率
     // ======================================

     if (
       fx.firstFrame ||
       fx.accumulator >= 1 / TARGET_FPS
     ) {

       fx.firstFrame = false;
       fx.accumulator = 0;

       const t = fx.time;

       const g = fx.graphics;


       // ====================================
       // 6. 緩慢移動的波紋中心
       // ====================================

       const centerX =
         W * (
           0.5 +
           Math.sin(t * 0.18) * 0.18
         );

       const centerY =
         H * (
           0.5 +
           Math.cos(t * 0.15) * 0.16
         );


       // ====================================
       // 7. 整體呼吸
       // ====================================

       const breath =
         Math.sin(t * BREATH_SPEED) *
         BREATH_STRENGTH;


       // ====================================
       // 8. 網格變形函式
       //
       // 輸入原始座標
       // 回傳變形後座標
       // ====================================

       function distort(x, y) {

         const dx = x - centerX;
         const dy = y - centerY;

         const distance = Math.max(
           1,
           Math.hypot(dx, dy)
         );

         // 波紋從中心向外擴散
         const phase =
           distance * WAVE_FREQUENCY -
           t * WAVE_SPEED;

         const wave = Math.sin(phase);

         // 越遠離中心，效果越淡
         const influence = Math.exp(
           -Math.pow(
             distance / (Math.max(W, H) * 0.65),
             2
           )
         );

         // 波動 + 呼吸
         const amount =
           (
             wave * DISTORT_STRENGTH +
             breath
           ) * influence;


         // 向外 / 向內推動
         const radialX =
           (dx / distance) * amount;

         const radialY =
           (dy / distance) * amount;


         // 額外的柔和流動
         const flowX =
           Math.sin(
             y * 0.006 +
             t * 0.30
           ) * 4;

         const flowY =
           Math.cos(
             x * 0.006 -
             t * 0.25
           ) * 4;


         return {
           x: x + radialX + flowX,
           y: y + radialY + flowY
         };
       }


       // ====================================
       // 9. 清除上一幀畫面
       // ====================================

       g.clear();

       g.lineStyle(
         LINE_WIDTH,
         LINE_COLOR,
         LINE_ALPHA
       );


       // ====================================
       // 10. 畫出垂直線
       // ====================================

       const step =
         GRID_SPACING / SEGMENTS;

       const left = -GRID_SPACING;
       const right = W + GRID_SPACING;

       const top = -GRID_SPACING;
       const bottom = H + GRID_SPACING;


       for (
         let x = left;
         x <= right;
         x += GRID_SPACING
       ) {

         let first = true;

         for (
           let y = top;
           y <= bottom;
           y += step
         ) {

           const p = distort(x, y);

           if (first) {
             g.moveTo(p.x, p.y);
             first = false;
           } else {
             g.lineTo(p.x, p.y);
           }
         }
       }


       // ====================================
       // 11. 畫出水平線
       // ====================================

       for (
         let y = top;
         y <= bottom;
         y += GRID_SPACING
       ) {

         let first = true;

         for (
           let x = left;
           x <= right;
           x += step
         ) {

           const p = distort(x, y);

           if (first) {
             g.moveTo(p.x, p.y);
             first = false;
           } else {
             g.lineTo(p.x, p.y);
           }
         }
       }
     }
   }
 }

};
gdjs._36984_25799Code.userFunc0x112af20 = function GDJSInlineCode(runtimeScene) {
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
gdjs._36984_25799Code.userFunc0x11add08 = function GDJSInlineCode(runtimeScene) {
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
gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDTimedButtonObjects1Objects = Hashtable.newFrom({"TimedButton": gdjs._36984_25799Code.GDTimedButtonObjects1});
gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDFreeButtonObjects1Objects = Hashtable.newFrom({"FreeButton": gdjs._36984_25799Code.GDFreeButtonObjects1});
gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDCharacterHoverAreaObjects1Objects = Hashtable.newFrom({"CharacterHoverArea": gdjs._36984_25799Code.GDCharacterHoverAreaObjects1});
gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDCharacterHoverAreaObjects1Objects = Hashtable.newFrom({"CharacterHoverArea": gdjs._36984_25799Code.GDCharacterHoverAreaObjects1});
gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDCharacterHoverAreaObjects1Objects = Hashtable.newFrom({"CharacterHoverArea": gdjs._36984_25799Code.GDCharacterHoverAreaObjects1});
gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDCharacterHoverAreaObjects1Objects = Hashtable.newFrom({"CharacterHoverArea": gdjs._36984_25799Code.GDCharacterHoverAreaObjects1});
gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDCharacterHoverAreaObjects1Objects = Hashtable.newFrom({"CharacterHoverArea": gdjs._36984_25799Code.GDCharacterHoverAreaObjects1});
gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDCharacterHoverAreaObjects1Objects = Hashtable.newFrom({"CharacterHoverArea": gdjs._36984_25799Code.GDCharacterHoverAreaObjects1});
gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDSelectRightObjects1Objects = Hashtable.newFrom({"SelectRight": gdjs._36984_25799Code.GDSelectRightObjects1});
gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDSelectLeftObjects1Objects = Hashtable.newFrom({"SelectLeft": gdjs._36984_25799Code.GDSelectLeftObjects1});
gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDConfirmButtonObjects1Objects = Hashtable.newFrom({"ConfirmButton": gdjs._36984_25799Code.GDConfirmButtonObjects1});
gdjs._36984_25799Code.userFunc0x14cf418 = function GDJSInlineCode(runtimeScene) {
"use strict";
const v = runtimeScene.getVariables();

const confirmed =
  v.get("CharacterChosen").getAsNumber();

const index =
  v.get("CarouselIndex").getAsNumber();

const names = [
  "",
  "史威特",
  "沏萊爾",
  "佐代",
  "白",
  "玫君",
  "黑子"
];

const preview =
  runtimeScene.getObjects("CharacterPreview")[0];

if (preview) {

  if (confirmed === 1) {
    preview.setString("選擇模式");
  } else {
    preview.setString(
      "目前選擇：" + (names[index] || "史威特")
    );
  }

  preview.hide(false);

  // 文字置中
  preview.setX(
    (1920 - preview.getWidth()) / 2
  );
}

};
gdjs._36984_25799Code.userFunc0xa51000 = function GDJSInlineCode(runtimeScene) {
"use strict";
const v = runtimeScene.getVariables();

const confirmed =
  v.get("CharacterChosen").getAsNumber();

// 確定按鈕
const confirm =
  runtimeScene.getObjects("ConfirmButton")[0];

if (confirm) {
  confirm.hide(confirmed === 1);
}

// 模式選擇按鈕
for (const name of ["TimedButton", "FreeButton"]) {

  const button = runtimeScene.getObjects(name)[0];

  if (button) {
    button.hide(confirmed !== 1);
  }
}

// 角色卡片及箭頭的顯示
// 全部交給輪播 JavaScript

};
gdjs._36984_25799Code.userFunc0x10fb908 = function GDJSInlineCode(runtimeScene) {
"use strict";
// ========================================
// Select：角色輪播 + Hover 左移
// ========================================

const vars = runtimeScene.getVariables();

const cards = [
  "Char1Button",
  "Char2Button",
  "Char3Button",
  "Char4Button",
  "Char5Button",
  "Char6Button"
];

const selected = vars.get("CarouselIndex").getAsNumber();
const confirmed = vars.get("CharacterChosen").getAsNumber();

// Hover 展開狀態
const infoOpened = vars.get("InfoOpened").getAsNumber();

// ========================================
// 平滑移動設定
// ========================================

// 展開時，中央角色往左移多少
const HOVER_SHIFT = 180;

// 數字越大，移動越快
const SPEED = 12;

const dt = Math.min(
  runtimeScene.getElapsedTime() / 1000,
  0.05
);

const smooth = 1 - Math.exp(-SPEED * dt);

// ========================================
// 六張角色卡片
// ========================================

for (let i = 0; i < cards.length; i++) {

  const card = runtimeScene.getObjects(cards[i])[0];

  if (!card) continue;

  // 確定角色後，隱藏所有卡片
  if (confirmed === 1) {
    card.hide(true);
    continue;
  }

  // 計算輪播位置
  let offset = i + 1 - selected;

  if (offset > 3) offset -= 6;
  if (offset < -3) offset += 6;

  // 只顯示中央、左邊、右邊
  if (Math.abs(offset) > 1) {
    card.hide(true);
    continue;
  }

  card.hide(false);

  // ======================================
  // 中央角色 Hover 時左移
  // ======================================

  let shift = 0;

  if (offset === 0 && infoOpened === 1) {
    shift = -HOVER_SHIFT;
  }

  // 原本的輪播座標
  const x = 960 + offset * 420 + shift;
  const y = 500;

  const targetX = x - card.getWidth() / 2;
  const targetY = y - card.getHeight() / 2;

  // ======================================
  // 平滑移動到目標位置
  // ======================================

  if (!runtimeScene._carouselPositionReady) {

    // 第一次進入場景，直接放到正確位置
    card.setPosition(targetX, targetY);

  } else {

    card.setPosition(
      card.getX() +
        (targetX - card.getX()) * smooth,

      card.getY() +
        (targetY - card.getY()) * smooth
    );
  }

  // 中央亮、兩側暗
  
// 中央亮、兩側暗
card.setOpacity(offset === 0 ? 255 : 140);

// 中央角色永遠顯示在最前面
if (offset === 0) {
  card.setZOrder(20);
} else {
  card.setZOrder(10);
}

}

runtimeScene._carouselPositionReady = true;

// ========================================
// 確定角色後，隱藏左右箭頭
// ========================================

for (const name of ["SelectLeft", "SelectRight"]) {

  const arrow = runtimeScene.getObjects(name)[0];

  if (arrow) {
    arrow.hide(confirmed === 1);
  }
}

};
gdjs._36984_25799Code.userFunc0x113c6b0 = function GDJSInlineCode(runtimeScene) {
"use strict";
// ========================================
// Select：角色介紹＋簡短技能說明
// 不修改物件位置、尺寸、透明度
// ========================================

const vars = runtimeScene.getVariables();
const index = vars.get("CarouselIndex").getAsNumber();

const title = runtimeScene.getObjects("CharacterInfoTitle")[0];
const bio = runtimeScene.getObjects("CharacterInfoBio")[0];
const skillText = runtimeScene.getObjects("CharacterInfoText")[0];

const info = {

  1: {
    name: "史威特",
    bio: "定位｜均衡型\n\n活潑開朗，充滿好奇心。喜歡結交朋友，總是憑著一股衝勁帶領大家行動。",
    skills: [
      "被動｜樂觀",
      "提高部分資源的獲取效率。",
      "",
      "01｜再來一次！",
      "重新排列棋盤，創造消除。",
      "",
      "02｜來場數獨！！",
      "重排局部棋子，觸發消除。",
      "",
      "03｜陽光一樣的心情",
      "大量消除並獲得短暫增益。"
    ]
  },

  2: {
    name: "沏萊爾",
    bio: "定位｜輔助型\n\n嘴上總嫌麻煩，卻有著強烈的責任感。看似冷淡，實際上經常默默替朋友收拾殘局。",
    skills: [
      "被動｜穩定",
      "讓對局更加穩定。",
      "",
      "01｜就…幫你一次。",
      "改變棋子顏色，促成消除。",
      "",
      "02｜下不為例。",
      "保護連鎖並清除一排。",
      "",
      "03｜有我在。",
      "提升 FEVER 並大範圍消除。"
    ]
  },

  3: {
    name: "佐代",
    bio: "定位｜控制型\n\n沉默寡言，習慣先觀察再行動。待人冷淡，卻總能留意到旁人忽略的細節。",
    skills: [
      "被動｜擅長觀察",
      "觀察局勢，獲得額外優勢。",
      "",
      "01｜推理成功",
      "調整指定區域，觸發消除。",
      "",
      "02｜守護石的力量",
      "獲得短暫的強化效果。",
      "",
      "03｜時間相對論",
      "暫停倒數，爭取更多時間。"
    ]
  },

  4: {
    name: "白",
    bio: "定位｜機動型\n\n來歷神祕的遠古惡魔。行事隨性，偶爾還會耍點小聰明，似乎總有意想不到的辦法。",
    skills: [
      "被動｜遠古的惡魔",
      "累積魔力，強化技能效果。",
      "",
      "01｜惡魔力量",
      "十字形消除指定區域。",
      "",
      "02｜小作弊",
      "直接製造多組消除。",
      "",
      "03｜解除封印",
      "釋放力量，清除全盤棋子。"
    ]
  },

  5: {
    name: "玫君",
    bio: "定位｜爆發型\n\n熱愛搖滾，性格直率而有主見。面對喜歡的事物總是全力以赴，不輕易退讓。",
    skills: [
      "被動｜搖滾吉他",
      "連續引爆炸彈，獲得額外收益。",
      "",
      "01｜來者不善",
      "放置一顆炸彈棋子。",
      "",
      "02｜你惹到我了",
      "一次放置多顆炸彈。",
      "",
      "03｜屬於我們的搖滾演唱會",
      "引爆大量炸彈，造成連鎖消除。"
    ]
  },

  6: {
    name: "黑子",
    bio: "定位｜輔助／控制型\n\n有些內向，不太擅長表達自己的想法。雖然經常猶豫，卻一直希望能幫上大家的忙。",
    skills: [
      "被動｜靈活雙手",
      "利用萬用棋子獲得額外收益。",
      "",
      "01｜向姊姊的求助",
      "提示可以消除的交換位置。",
      "",
      "02｜我的棋子",
      "在棋盤上生成萬用棋子。",
      "",
      "03｜讓我…讓我也派上用場吧",
      "增加萬用棋子並強化消除。"
    ]
  }
};

// ========================================
// 更新目前選取角色的文字
// ========================================

const data = info[index];

if (data) {

  if (title && title.getString() !== data.name) {
    title.setString(data.name);
  }

  if (bio && bio.getString() !== data.bio) {
    bio.setString(data.bio);
  }

  const skills = data.skills.join("\n");

  if (skillText && skillText.getString() !== skills) {
    skillText.setString(skills);
  }
}

};
gdjs._36984_25799Code.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
{
}

}


{


gdjs._36984_25799Code.userFunc0x18a5d38(runtimeScene);

}


{


gdjs._36984_25799Code.userFunc0x8c4840(runtimeScene);

}


{


let isConditionTrue_0 = false;
{
}

}


{


gdjs._36984_25799Code.userFunc0x112af20(runtimeScene);

}


{


gdjs._36984_25799Code.userFunc0x11add08(runtimeScene);

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoBG"), gdjs._36984_25799Code.GDCharacterInfoBGObjects1);
{runtimeScene.getScene().getVariables().getFromIndex(0).setNumber(0);
}
{runtimeScene.getScene().getVariables().getFromIndex(1).setNumber(0);
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoBGObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoBGObjects1[i].hide();
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoBG"), gdjs._36984_25799Code.GDCharacterInfoBGObjects1);
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoBio"), gdjs._36984_25799Code.GDCharacterInfoBioObjects1);
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoText"), gdjs._36984_25799Code.GDCharacterInfoTextObjects1);
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoTitle"), gdjs._36984_25799Code.GDCharacterInfoTitleObjects1);
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoBGObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoBGObjects1[i].getBehavior("Resizable").setWidth(1);
}
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoBGObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoBGObjects1[i].getBehavior("Resizable").setHeight(614);
}
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoTitleObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoTitleObjects1[i].getBehavior("Opacity").setOpacity(0);
}
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoTextObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoTextObjects1[i].getBehavior("Opacity").setOpacity(0);
}
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoBioObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoBioObjects1[i].getBehavior("Opacity").setOpacity(0);
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.wasKeyJustPressed(runtimeScene, "Escape");
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "主畫面", false);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("NewButton"), gdjs._36984_25799Code.GDNewButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs._36984_25799Code.GDNewButtonObjects1.length;i<l;++i) {
    if ( gdjs._36984_25799Code.GDNewButtonObjects1[i].IsClicked(null) ) {
        isConditionTrue_0 = true;
        gdjs._36984_25799Code.GDNewButtonObjects1[k] = gdjs._36984_25799Code.GDNewButtonObjects1[i];
        ++k;
    }
}
gdjs._36984_25799Code.GDNewButtonObjects1.length = k;
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "主畫面", true);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("TimedButton"), gdjs._36984_25799Code.GDTimedButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDTimedButtonObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 1);
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setNumber(1);
}
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "loading", false);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("FreeButton"), gdjs._36984_25799Code.GDFreeButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDFreeButtonObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 1);
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(0).setNumber(2);
}
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "loading", false);
}
}

}


{


let isConditionTrue_0 = false;
{
{runtimeScene.getScene().getVariables().getFromIndex(4).setNumber(0);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("CharacterHoverArea"), gdjs._36984_25799Code.GDCharacterHoverAreaObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDCharacterHoverAreaObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(2).getAsNumber() == 1);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(4).setNumber(1);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("CharacterHoverArea"), gdjs._36984_25799Code.GDCharacterHoverAreaObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDCharacterHoverAreaObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(2).getAsNumber() == 2);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(4).setNumber(1);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("CharacterHoverArea"), gdjs._36984_25799Code.GDCharacterHoverAreaObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDCharacterHoverAreaObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(2).getAsNumber() == 3);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(4).setNumber(1);
}
}

}


{


let isConditionTrue_0 = false;
{
}

}


{

gdjs.copyArray(runtimeScene.getObjects("CharacterHoverArea"), gdjs._36984_25799Code.GDCharacterHoverAreaObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDCharacterHoverAreaObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(2).getAsNumber() == 4);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(4).setNumber(1);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("CharacterHoverArea"), gdjs._36984_25799Code.GDCharacterHoverAreaObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDCharacterHoverAreaObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(2).getAsNumber() == 5);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(4).setNumber(1);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("CharacterHoverArea"), gdjs._36984_25799Code.GDCharacterHoverAreaObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDCharacterHoverAreaObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(2).getAsNumber() == 6);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(4).setNumber(1);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(4).getAsNumber() == 1);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(5).getAsNumber() == 0);
}
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoBG"), gdjs._36984_25799Code.GDCharacterInfoBGObjects1);
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoBio"), gdjs._36984_25799Code.GDCharacterInfoBioObjects1);
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoText"), gdjs._36984_25799Code.GDCharacterInfoTextObjects1);
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoTitle"), gdjs._36984_25799Code.GDCharacterInfoTitleObjects1);
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoBGObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoBGObjects1[i].hide(false);
}
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoBGObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoBGObjects1[i].getBehavior("Tween").addObjectScaleXTween2("InfoExpand", 1, runtimeScene.getGame().getNamedEasingsManager().resolve("easeOutCubic", ""), 0.3, false, false);
}
}
{runtimeScene.getScene().getVariables().getFromIndex(5).setNumber(1);
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoTitleObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoTitleObjects1[i].getBehavior("Tween").addObjectOpacityTween3("Opacity", "TitleFadeIn", 255, runtimeScene.getGame().getNamedEasingsManager().resolve("easeOutCubic", ""), 0.25, false);
}
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoTextObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoTextObjects1[i].getBehavior("Tween").addObjectOpacityTween3("Opacity", "TitleFadeIn", 255, runtimeScene.getGame().getNamedEasingsManager().resolve("easeOutCubic", ""), 0.25, false);
}
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoBioObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoBioObjects1[i].getBehavior("Tween").addObjectOpacityTween3("Opacity", "TitleFadeIn", 255, runtimeScene.getGame().getNamedEasingsManager().resolve("easeOutCubic", ""), 0.25, false);
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(4).getAsNumber() == 0);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(5).getAsNumber() == 1);
}
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoBG"), gdjs._36984_25799Code.GDCharacterInfoBGObjects1);
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoBio"), gdjs._36984_25799Code.GDCharacterInfoBioObjects1);
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoText"), gdjs._36984_25799Code.GDCharacterInfoTextObjects1);
gdjs.copyArray(runtimeScene.getObjects("CharacterInfoTitle"), gdjs._36984_25799Code.GDCharacterInfoTitleObjects1);
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoBGObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoBGObjects1[i].getBehavior("Tween").addObjectScaleXTween2("InfoExpand", 0.01, runtimeScene.getGame().getNamedEasingsManager().resolve("easeInCubic", ""), 0.25, false, false);
}
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoTitleObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoTitleObjects1[i].getBehavior("Tween").addObjectOpacityTween3("Opacity", "TitleFadeOUT", 0, runtimeScene.getGame().getNamedEasingsManager().resolve("easeOutCubic", ""), 0.2, false);
}
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoTextObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoTextObjects1[i].getBehavior("Tween").addObjectOpacityTween3("Opacity", "TitleFadeOUT", 0, runtimeScene.getGame().getNamedEasingsManager().resolve("easeOutCubic", ""), 0.2, false);
}
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoBioObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoBioObjects1[i].getBehavior("Tween").addObjectOpacityTween3("Opacity", "TitleFadeOUT", 0, runtimeScene.getGame().getNamedEasingsManager().resolve("easeOutCubic", ""), 0.2, false);
}
}
{runtimeScene.getScene().getVariables().getFromIndex(5).setNumber(0);
}
{for(var i = 0, len = gdjs._36984_25799Code.GDCharacterInfoBGObjects1.length ;i < len;++i) {
    gdjs._36984_25799Code.GDCharacterInfoBGObjects1[i].hide();
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("SelectRight"), gdjs._36984_25799Code.GDSelectRightObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDSelectRightObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonPressed(runtimeScene, "Left");
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(10190364);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(2).setNumber(gdjs.evtTools.common.mod(runtimeScene.getScene().getVariables().getFromIndex(2).getAsNumber(), 6) + 1);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("SelectLeft"), gdjs._36984_25799Code.GDSelectLeftObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDSelectLeftObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonPressed(runtimeScene, "Left");
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(25536292);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(2).setNumber(gdjs.evtTools.common.mod(runtimeScene.getScene().getVariables().getFromIndex(2).getAsNumber() + 4, 6) + 1);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isScrollingDown(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(13507484);
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(2).setNumber(gdjs.evtTools.common.mod(runtimeScene.getScene().getVariables().getFromIndex(2).getAsNumber(), 6) + 1);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isScrollingUp(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = runtimeScene.getOnceTriggers().triggerOnce(27142236);
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getScene().getVariables().getFromIndex(2).setNumber(gdjs.evtTools.common.mod(runtimeScene.getScene().getVariables().getFromIndex(2).getAsNumber() + 4, 6) + 1);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("ConfirmButton"), gdjs._36984_25799Code.GDConfirmButtonObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs._36984_25799Code.mapOfGDgdjs_9546_959536984_959525799Code_9546GDConfirmButtonObjects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
}
}
if (isConditionTrue_0) {
{runtimeScene.getGame().getVariables().getFromIndex(1).setNumber(runtimeScene.getScene().getVariables().getFromIndex(2).getAsNumber());
}
{runtimeScene.getScene().getVariables().getFromIndex(0).setNumber(1);
}
}

}


{


gdjs._36984_25799Code.userFunc0x14cf418(runtimeScene);

}


{


gdjs._36984_25799Code.userFunc0xa51000(runtimeScene);

}


{


gdjs._36984_25799Code.userFunc0x10fb908(runtimeScene);

}


{


gdjs._36984_25799Code.userFunc0x113c6b0(runtimeScene);

}


{


let isConditionTrue_0 = false;
{
}

}


};

gdjs._36984_25799Code.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs._36984_25799Code.GDTimedButtonObjects1.length = 0;
gdjs._36984_25799Code.GDTimedButtonObjects2.length = 0;
gdjs._36984_25799Code.GDFreeButtonObjects1.length = 0;
gdjs._36984_25799Code.GDFreeButtonObjects2.length = 0;
gdjs._36984_25799Code.GDChar1ButtonObjects1.length = 0;
gdjs._36984_25799Code.GDChar1ButtonObjects2.length = 0;
gdjs._36984_25799Code.GDChar2ButtonObjects1.length = 0;
gdjs._36984_25799Code.GDChar2ButtonObjects2.length = 0;
gdjs._36984_25799Code.GDChar3ButtonObjects1.length = 0;
gdjs._36984_25799Code.GDChar3ButtonObjects2.length = 0;
gdjs._36984_25799Code.GDChar4ButtonObjects1.length = 0;
gdjs._36984_25799Code.GDChar4ButtonObjects2.length = 0;
gdjs._36984_25799Code.GDChar5ButtonObjects1.length = 0;
gdjs._36984_25799Code.GDChar5ButtonObjects2.length = 0;
gdjs._36984_25799Code.GDChar6ButtonObjects1.length = 0;
gdjs._36984_25799Code.GDChar6ButtonObjects2.length = 0;
gdjs._36984_25799Code.GDCharacterPreviewObjects1.length = 0;
gdjs._36984_25799Code.GDCharacterPreviewObjects2.length = 0;
gdjs._36984_25799Code.GDConfirmButtonObjects1.length = 0;
gdjs._36984_25799Code.GDConfirmButtonObjects2.length = 0;
gdjs._36984_25799Code.GDSelectLeftObjects1.length = 0;
gdjs._36984_25799Code.GDSelectLeftObjects2.length = 0;
gdjs._36984_25799Code.GDSelectRightObjects1.length = 0;
gdjs._36984_25799Code.GDSelectRightObjects2.length = 0;
gdjs._36984_25799Code.GDCharacterInfoBGObjects1.length = 0;
gdjs._36984_25799Code.GDCharacterInfoBGObjects2.length = 0;
gdjs._36984_25799Code.GDCharacterInfoTitleObjects1.length = 0;
gdjs._36984_25799Code.GDCharacterInfoTitleObjects2.length = 0;
gdjs._36984_25799Code.GDCharacterInfoTextObjects1.length = 0;
gdjs._36984_25799Code.GDCharacterInfoTextObjects2.length = 0;
gdjs._36984_25799Code.GDCharacterHoverAreaObjects1.length = 0;
gdjs._36984_25799Code.GDCharacterHoverAreaObjects2.length = 0;
gdjs._36984_25799Code.GDCharacterInfoBioObjects1.length = 0;
gdjs._36984_25799Code.GDCharacterInfoBioObjects2.length = 0;
gdjs._36984_25799Code.GD_9537002_9526694Objects1.length = 0;
gdjs._36984_25799Code.GD_9537002_9526694Objects2.length = 0;
gdjs._36984_25799Code.GDbgObjects1.length = 0;
gdjs._36984_25799Code.GDbgObjects2.length = 0;
gdjs._36984_25799Code.GDESCObjects1.length = 0;
gdjs._36984_25799Code.GDESCObjects2.length = 0;
gdjs._36984_25799Code.GDESC2Objects1.length = 0;
gdjs._36984_25799Code.GDESC2Objects2.length = 0;
gdjs._36984_25799Code.GDESC_9595TEXTObjects1.length = 0;
gdjs._36984_25799Code.GDESC_9595TEXTObjects2.length = 0;
gdjs._36984_25799Code.GDNewButtonObjects1.length = 0;
gdjs._36984_25799Code.GDNewButtonObjects2.length = 0;
gdjs._36984_25799Code.GDCustomCursorObjects1.length = 0;
gdjs._36984_25799Code.GDCustomCursorObjects2.length = 0;

gdjs._36984_25799Code.eventsList0(runtimeScene);
gdjs._36984_25799Code.GDTimedButtonObjects1.length = 0;
gdjs._36984_25799Code.GDTimedButtonObjects2.length = 0;
gdjs._36984_25799Code.GDFreeButtonObjects1.length = 0;
gdjs._36984_25799Code.GDFreeButtonObjects2.length = 0;
gdjs._36984_25799Code.GDChar1ButtonObjects1.length = 0;
gdjs._36984_25799Code.GDChar1ButtonObjects2.length = 0;
gdjs._36984_25799Code.GDChar2ButtonObjects1.length = 0;
gdjs._36984_25799Code.GDChar2ButtonObjects2.length = 0;
gdjs._36984_25799Code.GDChar3ButtonObjects1.length = 0;
gdjs._36984_25799Code.GDChar3ButtonObjects2.length = 0;
gdjs._36984_25799Code.GDChar4ButtonObjects1.length = 0;
gdjs._36984_25799Code.GDChar4ButtonObjects2.length = 0;
gdjs._36984_25799Code.GDChar5ButtonObjects1.length = 0;
gdjs._36984_25799Code.GDChar5ButtonObjects2.length = 0;
gdjs._36984_25799Code.GDChar6ButtonObjects1.length = 0;
gdjs._36984_25799Code.GDChar6ButtonObjects2.length = 0;
gdjs._36984_25799Code.GDCharacterPreviewObjects1.length = 0;
gdjs._36984_25799Code.GDCharacterPreviewObjects2.length = 0;
gdjs._36984_25799Code.GDConfirmButtonObjects1.length = 0;
gdjs._36984_25799Code.GDConfirmButtonObjects2.length = 0;
gdjs._36984_25799Code.GDSelectLeftObjects1.length = 0;
gdjs._36984_25799Code.GDSelectLeftObjects2.length = 0;
gdjs._36984_25799Code.GDSelectRightObjects1.length = 0;
gdjs._36984_25799Code.GDSelectRightObjects2.length = 0;
gdjs._36984_25799Code.GDCharacterInfoBGObjects1.length = 0;
gdjs._36984_25799Code.GDCharacterInfoBGObjects2.length = 0;
gdjs._36984_25799Code.GDCharacterInfoTitleObjects1.length = 0;
gdjs._36984_25799Code.GDCharacterInfoTitleObjects2.length = 0;
gdjs._36984_25799Code.GDCharacterInfoTextObjects1.length = 0;
gdjs._36984_25799Code.GDCharacterInfoTextObjects2.length = 0;
gdjs._36984_25799Code.GDCharacterHoverAreaObjects1.length = 0;
gdjs._36984_25799Code.GDCharacterHoverAreaObjects2.length = 0;
gdjs._36984_25799Code.GDCharacterInfoBioObjects1.length = 0;
gdjs._36984_25799Code.GDCharacterInfoBioObjects2.length = 0;
gdjs._36984_25799Code.GD_9537002_9526694Objects1.length = 0;
gdjs._36984_25799Code.GD_9537002_9526694Objects2.length = 0;
gdjs._36984_25799Code.GDbgObjects1.length = 0;
gdjs._36984_25799Code.GDbgObjects2.length = 0;
gdjs._36984_25799Code.GDESCObjects1.length = 0;
gdjs._36984_25799Code.GDESCObjects2.length = 0;
gdjs._36984_25799Code.GDESC2Objects1.length = 0;
gdjs._36984_25799Code.GDESC2Objects2.length = 0;
gdjs._36984_25799Code.GDESC_9595TEXTObjects1.length = 0;
gdjs._36984_25799Code.GDESC_9595TEXTObjects2.length = 0;
gdjs._36984_25799Code.GDNewButtonObjects1.length = 0;
gdjs._36984_25799Code.GDNewButtonObjects2.length = 0;
gdjs._36984_25799Code.GDCustomCursorObjects1.length = 0;
gdjs._36984_25799Code.GDCustomCursorObjects2.length = 0;


return;

}

gdjs['_36984_25799Code'] = gdjs._36984_25799Code;
