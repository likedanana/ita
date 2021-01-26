(() => {
  let yOffset = 0; // 현재위치(window.pageYOffset 대신 쓸 변수)
  let prevScrollHeight = 0; // 현재위치 기준 전섹션높이 합 
  let currentScene = 0; // 현재섹션
  let enterNewScene = false; // 새섹션진입(오동작방지에 사용)

// 부드러운 감속
let acc = 0.1;
let delayedYOffset = 0;
let rafId;
let rafState;

const sceneInfo = [
  { 
    // 0
    type:'sticky',
    heightNum: 5, // 창높이의 heightNum배로 섹션높이 세팅(다양한 사용환경에 비슷한 경험) 
    scrollHeight: 0, // 섹션높이(미리 지정됨, 창높이의 n배)
    objs: {
      container: document.querySelector('#scroll-section-0'),
      messageA: document.querySelector('#scroll-section-0 .main-message.a'),
      messageB: document.querySelector('#scroll-section-0 .main-message.b'),
      messageC: document.querySelector('#scroll-section-0 .main-message.c'),
      messageD: document.querySelector('#scroll-section-0 .main-message.d'),
      canvas: document.querySelector('#video-canvas-0'),
      context: document.querySelector('#video-canvas-0').getContext('2d'),
      videoImages: [],
    },
    // [시작값, 끝값, {start: 섹션내 시작위치 비율, end: 섹션내 끝위치 비율}]
    values: {
      videoImageCount: 300,
      imageSequence: [0, 299],
      canvas_opacity: [1, 0, {start: 0.9, end: 1}],
      messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
      messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
      messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
      messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
      messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
      messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
      messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
      messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
      messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
      messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
      messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
      messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
      messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
      messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
      messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
      messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
    }
  }, 
  {
    // 1
    type:'normal',
    // heightNum: 5, // normal에서는 필요없음
    scrollHeight: 0,
    objs: {
      container: document.querySelector('#scroll-section-1')
    }
  }, 
  {
    // 2
    type:'sticky',
    heightNum: 5,
    scrollHeight: 0,
    objs: {
      container: document.querySelector('#scroll-section-2'),
			messageA: document.querySelector('#scroll-section-2 .a'),
			messageB: document.querySelector('#scroll-section-2 .b'),
			messageC: document.querySelector('#scroll-section-2 .c'),
			pinB: document.querySelector('#scroll-section-2 .b .pin'),
			pinC: document.querySelector('#scroll-section-2 .c .pin'),
      canvas: document.querySelector('#video-canvas-1'),
      context: document.querySelector('#video-canvas-1').getContext('2d'),
      videoImages: [],
    },
    values: {
      videoImageCount: 960,
      imageSequence: [0, 959],
      canvas_opacity_in: [0, 1, {start: 0, end: 0.1}],
      canvas_opacity_out: [1, 0, {start: 0.95, end: 1}],
      messageA_translateY_in: [20, 0, { start: 0.25, end: 0.3 }],
      messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
      messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
      messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
      messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
      messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
      messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
      messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
      messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
      messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
      messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
      messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
      pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
      pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }],
      // pinB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
      // pinC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
      // pinB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
      // pinC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
    }
  }, 
  {
    // 3
    type:'sticky',
    heightNum: 5,
    scrollHeight: 0,
    objs: {
      container: document.querySelector('#scroll-section-3'),
      canvasCaption: document.querySelector('.canvas-caption'),
      canvas: document.querySelector('.image-blend-canvas'),
      context: document.querySelector('.image-blend-canvas').getContext('2d'),
      imagesPath: [
        './images/blend-image-1.jpg',
        './images/blend-image-2.jpg'
      ],
      images: [],
    },
    values: {
      rect1X: [ 0, 0, {start: 0, end: 0}],
      rect2X: [ 0, 0, {start: 0, end: 0}],
      rectStartY: 0,
      blendHeight : [0, 0, {start: 0, end: 0}],
      canvas_scale: [0, 0, {start: 0, end: 0}],
      canvasCaption_opacity: [0, 1, {start: 0, end: 0}],
      canvasCaption_translateY: [20, 0, {start: 0, end: 0}],
    }
  } 
];

