'use strict';

// 设置浏览器不记录上次滚动条的位置--禁止刷新重置滚动条
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// 数字滚动
(function ($) {
  $.fn.numberRock = function (options) { 
    var defaults = { speed: 24, count: 100 }; 
    var opts = $.extend({}, defaults, options); 
    var div_by = 100, count = opts["count"], speed = Math.floor(count / div_by), sum = 0, $display = this, run_count = 1, int_speed = opts["speed"]; 
    var int = setInterval(function () { 
      if (run_count <= div_by && speed != 0) { 
        sum = speed * run_count
        let sumStr = sum.toString();
        let sumArray = [];
        let sumNumber = Math.ceil(sumStr.length/3);
        for(let i = 1; i <= sumNumber; i++){
          sumArray.push(sumStr.slice((sumStr.length - i*3) > 0 ? (sumStr.length - i*3) : 0, sumStr.length - (i-1)*3))
        }
        sumArray.reverse();
        sumStr = "";
        sumArray.forEach((itme, index) => {
          if (index < (sumArray.length - 1)){
            sumStr += itme + ",";
          } else {
            sumStr += itme;
          }
        })
        $display.text(sumStr);
        run_count++; 
      } else if (sum < count) { 
        let sumStr = sum.toString();
        let sumArray = [];
        let sumNumber = Math.ceil(sumStr.length/3);
        for(let i = 1; i <= sumNumber; i++){
          sumArray.push(sumStr.slice((sumStr.length - i*3) > 0 ? (sumStr.length - i*3) : 0, sumStr.length - (i-1)*3))
        }
        sumArray.reverse();
        sumStr = "";
        sumArray.forEach((itme, index) => {
          if (index < (sumArray.length - 1)){
            sumStr += itme + ",";
          } else {
            sumStr += itme;
          }
        })
        $display.text(sumStr); 
        ++sum
      } else { 
        clearInterval(int); 
      } 
    }, int_speed);
    } 
  })(jQuery);

