gdjs.loadingCode = {};
gdjs.loadingCode.localVariables = [];
gdjs.loadingCode.idToCallbackMap = new Map();
gdjs.loadingCode.GDLoadingTextObjects1= [];
gdjs.loadingCode.GDLoadingTextObjects2= [];
gdjs.loadingCode.GDWhite1BitPixelBarObjects1= [];
gdjs.loadingCode.GDWhite1BitPixelBarObjects2= [];
gdjs.loadingCode.GDbgObjects1= [];
gdjs.loadingCode.GDbgObjects2= [];
gdjs.loadingCode.GDLoadingPercentObjects1= [];
gdjs.loadingCode.GDLoadingPercentObjects2= [];
gdjs.loadingCode.GDFadeBlackObjects1= [];
gdjs.loadingCode.GDFadeBlackObjects2= [];


gdjs.loadingCode.userFunc0x11add08 = function GDJSInlineCode(runtimeScene) {
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
gdjs.loadingCode.userFunc0x8c4840 = function GDJSInlineCode(runtimeScene) {
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
gdjs.loadingCode.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
{
}

}


{


gdjs.loadingCode.userFunc0x11add08(runtimeScene);

}


{


let isConditionTrue_0 = false;
{
}

}


{


gdjs.loadingCode.userFunc0x8c4840(runtimeScene);

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("FadeBlack"), gdjs.loadingCode.GDFadeBlackObjects1);
{gdjs.evtTools.runtimeScene.prioritizeLoadingOfScene(runtimeScene, "遊戲");
}
{gdjs.evtTools.runtimeScene.resetTimer(runtimeScene, "LoadingDisplay");
}
{gdjs.evtTools.runtimeScene.resetTimer(runtimeScene, "FadeTimer");
}
{for(var i = 0, len = gdjs.loadingCode.GDFadeBlackObjects1.length ;i < len;++i) {
    gdjs.loadingCode.GDFadeBlackObjects1[i].getBehavior("Opacity").setOpacity(255);
}
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("LoadingPercent"), gdjs.loadingCode.GDLoadingPercentObjects1);
gdjs.copyArray(runtimeScene.getObjects("White1BitPixelBar"), gdjs.loadingCode.GDWhite1BitPixelBarObjects1);
{for(var i = 0, len = gdjs.loadingCode.GDWhite1BitPixelBarObjects1.length ;i < len;++i) {
    gdjs.loadingCode.GDWhite1BitPixelBarObjects1[i].SetValue(gdjs.evtTools.runtimeScene.getSceneLoadingProgress(runtimeScene, "遊戲") * 100, null);
}
}
{for(var i = 0, len = gdjs.loadingCode.GDLoadingPercentObjects1.length ;i < len;++i) {
    gdjs.loadingCode.GDLoadingPercentObjects1[i].getBehavior("Text").setText(gdjs.evtTools.common.toString(Math.round(gdjs.evtTools.runtimeScene.getSceneLoadingProgress(runtimeScene, "遊戲") * 100)) + "%");
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.areSceneAssetsLoaded(runtimeScene, "遊戲");
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.getTimerElapsedTimeInSecondsOrNaN(runtimeScene, "LoadingDisplay") > 1.5;
}
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "遊戲", false);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getScene().getVariables().getFromIndex(0).getAsNumber() == 0);
}
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("FadeBlack"), gdjs.loadingCode.GDFadeBlackObjects1);
{for(var i = 0, len = gdjs.loadingCode.GDFadeBlackObjects1.length ;i < len;++i) {
    gdjs.loadingCode.GDFadeBlackObjects1[i].getBehavior("Opacity").setOpacity(255 * (1 - gdjs.evtTools.runtimeScene.getTimerElapsedTimeInSeconds(runtimeScene, "FadeTimer") / 0.5));
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(1).getAsNumber() == 1);
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.sound.preloadMusic(runtimeScene, "Karma.mp3");
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(1).getAsNumber() == 2);
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.sound.preloadMusic(runtimeScene, "Deepfake.mp3");
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(1).getAsNumber() == 3);
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.sound.preloadMusic(runtimeScene, "Golem.mp3");
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(1).getAsNumber() == 4);
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.sound.preloadMusic(runtimeScene, "Deep-Impact.mp3");
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(1).getAsNumber() == 5);
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.sound.preloadMusic(runtimeScene, "Combination-Bonus.mp3");
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
{isConditionTrue_0 = (runtimeScene.getGame().getVariables().getFromIndex(1).getAsNumber() == 6);
}
}
if (isConditionTrue_0) {
{gdjs.evtTools.sound.preloadMusic(runtimeScene, "Square.mp3");
}
}

}


{


let isConditionTrue_0 = false;
{
}

}


{


let isConditionTrue_0 = false;
{
}

}


};

gdjs.loadingCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.loadingCode.GDLoadingTextObjects1.length = 0;
gdjs.loadingCode.GDLoadingTextObjects2.length = 0;
gdjs.loadingCode.GDWhite1BitPixelBarObjects1.length = 0;
gdjs.loadingCode.GDWhite1BitPixelBarObjects2.length = 0;
gdjs.loadingCode.GDbgObjects1.length = 0;
gdjs.loadingCode.GDbgObjects2.length = 0;
gdjs.loadingCode.GDLoadingPercentObjects1.length = 0;
gdjs.loadingCode.GDLoadingPercentObjects2.length = 0;
gdjs.loadingCode.GDFadeBlackObjects1.length = 0;
gdjs.loadingCode.GDFadeBlackObjects2.length = 0;

gdjs.loadingCode.eventsList0(runtimeScene);
gdjs.loadingCode.GDLoadingTextObjects1.length = 0;
gdjs.loadingCode.GDLoadingTextObjects2.length = 0;
gdjs.loadingCode.GDWhite1BitPixelBarObjects1.length = 0;
gdjs.loadingCode.GDWhite1BitPixelBarObjects2.length = 0;
gdjs.loadingCode.GDbgObjects1.length = 0;
gdjs.loadingCode.GDbgObjects2.length = 0;
gdjs.loadingCode.GDLoadingPercentObjects1.length = 0;
gdjs.loadingCode.GDLoadingPercentObjects2.length = 0;
gdjs.loadingCode.GDFadeBlackObjects1.length = 0;
gdjs.loadingCode.GDFadeBlackObjects2.length = 0;


return;

}

gdjs['loadingCode'] = gdjs.loadingCode;