// 이미지를 videoImages배열에 push
function setCanvasImages() {
  let imgElem;
  for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
    // imgElem = document.createElement('img');
    imgElem = new Image();
    imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
    sceneInfo[0].objs.videoImages.push(imgElem);
  }

  for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
    imgElem = new Image();
    imgElem.src = `./video/002/IMG_${7027 + i}.JPG`;
    sceneInfo[2].objs.videoImages.push(imgElem);
  }

  for(let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++){
    imgElem = new Image();
    imgElem.src = sceneInfo[3].objs.imagesPath[i];
    sceneInfo[3].objs.images.push(imgElem);
  }
}

// 메뉴바
function checkMenu() {
  if (yOffset > 44) {
    document.body.classList.add('local-nav-sticky');
  } else {
    document.body.classList.remove('local-nav-sticky');
  }
}

function setLayout() {
  // 각 섹션높이를 창높이 n배로 세팅
  for (let i = 0; i < sceneInfo.length; i++) {
    if (sceneInfo[i].type === 'sticky') {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
    } else if (sceneInfo[i].type === 'normal') {
      sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
    }
    sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
  }

  // currentScene 세팅
  // 새로고침 등으로 스크롤이 중간에서 시작해도 currentScene 바르게 설정
  yOffset = window.pageYOffset;
  let totalScrollHeight = 0;
  for (let i = 0; i < sceneInfo.length; i++) {
    totalScrollHeight += sceneInfo[i].scrollHeight;
    if (totalScrollHeight >= yOffset) {
      currentScene = i;
      break;
    }
  }
  document.body.setAttribute('id', `show-scene-${currentScene}`);

  // 캔버스 크기 조정
  // heigtRatio배율 적용, 가운데 정렬
  const heightRatio = window.innerHeight / 1080;
  sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
  sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
}

// 현재섹션 내 현재위치를 rv로 환산
// ex) 스크롤범위의 50%만큼 스크롤됐으면? rv값범위 중 50%인 값 계산하여 반환
function calcValues(values, currentYOffset) {
  let rv;
  const scrollHeight = sceneInfo[currentScene].scrollHeight;
  const scrollRatio = currentYOffset / scrollHeight; // 전체스크롤범위(현재섹션) 기준 현재위치 비율

  if (values.length === 3) {
    // 부분스크롤범위 기준 rv 계산
    const partScrollStart = values[2].start * scrollHeight;
    const partScrollEnd = values[2].end * scrollHeight;
    const partScrollHeight = partScrollEnd - partScrollStart;
    const partScrollRatio = (currentYOffset - partScrollStart) / partScrollHeight; // 부분스크롤범위 기준 현재위치 비율

    if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
    // (values[1] - values[0]) + values[0] = rv값범위
      rv = partScrollRatio * (values[1] - values[0]) + values[0];
    } else if (currentYOffset < partScrollStart) {
      rv = values[0];
    } else if (currentYOffset > partScrollEnd) {
      rv = values[1];
    }
  } else {
    // 전체스크롤범위 기준 rv 계산
    rv = scrollRatio * (values[1] - values[0]) + values[0];
  }
  
  return rv;
}

