'use strict';

// 设置浏览器不记录上次滚动条的位置--禁止刷新重置滚动条
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
// 监听对象
function objScrollMonitor(jsonObj) {
  let $obj = $(jsonObj.el); // 监测对象
  let objName = jsonObj.el.slice(1, jsonObj.el.length); // 监测对象名称
  let winHeight = $(window).height(); // 屏幕高度
  let objHeight = $obj.height(); // 对象高度
  let objTop = $obj.offset().top; // 相对于窗口的高度
  $(window).bind("scroll", function() {
    let scrollHeight = $(window).scrollTop(); // 滚动条高度
    let direction = true; // 滚动方向
    try {
      if(eval(`oldScrollHeight${objName} < scrollHeight` )){
        // console.log("向下")
        direction = true;
      }else{
        // console.log("向上")
        direction = false;
      }
      eval(`oldScrollHeight${objName} = scrollHeight`);
    } catch(e) {
      // 初始化当前状态
      eval(`window.oldScrollHeight${objName} = scrollHeight;`); // 上一次滚动条的位置
      eval(`window.topBottomStatus${objName} = false;`); // 对象上边缘进入窗口下边缘状态
      eval(`window.bottomBottomStatus${objName} = false;`); // 对象下边缘进入窗口下边缘状态
      eval(`window.topTopStatus${objName} = false;`); // 对象上边缘进入窗口上边缘状态
      eval(`window.bottomTopStatus${objName} = false;`); // 对象下边缘进入窗口上边缘状态
    }

    // 对象上边缘--窗口下缘
    if (!eval(`topBottomStatus${objName}`) && (scrollHeight + winHeight >= objTop) && direction === true) {
      // 对象上边缘从屏幕下边缘进入事件
      if(typeof jsonObj.topBottomEnter == "function"){
        jsonObj.topBottomEnter();
      }
      eval(`topBottomStatus${objName} = true`);
    }else if (eval(`topBottomStatus${objName}`) && (scrollHeight + winHeight <= objTop) && direction === false) {
      // 对象上边缘从屏幕下边缘离开事件
      if(typeof jsonObj.topBottomDepart == "function"){
        jsonObj.topBottomDepart();
      }
      eval(`topBottomStatus${objName} = false`)
    }

    // 对象下边缘--窗口下缘
    if (!eval(`bottomBottomStatus${objName}`) && (scrollHeight + winHeight >= objTop + objHeight) && direction === true) {
      // 对象下边缘从屏幕下边缘进入事件
      if(typeof jsonObj.bottomBottomEnter == "function"){
        jsonObj.bottomBottomEnter();
      }
      eval(`bottomBottomStatus${objName} = true`);
    } else if(eval(`bottomBottomStatus${objName}`) && (scrollHeight + winHeight <= objTop + objHeight) && direction === false) {
      // 对象下边缘从屏幕下边缘离开事件
      if(typeof jsonObj.bottomBottomDepart == "function"){
        jsonObj.bottomBottomDepart();
      }
      eval(`bottomBottomStatus${objName} = false`);
    }

    // 对象上边缘--窗口上缘
    if(!eval(`topTopStatus${objName}`) && (scrollHeight >= objTop) && direction === true) {
      // 对象上边缘从屏幕上边缘进入事件
      if(typeof jsonObj.topTopEnter == "function"){
        jsonObj.topTopEnter();
      }
      eval(`topTopStatus${objName} = true`);
    }else if (eval(`topTopStatus${objName}`) && (scrollHeight <= objTop) && direction === false) {
      // 对象上边缘从屏幕上边缘离开事件
      if(typeof jsonObj.topTopDepart == "function"){
        jsonObj.topTopDepart();
      }
      eval(`topTopStatus${objName} = false`);
    }

    // 对象下边缘--窗口上缘
    if (!eval(`bottomTopStatus${objName}`) && (scrollHeight >= objTop + objHeight) && direction === true){
      // 对象下边缘从屏幕上边缘进入事件
      if(typeof jsonObj.bottomTopEnter == "function"){
        jsonObj.bottomTopEnter();
      }
      eval(`bottomTopStatus${objName} = true`);
    }else if (eval(`bottomTopStatus${objName}`) && (scrollHeight <= objTop + objHeight) && direction === false){
      // 对象下边缘从屏幕上边缘离开事件
      if(typeof jsonObj.bottomTopDepart == "function"){
        jsonObj.bottomTopDepart();
      }
      eval(`bottomTopStatus${objName} = false`);
    }

    // 从屏幕底部算起滚动完成百分比
    if((scrollHeight + winHeight >= objTop) && (scrollHeight <= objTop + objHeight)){
      // 对象从底部进入滚动完成百分比
      if(typeof jsonObj.bottomCompletionRate == "function"){
        jsonObj.bottomCompletionRate((scrollHeight + winHeight - objTop) / (objHeight + winHeight));
      }
    }

    // 从屏幕顶部算起滚动完成百分比
    if ((scrollHeight >= objTop) && (scrollHeight <=  objTop + objHeight)) {
      // 对象上边缘滚入屏幕上边缘触发回调完成百分比
      if(typeof jsonObj.topCompletionRate == "function"){
        jsonObj.topCompletionRate((scrollHeight - objTop) / objHeight);
      }
    }
  })
}