$(document).ready(function() {
  let $setTimeout = Object; // 延时执行对象
  let oldScroll = 0; // 历史滚动条位置
  const $box01 = $(".box01"); // 第一屏框
  const $titleBox01 = $box01.children(".title-box"); // 标题描述

  const $box03 = $(".box03"); // 第三屏框
  const $coverBox03 = $box03.children(".cover-box"); // 图片
  const $description03 = $box03.children(".description"); // 描述
  const $parameter03 = $box03.children(".parameter"); // 参数
  const $detailBut03 = $box03.children(".detail-but"); // 配置按钮

  // win竖直滚动
  let numberScrollStatus = false; // 数字滚动触发状态
  const upright = new Swiper(".win-box", {
    direction: "vertical",
    watchSlidesProgress : true,
    on:{
      init: function(){
        swiperAnimateCache(this); //隐藏动画元素
        swiperAnimate(this); //初始化完成开始动画
      }, 
      progress: function(progress) {
        // 第一个屏---标题描述
        if (this.slides[0].progress >= 0 && this.slides[0].progress <= 0.3) {
          let progressVal = this.slides[0].progress / 0.3;
          $titleBox01.css({"opacity": 1 - progressVal, "top": `${30 - 15 * progressVal}%`});
        } else if (this.slides[0].progress > 0.3) {
          $titleBox01.css({"opacity": 1, "top": "30%"});
        }

        // 第三屏
        // 图片
        if (this.slides[2].progress >= -1 && this.slides[2].progress <= -0.5) {
          let progressVal = (1 + this.slides[2].progress) / 0.5;
          $coverBox03.css({"opacity": progressVal});
        } else if(this.slides[2].progress > -0.5) {
          $coverBox03.css({"opacity": 1});
        }

        // 描述
        if (this.slides[2].progress >= -0.4 && this.slides[2].progress <= -0.1) {
          let progressVal = 1 + (this.slides[2].progress + 0.1) / 0.3;
          $description03.css({"opacity": progressVal, "top": `${70 - 15 * progressVal}%`});
        } else if (this.slides[2].progress > -0.1) {
          $description03.css({"opacity": 1, "top": "55%"});
        }

        // 参数
        if (this.slides[2].progress >= -0.3 && this.slides[2].progress <= 0) {
          let progressVal = 1 + this.slides[2].progress / 0.3;
          $parameter03.css({"opacity": progressVal, "top": `${85 - 15 * progressVal}%`});
        } else if (this.slides[2].progress > 0) {
          $parameter03.css({"opacity": 1, "top": "70%"});
        }

        // 配置按钮
        if (this.slides[2].progress >= -0.1 && this.slides[2].progress <= 0) {
          let progressVal = 1 + this.slides[2].progress / 0.1;
          $detailBut03.css({"opacity": progressVal, "top": `${103 - 15 * progressVal}%`});
          // 数字滚动
          if (!numberScrollStatus) {
            numberScrollStatus = true;
            $(".power").numberRock({
              speed:10,
              count:160
            });
            $(".endurance").numberRock({
              speed:10,
              count:605
            });
          }
        } else if (this.slides[2].progress > 0) {
          $detailBut03.css({"opacity": 1, "top": "88%"});
        }

        // 重置数字滚动状态
        if(this.slides[1].progress == 1 || this.slides[3].progress == 1){
          numberScrollStatus = false;
        }

      },
      slideChangeTransitionEnd: function(){
        // 第四屏动
        swiperAnimateCache(this); //隐藏动画元素 
        swiperAnimate(this); //初始化完成开始动画
        if (this.activeIndex == 3) {
          swiperAnimate(this);
          setTimeout(() => {
            $(".price01").numberRock({
              speed:10,
              count:159900
            });
            $(".price02").numberRock({
              speed:10,
              count:169900
            });
            $(".price03").numberRock({
              speed:10,
              count:179900
            });
          }, 2000);
        }

        // 浮动框的出现
        if(this.activeIndex != 0){
          $(".float-box").css({"top": "0%", "opacity": 1})
          if (this.previousIndex > this.activeIndex && !$(".float-box").is(":hidden")) {
            $(".float-box").children(".top").fadeIn("slow");
          }
        } else {
          $(".float-box").removeAttr("style");
        }
        clearTimeout($setTimeout);
        $setTimeout = setTimeout(() => {
          $(".float-box").children(".top").fadeOut("slow");
        }, 1500)
      },
      // Swiper结束
      touchEnd: function() {
        let offsetDistance = this.translate;
        let winHeight = $(window).height();
        $(window).unbind("scroll");
        if(offsetDistance < -(winHeight * 3)){
          this.setTranslate(offsetDistance);
          $("html,body").animate({scrollTop: winHeight}, 500, function(){
            $("body").css({"overflow": "overlay"});
            // 返回滚动条上面
            $(window).bind("scroll", function() {
              let scrollHeight = $(window).scrollTop(); // 滚动条高度
              if ((winHeight > scrollHeight) && (scrollHeight != 0)){
                $("html,body").animate({scrollTop: 0}, 100, function() {
                  $("body").removeAttr("style");
                });
              }
              // 显示置顶按钮
              if (oldScroll > scrollHeight) {
                $(".float-box").children(".top").fadeIn("slow");
                clearTimeout($setTimeout);
                $setTimeout = setTimeout(() => {
                  $(".float-box").children(".top").fadeOut("slow");
                }, 1500)
              }
              oldScroll = scrollHeight;
            })
          });
        };
      },
    }
  });
  
  // 返回顶部
  $(".top-icon").bind("touchstart", function() {
    $("html,body").animate({scrollTop: 0}, 100);
    upright.slideTo(0, 100, true);
  })

  
  // 第二屏
  const $box02 = $(".box02"); // 第二屏框
  const $box0201 = $box02.find(".box02-01"); // 切换01
  const $box0202 = $box02.find(".box02-02"); // 切换02
  const $box0203 = $box02.find(".box02-03"); // 切换03
  const box02 = new Swiper(".box02-swiper", {
    watchSlidesProgress : true,
    pagination: {
      el: '.box02-pagination',
    },
    on:{
      progress: function(progress) {
        // 切换01
        if (this.slides[0].progress >= 0 && this.slides[0].progress <= 0.6) {
          let progressVal = this.slides[0].progress / 0.6;
          $box0201.children(".title-box").css({"opacity": 1 - progressVal, "top": `${80 + 15 * progressVal}%`});
        } else if (this.slides[0].progress > 0.6) {
          $box0201.children(".title-box").css({"opacity":0, "top": "95%"});
        }
        
        // 切换02
        if (this.slides[1].progress >= -1 && this.slides[1].progress <= 0){
          let progressVal = (1 + this.slides[1].progress) / 1;
          $box0202.children(".title-box").css({"opacity": progressVal, "top": `${95 - 15 * progressVal}%`});
        } else if (this.slides[1].progress > 0) {
          $box0202.children(".title-box").css({"opacity": 1, "top": "80%"});
        }
        if (this.slides[1].progress >= 0 && this.slides[1].progress <= 0.6) {
          let progressVal = this.slides[1].progress / 0.6;
          $box0202.children(".title-box").css({"opacity": 1 - progressVal, "top": `${80 + 15 * progressVal}%`});
        } else if(this.slides[1].progress > 0.6) {
          $box0202.children(".title-box").css({"opacity": 0, "top": "95%"});
        }
         
        // 切换03
        if (this.slides[2].progress >= -1 && this.slides[2].progress <= 0) {
          let progressVal = (1 + this.slides[2].progress) / 1;
          $box0203.children(".title-box").css({"opacity": progressVal, "top": `${95 - 15 * progressVal}%`});
        }

      }, 
    }
  })

  // box04 选择
  let $box04Unit = $(".select-box").children(".unit");
  $box04Unit.bind("click", function(){
    $box04Unit.removeClass("select");
    $box04Unit.eq($(this).index()).addClass("select");
    if ($(this).index() == 0){
      $(".price01").numberRock({
        speed:5,
        count:159900
      });
    } else if ($(this).index() == 1) {
      $(".price02").numberRock({
        speed:5,
        count:169900
      });
    } else if ($(this).index() == 2) {
      $(".price03").numberRock({
        speed:5,
        count:179900
      });
    }
  });

  // 第六屏滚动
  var box05Swiper = new Swiper('.box05-swiper', {
    pagination: {
      el: '.box05-pagination',
    },
    on:{
      init: function(){
        swiperAnimateCache(this); //隐藏动画元素 
        swiperAnimate(this); //初始化完成开始动画
      }, 
      slideChangeTransitionEnd: function(){ 
        swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
      } 
    }
  });
})