// 현재섹션 애니메이션 실행
function playAnimation() {
  const objs = sceneInfo[currentScene].objs;
  const values = sceneInfo[currentScene].values;
  const currentYOffset = yOffset - prevScrollHeight; // 현재섹션 기준 현재위치
  const scrollHeight = sceneInfo[currentScene].scrollHeight;
  const scrollRatio = currentYOffset / scrollHeight; // 현재섹션 기준 현재위치 비율
  
  switch (currentScene) {
    
    case 0:

      // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
      // objs.context.drawImage(objs.videoImages[sequence], 0, 0);

      objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

      // in, out 적용 구간 설정(같은 요소의 같은 속성에 in, out이 각각 값을 지정해 생기는 충돌 방지)
      if (scrollRatio <= 0.22) {
        // in
        objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
        objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
        // translate3d : 하드웨어 가속 보장
      } else {
        // out
        objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
        objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
      }

      if (scrollRatio <= 0.42) {
        // in
        objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
        objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
      } else {
        // out
        objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
        objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
      }

      if (scrollRatio <= 0.62) {
        // in
        objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
        objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
      } else {
        // out
        objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
        objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
      }

      if (scrollRatio <= 0.82) {
        // in
        objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
        objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
      } else {
        // out
        objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
        objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
      }
      
      break;
    
    case 2:

      // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
      // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

      if (scrollRatio <= 0.12) {
        // in 
        objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
      } else {
        // out
        objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
      }

      if (scrollRatio <= 0.32) {
        // in 
        objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
        objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
      } else {
        // out
        objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
        objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
      }

      if (scrollRatio <= 0.67) {
        // in
        objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
        objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
      } else {
        // out
        objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
        objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
      }

      if (scrollRatio <= 0.93) {
        // in
        objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
        objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
      } else {
        // out
        objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
        objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
      }

      objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
      objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;

      if (scrollRatio > 0.9) {
        // 90%이상 스크롤되면 scene3의 캔버스 그리기 시작

        // scene3의 변수 가져오기
        const objs = sceneInfo[3].objs;
        const values = sceneInfo[3].values;
        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;
        let canvasScaleRatio;

        // canvas, context 세팅
        if (widthRatio <= heightRatio) {
          canvasScaleRatio = heightRatio;
        } else {
          canvasScaleRatio = widthRatio;
        }
        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objs.context.fillStyle = 'white';
        objs.context.drawImage(objs.images[0], 0, 0);

        // scale조정된캔버스크기에 비례하는 창크기 재계산
        const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
        // const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

        // 흰상자(양 옆 여백) 처음상태 그리기
        const whiteRectWidth = recalculatedInnerWidth * 0.15;

        values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
        values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
        // values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
        // values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

        objs.context.fillRect(parseInt(values.rect1X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height);
        objs.context.fillRect(parseInt(values.rect2X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height);
      }

      break;

    case 3:

      let step = 0;

      // canvasScaleRatio 계산
      // 캔버스 대비 창크기의 가로/세로 배율 중 큰 쪽 배율 적용(큰 쪽에 맞추고 작은 쪽은 잘림)
      const widthRatio = window.innerWidth / objs.canvas.width;
      const heightRatio = window.innerHeight / objs.canvas.height;
      let canvasScaleRatio;

      if (widthRatio <= heightRatio) {
        canvasScaleRatio = heightRatio;
      } else {
        canvasScaleRatio = widthRatio;
      }

      objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
      objs.context.drawImage(objs.images[0], 0, 0);
      objs.context.fillStyle = 'white';      

      // 사각형 이동 시작, 끝지점 세팅
      if (!values.rectStartY) {
        // values.rectStartY = objs.canvas.getBoundingClientRect().top;
        // 스크롤 빨리하면 문제 발생

        // 실제캔버스top Y값이 아닌 scale조정된캔버스top Y값이 필요하므로 차이 조정
        values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;

        values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
        values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
        values.rect1X[2].end = values.rectStartY / scrollHeight;
        values.rect2X[2].end = values.rectStartY / scrollHeight;
      }

      // 재계산된 창크기 기준 사각형 넓이, x값 계산
      // 실제 창크기 : scale조정된캔버스크기
      // = 재계산된 창크기 : 실제캔버스크기
      const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
      // const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

      const whiteRectWidth = recalculatedInnerWidth * 0.15;
      values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
      values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
      values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
      values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

      // 사각형 x값 지정(x, y, width, height)
      objs.context.fillRect(
        parseInt(calcValues(values.rect1X, currentYOffset)),
        0,
        parseInt(whiteRectWidth),
        objs.canvas.height
      );
      objs.context.fillRect(
        parseInt(calcValues(values.rect2X, currentYOffset)),
        0,
        parseInt(whiteRectWidth),
        objs.canvas.height
      );

      // 스크롤이 scale조정된캔버스top에...
      if (scrollRatio < values.rect1X[2].end) {
        // 닿기 전
        objs.canvas.classList.remove('sticky');
      } else {
        // 닿은 후

        // sticky때문에 실제캔버스 기준 top: 0 되므로 scale조정된캔버스에 맞춰 차이 조정
        objs.canvas.classList.add('sticky');
        objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;

        // 이미지 블렌딩
        values.blendHeight[0] = 0;
        values.blendHeight[1] = objs.canvas.height; // 1080
        values.blendHeight[2].start = values.rect1X[2].end;
        values.blendHeight[2].end = values.blendHeight[2].start + 0.2;

        blendHeight = calcValues(values.blendHeight, currentYOffset);
        objs.context.drawImage(
          objs.images[1], 
          0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight, 
          0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
        );

        // 캔버스 축소
        if (scrollRatio > values.blendHeight[2].end) {
          values.canvas_scale[0] = canvasScaleRatio;
          values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
          values.canvas_scale[2].start = values.blendHeight[2].end;
          values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;
          
          objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
          objs.canvas.style.marginTop = 0;
        }
  
        // 캡션 css
        if (scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0) {
          objs.canvas.classList.remove('sticky');
          objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`; // sticky일동안 스크롤한 수치(0.2+0.2)
  
          values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
          values.canvasCaption_opacity[2].end = values.canvas_scale[2].end + 0.1;
          values.canvasCaption_translateY[2].start = values.canvasCaption_opacity[2].start;
          values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].end;
  
          objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
          objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`;        
        }
      }
      break;
  }
}

// 부드러운 감속 - 이동거리가 점점 줄어들도록 계산
function loop() {
  delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
  
  if (!enterNewScene) {
    if (currentScene === 0 || currentScene == 2) {
      const currentYOffset = delayedYOffset - prevScrollHeight;
      const objs = sceneInfo[currentScene].objs;
      const values = sceneInfo[currentScene].values;

      let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
      if (objs.videoImages[sequence]) {
        objs.context.drawImage(objs.videoImages[sequence], 0, 0);
      }
    }
  }

  // 스크롤시 loop 반복 시작, 애니메이션 끝나면 멈춤
  rafId = requestAnimationFrame(loop);

  if (Math.abs(yOffset - delayedYOffset) < 1) {
    cancelAnimationFrame(rafId);
    rafState = false;
  }
}

// 현재섹션 구하고 html에 적용
function scrollLoop() {
  // 새섹션진입 시 생기는 오동작 방지
  enterNewScene = false;

  // 전섹션높이 계산
  prevScrollHeight = 0;
  for (let i = 0; i < currentScene; i++) {
    prevScrollHeight += sceneInfo[i].scrollHeight;
  }

  // currentScene 세팅
  if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
    document.body.classList.remove('scroll-effect-end');
  }

  if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
    enterNewScene = true;
    // currentScene 값 범위 제한(0 ~ sceneInfo.length)
    if (currentScene === sceneInfo.length - 1) {
      document.body.classList.add('scroll-effect-end');
    }
    if (currentScene < sceneInfo.length - 1) {
      currentScene++;      
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  if (delayedYOffset < prevScrollHeight) {
    enterNewScene = true;
    if (currentScene === 0) return; // 바운스효과로 currentScene이 음수 되는 것 방지(모바일)
    currentScene--;
    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  if (enterNewScene) return;
    playAnimation();
}

// 'DOMContentLoaded' - 돔구조만
// 'load' - 리소스까지
window.addEventListener('load', () => {
  document.body.classList.remove('before-load');
  setLayout();
  sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

  // 중간에서 새로고침 시 이미지 표시하기 위해 자동스크롤
  if (yOffset > 0) {
    let tempYOffset = yOffset;
    let tempScrollCount = 0;
    let siId = setInterval(() => {
      window.scrollTo(0, tempYOffset);
      tempYOffset += 5;
      if (tempScrollCount > 20) {
        clearInterval(siId);
      }
      tempScrollCount++;
    }, 20)
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
    checkMenu();
    if (!rafState) {
      rafId = requestAnimationFrame(loop);
      rafState = true;
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      window.location.reload();
    }
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(()=> {
      window.scrollTo(0, 0);
      window.location.reload();
    }, 500);
  });  
  document.querySelector('.loading').addEventListener('transitionend', (e) => {
    document.body.removeChild(e.currentTarget);
  });  
});

setCanvasImages();

}) ();