$(document).ready(function(){
  const $headerBox = $(".header-box"); // 导航标题
  // 第一屏幕动画
  const $box01 = $(".box01");
  // 第二屏幕动画
  const $box02 = $(".box02");
  const $animationBox02 = $box02.children(".animation-box"); // 动画框
  const $lightBox = $animationBox02.children(".light-box"); // 点亮动画
  const $slideRightBox = $animationBox02.children(".slide-right-box"); // 车辆右滑动画
  const $slideTopBox = $animationBox02.children(".slide-top-box"); // 车辆上滑动画
  const box02 = objScrollMonitor({
    el:".box02",
    topTopDepart: () => {
      // 对象上边缘从屏幕上边缘离开事件
      $animationBox02.removeClass("fixed-box");
      $lightBox.find(".light-img").css({"opacity": 0});
    },
    topTopEnter: () => {
      // 对象上边缘从屏幕上边缘进入事件
      $animationBox02.addClass("fixed-box");
    },
    topBottomEnter: () => {
      // 对象上边缘从屏幕下边缘进入事件
      $headerBox.css({"top": "0px"});
    },
    topBottomDepart: () => {
      // 对象上边缘从屏幕下边缘离开事件
      $headerBox.removeAttr("style");
    },
    bottomBottomDepart: () => {
      // 对象下边缘从屏幕下边缘离开事件
      $animationBox02.addClass("fixed-box").removeAttr("style");
    },
    bottomBottomEnter: () => {
      // 对象下边缘从屏幕下边缘进入事件
      $animationBox02.removeClass("fixed-box").css("bottom", 0);
      
    },
    bottomCompletionRate: (val) => {
      // 第一屏动画
      if(val < 0.25){
        let animationProgress = val / 0.25;
        $box01.find(".description").css({"opacity": 1 - animationProgress, "top": `${ 25 * (1 - animationProgress) }%`});
      }else {
        $box01.find(".description").css({"opacity": 0, "top": "0%"});
      }
    },
    // 对象上边缘滚入屏幕上边缘触发回调完成百分比
    topCompletionRate: (val) => {
      const animationTime = [[0, 0.15, 0.18], [0.2, 0.4], [0.42, 0.62]]; // 动画时间

      // 点亮动画
      if (val <= animationTime[0][1]) {
        let animationProgress = val / animationTime[0][1];
        $lightBox.find(".light-img").css({"opacity": animationProgress});
        // 描述
        if ((animationProgress > 0.3) && (animationProgress <= 0.9)) {
          let description = (animationProgress - 0.3) / 0.6;
          $lightBox.find(".description").css({"top": `${40 - (30 * description)}%`, "opacity": description});
        } else if (animationProgress > 0.9) {
          $lightBox.find(".description").css({"top": `10%`, "opacity": 1});
        } else if(animationProgress < 0.3) {
          $lightBox.find(".description").removeAttr("style");
        }
      } else if (val < animationTime[0][2] ) {
        $lightBox.find(".light-img").css({"opacity": 1});
        $slideRightBox.removeAttr("style");
      }

      // 车辆右滑动画
      if (val >= animationTime[1][0] && val <= animationTime[1][1]) {
        let animationProgress = (val - animationTime[1][0]) / 0.2;
        $slideRightBox.css({"width": `${animationProgress * 100}%`});
        // 描述
        if (animationProgress >= 0.2 && animationProgress <= 0.8) {
          let description = (animationProgress - 0.2) / 0.6;
          $slideRightBox.find(".description").css({"opacity": description, "left": `${ 8 * description}%`});
        } else if (animationProgress > 0.8){
          $slideRightBox.find(".description").css({"opacity": 1, "left": "8%"});
        }
      } else if (val > animationTime[1][1] && val < animationTime[2][1]){
        $slideRightBox.css({"width": `100%`});
      }

      // 车辆上滑动画
      if (val >= animationTime[2][0] && val <= animationTime[2][1]) {
        let animationProgress = (val - animationTime[2][0]) / 0.22;
        $slideTopBox.css({"height": `${ animationProgress * 100}%`, "top": `${ (1 - animationProgress) * 100}%`});
      } else if(val > animationTime[2][1]) {
        $slideTopBox.css({"height": "100%", "top": "0%"});
        // 描述
        let animationProgress = (val - animationTime[2][1]) / (1 - animationTime[2][1]);
        if (animationProgress >= 0 && animationProgress <= 0.6) {
          let description = animationProgress / 0.6;
          $slideTopBox.find(".description").css({"opacity": description, "top": `${ 50 - (30 * description)}%`});
        } else if (animationProgress > 0.8){
          $slideTopBox.find(".description").css({"opacity": 1, "top": "20%"});
        }
      } else if(val < animationTime[2][0]) {
        $slideTopBox.removeAttr("style");
      }
      
    }
  });

  // 第三屏幕动画
  const $box03 = $(".box03");
  const $animationBox03 = $box03.children(".animation-box"); // 动画框
  const $parameterBox = $animationBox03.children(".parameter-box"); // 动力续航
  const $slide01Box = $animationBox03.children(".slide-01-box"); // 滑动效果1
  const $slide02Box = $animationBox03.children(".slide-02-box"); // 滑动效果2
  const $deployBok = $animationBox03.children(".deploy-bok"); // 选配置
  const box03 = objScrollMonitor({
    el:".box03",
    topTopEnter: () => {
      // 对象上边缘从屏幕上边缘进入事件
      $animationBox03.addClass("fixed-box");
      $headerBox.addClass("header-black");
    },
    topTopDepart: () => {
      // 对象上边缘从屏幕上边缘离开事件
      $animationBox03.removeClass("fixed-box");
      $headerBox.removeClass("header-black");
    },
    // 对象上边缘进入滚动完成百分比
    bottomCompletionRate: (val) => {
      const animationTime = [[0, 0.15, 0.18], [0.2, 0.35, 0.38], [0.4, 0.55, 0.58], [0.65, 0.85]]; // 动画时间

      // 动力续航
      if (val <= animationTime[0][1]) {
        let animationProgress = val / animationTime[0][1];
        $parameterBox.css({"opacity": animationProgress});
        // 描述
        if (animationProgress >= 0.4 && animationProgress < 1){
          let description = (animationProgress - 0.4) / 0.6;
          $parameterBox.find(".title-box").css({"opacity": description, "top": `${ 50 - (40 * description) }%`});
        }
      } else if (val > animationTime[0][1]) {
        $parameterBox.css({"opacity": 1});
        $parameterBox.find(".title-box").css({"opacity": 1, "top": "10%"});
      }
      // 参数
      if (val > animationTime[0][1] && val < animationTime[0][2]) {
        let animationProgress = (val - animationTime[0][1]) / (animationTime[0][2] - animationTime[0][1]);
        $parameterBox.find(".value").css({"opacity": animationProgress});
      } else if (val > animationTime[0][2]) {
        $parameterBox.find(".value").css({"opacity": 1});
      }

      // 滑动效果1
      if (val > animationTime[1][0] && val <= animationTime[1][1]) {
        let animationProgress = (val - animationTime[1][0]) / (animationTime[1][1] - animationTime[1][0]);
        $slide01Box.css({"display": "block", "height": `${ animationProgress * 100}%`});
      } else if (val > animationTime[1][1]) {
        $slide01Box.css({"display": "block", "height": "100%"});
      } else if (val < animationTime[1][0]){
        $slide01Box.removeAttr("style");
      }
      // 图标
      if (val > animationTime[1][1] && val < animationTime[1][2]) {
        let animationProgress = (val - animationTime[1][1]) / (animationTime[1][2] - animationTime[1][1]);
        $slide01Box.find(".name-box").css({"opacity": animationProgress, "top": `${ 70 - (15 * animationProgress) }%`});
      } else if (val > animationTime[1][2]) {
        $slide01Box.find(".name-box").css({"opacity": 1, "top": "55%"});
      } else {
        $slide01Box.find(".name-box").removeAttr("style");
      }

      // 滑动效果2
      if (val > animationTime[2][0] && val <= animationTime[2][1]) {
        let animationProgress = (val - animationTime[2][0]) / (animationTime[2][1] - animationTime[2][0]);
        $slide02Box.css({"display": "block", "height": `${ animationProgress * 100}%`});
      }else if (val < animationTime[2][0]) {
        $slide02Box.removeAttr("style");
      } else if(val > animationTime[2][2] && val < animationTime[3][0]) {
        $slide02Box.css({"display": "block", "height": "100%"});
      } 
      // 图标
      if (val > animationTime[2][1] && val < animationTime[2][2]) {
        let animationProgress = (val - animationTime[2][1]) / (animationTime[2][2] - animationTime[2][1]);
        $slide02Box.find(".name-box").css({"opacity": animationProgress, "top": `${ 70 - (15 * animationProgress) }%`});
      } else if (val > animationTime[2][2] && val < animationTime[3][0]) {
        $slide02Box.find(".name-box").css({"opacity": 1, "top": "55%"});
        $slide02Box.find(".slide-02").removeAttr("style");
        $deployBok.removeAttr("style");
      } else {
        $slide02Box.find(".name-box").removeAttr("style");
      }

      // 选配置
      if (val > animationTime[3][0] && val <= animationTime[3][1]) {
        let animationProgress = (val - animationTime[3][0]) / (animationTime[3][1] - animationTime[3][0]);
        $deployBok.css({"display": "block"});

        // 滑动效果2 淡出
        if (animationProgress < 0.2){
          $slide02Box.find(".slide-02").css({"opacity": 1 - animationProgress / 0.2});
          $deployBok.css({"opacity": animationProgress / 0.2});
        } else if (animationProgress > 0.2) {
          $slide02Box.find(".slide-02").css({"opacity": 0, "display": "none"});
          $deployBok.css({"opacity": 1});
        }

        // 车缩小
        if (animationProgress > 0.2 && animationProgress < 0.4){
          let carScale = (animationProgress - 0.2) / 0.2;
          $deployBok.find(".car").css({"top": `${57 - 34 * carScale}%`, "transform": `translate(-50%, -50%) scale(${ 1 - 0.3 * carScale })`});
        } else if (animationProgress > 0.4) {
          $deployBok.find(".car").css({"top": "23%", "transform": "translate(-50%, -50%) scale(0.7)"});
        } else if (animationProgress < 0.2) {
          $deployBok.find(".car").removeAttr("style");
        }

        // 配置数据
        if(animationProgress > 0.4 && animationProgress <= 0.8) {
          let deployValue = (animationProgress - 0.4) / 0.4;
          $deployBok.find(".deploy").css({"opacity": deployValue, "top": `${100 - 66 * deployValue}%`});
        } else if (animationProgress > 0.8) {
          $deployBok.find(".deploy").css({"opacity": 1, "top": "34%"});
        }
      }

    },
  });

  // 第四屏幕动画
  const $box04 = $(".box04");
  const $animationBox04 = $box04.children(".animation-box"); // 动画框
  const box04 = objScrollMonitor({
    el: ".box04",
    topTopEnter: () => {
      // 对象上边缘从屏幕上边缘进入事件
      $animationBox04.addClass("fixed-box");
    },
    topTopDepart: () => {
      // 对象上边缘从屏幕上边缘离开事件
      $animationBox04.removeClass("fixed-box");
    },
    // 对象上边缘滚入屏幕上边缘触发回调完成百分比
    topCompletionRate: (val) => {
      const animationTime = [[0, 0.3], [0.4, 0.6]]; // 动画时间

      // 内饰亮起来
      if (val <= animationTime[0][1]) {
        let animationProgress = val / animationTime[0][1];
        $animationBox04.find(".dim").css({"opacity": animationProgress});
      } else if (val > animationTime[0][1]) {
        $animationBox04.find(".dim").css({"opacity": 1});
      }

      // 描述出来
      if (val > animationTime[1][0] && val <= animationTime[1][1]) {
        let animationProgress = (val - animationTime[1][0]) / (animationTime[1][1] - animationTime[1][0]);
        $animationBox04.find(".describe").css({"opacity": animationProgress, "top": `${36 - 16 * animationProgress}%`});
      } else if (val > animationTime[1][1]) {
        $animationBox04.find(".describe").css({"opacity": 1, "top": "20%"});
      }
    }
  });

  // 第五屏幕动画
  const $box05 = $(".box05");
  const $titleBox05 = $box05.children(".title-box"); // 标题动画
  const box05 = objScrollMonitor({
    el:".box05",
    topTopEnter: () => {
      // 对象上边缘从屏幕上边缘进入事件
      $titleBox05.css({"position": "fixed"});
    },
    topTopDepart: () => {
      // 对象上边缘从屏幕上边缘离开事件
      $titleBox05.removeAttr("style");
    },
    topCompletionRate: (val) => {
      if (val >= 0.8) {
        $titleBox05.css({"position": "absolute", "bottom": "30px", "top": "auto"});
      } else {
        $titleBox05.css({"position": "fixed", "top": "120px"});
      }
    }
  });

  // 第六屏幕动画
  const $box06 = $(".box06");
  const $titleBox06 = $box06.children(".title-box"); // 标题
  const $iconBox06 = $box06.children(".icon-box"); // 标题
  const box06 = objScrollMonitor({
    el: ".box06",
    topTopEnter: () => {
      // 对象上边缘从屏幕上边缘进入事件
      $headerBox.addClass("header-white");
      $headerBox.removeClass("header-black");
    },
    topTopDepart: () => {
      // 对象上边缘从屏幕上边缘离开事件
      $headerBox.removeClass("header-white");
      $headerBox.addClass("header-black");
    },
    bottomCompletionRate(val){
      // 标题
      if (val >= 0 && val < 0.4) {
        let animationProgress = (val - 0.1) / 0.4;
        $titleBox06.css({"opacity": animationProgress, "top": `${50 - 30 * animationProgress}%`});
      } else if (val >= 0.4) {
        $titleBox06.css({"opacity": 1, "top": "20%"});
      }

      // 图标介绍
      if (val >= 0.3 && val < 0.45) {
        let animationProgress = (val - 0.3) / 0.15;
        $iconBox06.css({"bottom":`${ -160 + 160 * animationProgress}px`});
      } else if (val > 0.45) {
        $iconBox06.css({"bottom":"0px"});
      }
    }
  })

})