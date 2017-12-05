// 播放视频
function playVideo_05(vid){
    var video = new tvp.VideoInfo();
    video.setVid(vid);
    var player =new tvp.Player();
    player.create({
        width:743,
        height:418,
        video:video,
        modId:"player_05", //mod_player 是刚刚在页面添加的 div 容器
        autoplay:true,
        flashWmode: "opaque",
        isHtmlConstrolAlwaysShow:false,
        vodFlashExtVars: { showend: 0,share: 0, favorite: 0,searchbar:0,searchpanel:0,bullet: 0,clientbar: 0 }
    });
}

//倒计时
function showTime() {
    /****倒计时***/
    var time_start = new Date().getTime();//系统当前时间
    //var time_end = new Date("2017/08/15 14:00:00").getTime(); //设定结束时间
    var time_end = new Date(budweiser.liveStartTime).getTime(); //设定结束时间
    //计算时间差
    var time_distance = time_end - time_start;
    if(time_distance > 0) {
        // 天时分秒换算
        var int_day = Math.floor(time_distance / 86400000);
        time_distance -= int_day * 86400000;
        var int_hour = Math.floor(time_distance / 3600000);
        time_distance -= int_hour * 3600000;
        var int_minute = Math.floor(time_distance / 60000);
        time_distance -= int_minute * 60000;
        var int_second = Math.floor(time_distance / 1000);
        var day_str = int_day.toString();
        var hour_str = int_hour.toString();
        var minute_str = int_minute.toString();
        var second_str = int_second.toString();
        if(day_str.length == 1){
            day_str = "0" + day_str;
        }
        if(hour_str.length == 1){
            hour_str = "0" + hour_str;
        }
        if(minute_str.length == 1){
            minute_str = "0" + minute_str;
        }
        if(second_str.length == 1){
            second_str = "0" + second_str;
        }
        $(".time_day").text(day_str);
        $(".time_hour").text(hour_str);
        $(".time_min").text(minute_str);
        $(".time_sec").text(second_str);

    }else{
        $(".time_day").text("00");
        $(".time_hour").text("00");
        $(".time_min").text("00");
        $(".time_sec").text("00");
        
        //停止倒计时
        if(typeof countDownClock != "undefined"){window.clearInterval(countDownClock);};
        //$(".live_before").hide();
        //$(".live").show();
    }
}

// 评论区字数检测
function textNumber(){
    var test =  $(".comment_inp").val();
    var textNumber = test.length;
    if(textNumber > 30){
        $(".comment_inp").val(test.substr(0,30))
    }
}

//获取最新30条评论
function getNewComments(){
    budweiser.getTop(function(res){
        if(res && res.code==0){
            var commentSrc = "";
            var comments = res.comments;
            budweiser.comments=comments;

            for(var i=0,max = comments.length;i<max;i++)
            {
                if(comments[i].user.length>0 && comments[i].comment.length>0)
                {
                    commentSrc = commentSrc+"<li><p>"+comments[i].user+":</p><span>"+comments[i].comment+"</span></li>";
                }
            }
            if(typeof commentSp == "undefined"){
                $(".comment_content").html();
                $(".comment_content").html(commentSrc);

                // 评论区滚动条
                commentSp = $(".comment_content").jScrollPane(
                    {
                        verticalDragMinHeight: 16,
                        verticalDragMaxHeight: 16
                    }
                );
            }else{
                $(".jspPane").html(commentSrc);
            }

        }else{
            //alert(res.message);
            return false;
        }
    });
}



//初始化评论功能
function initComment(){
    h5e.switchstatus.init({
        actId: '641012504',//在直播管理后台添加活动的id
        classId: 10,
        callback: function(data){
            var commentSwitch = data[10];
            budweiser.commentSwitch = commentSwitch;
            setComment(commentSwitch);
        },
        error: function(data){
          //错误处理
        }
    });
}

//根据开关状态设置是否允许评论
function setComment(commentSwitch){
    if(commentSwitch == 1){
        //评论开启
        $(".comment_inp").removeAttr("disabled");
        if($(".comment_inp").val().length==0 ||$(".comment_inp").val()=='评论已关闭'){
            $(".comment_inp").val("我要评论/");
        }

        // 输入框获得焦点时
        $(".comment_inp").on("focus",function () {
            if($(".comment_inp").val()=="我要评论/"){
                $(".comment_inp").val("");
            }
        });
        $(".comment_inp").on("blur",function () {
            if($(".comment_inp").val().length==0){
                $(".comment_inp").val("我要评论/");
            }
        });
    }else{
        //禁止评论
        $(".comment_inp").val("评论已关闭");
        $(".comment_inp").attr("disabled",1);
        $(".comment_inp").off("focus");
        $(".comment_inp").off("blur");
        $(".comment_inp").blur();
    };
}

var submitEnableFlag=1;//提交评论按钮防并发
$(function () {
    //贴点:电音社区-PC
    $(".looperEdm").on("click",function(){
        h5e.track.clickMonitor(4);
    });
    
    //贴点:微博官方账号-PC
    $(".sina").on("click",function(){
        h5e.track.clickMonitor(57);
    });
    //贴点:夜点娱乐微信-PC
    $(".entertainment").on("click",function(){
        h5e.track.clickMonitor(58);
    });
    //贴点:百位官网-PC
    $(".official").on("click",function(){
        h5e.track.clickMonitor(59);
    });
    //贴点:直播页中部Banner-PC
    $(".banner_pic").on("click",function(){
        h5e.track.clickMonitor(9);
    });
    
    
    // 重新加载事件
    $(window).bind("load",function(){
        $('html, body').animate({scrollTop:0}, 'fast');
    });

    h5e.live.options.time=15000;
    //获取直播状态
    h5e.live.getStatus({
      actId: '641012504',
      onBefore: function() {
      },
      onLive: function() {
      },
      onAfter: function() {
      },
      //第一次获取状态成功之后
      onComplete: function(status) {
        h5e.live.getFiles({
          actId: '641012504',
          classId: '529,530,531,543,534,542,550,567',
          callback: function(data) {
              //取到素材更新到页面
              budweiser.set(data,status);
          },
          error: function(data) {
        	  $(".header").show();
        	  $(".video_bg_01 img").attr("src","images/video_01_bg.png");
        	  $(".video_bg_02 img").attr("src","images/video_01_bg.png");
        	  $(".video_bg_03 img").attr("src","images/video_01_bg.png");
              liveStart();
          }
        });
      },
      //状态发生改变之后
      onChange: function(status) {
          budweiser.update(status);
      }
    });


    // 字数检测
    $(".comment_inp").bind('input propertychange','text',function(){
        textNumber();
    })

    // 立即发表按钮点击
    $(".commit_btn").on("click",function () {
         if(submitEnableFlag==0){
             return false;
         };
         submitEnableFlag = 0;
         
        //贴点:立即发表按钮-PC
        h5e.track.clickMonitor(8);

        h5e.switchstatus.init({
            actId: '641012504',//在直播管理后台添加活动的id
            classId: 10,
            callback: function(data){
                var commentSwitch = data[10];
                var oldSwitch = budweiser.commentSwitch;
                budweiser.commentSwitch = commentSwitch;
                setComment(commentSwitch);
                if(oldSwitch ==0 || commentSwitch==0){
                    return false;
                }

                if(commentSwitch == 1)
                {
                    //评论开启
                    if($(".comment_inp").val().length==0||$(".comment_inp").val()==="我要评论/")
                    {
                        alert("请输入评论内容");
                        submitEnableFlag = 1;
                        return false;
                    }

                    //停止获取最新的评论
                    //if(typeof commentClock != "undefined"){window.clearInterval(commentClock);};

                    var comment = $(".comment_inp").val();
                    budweiser.saveComment(comment,function(res){
                        if(res && res.code==0){
                            //alert("评论成功");
                            $(".comment_inp").val("我要评论/");
                            var newSrc = "<li><p>腾讯用户:</p><span>"+comment+"</span></li>"+$(".jspPane").html();
                            $(".jspPane").html(newSrc);

                            if(budweiser.liveStatus == 1){
                                setTimeout(function() { 
                                    //30S之后，获取一次最新的评论
                                    //commentClock = setInterval("getNewComments()",15000);
                                	getNewComments();
                                 }, 30000); 
                            }
                            submitEnableFlag = 1;
                        }else{
                            alert(res.message);
                            if(budweiser.liveStatus == 1){
                                //每隔15S获取一次最新的评论
                                //commentClock = setInterval("getNewComments()",15000);
                            }
                            submitEnableFlag = 1;
                            return false;
                        }
                    });
                }
            },
            error: function(data){
              //错误处理
                submitEnableFlag = 1;
            }
        });
    });

    // 初始化
    $(".border").eq(0).hide();
    $(".tab_active").eq(0).show();
    //$(".play_video").eq(0).show();


    // 底部hover效果
    $(".footer span").hover(function () {
        $(this).addClass("active");
    },function () {
        $(this).removeClass("active");
    });

    $(".sina").on("click",function () {
        window.open("http://weibo.com/budweiser");
    })
    $(".weixin").hover(function () {
        $(".bottom_code").show();
    },function () {
        $(".bottom_code").hide();
    })
    $(".entertainment").on("click",function () {
        window.open("http://production-yedian.chinacloudapp.cn/dist/landing.html?utm_source=utm_source_1&utm_medium=paid-ad&utm_campaign=landing");
    })
    $(".official").on("click",function () {
        window.open("https://www.bud.cn/ ");
    })

    // 切换hover效果
    $(".tab").hover(function () {
        $(this).find(".border img").attr("src","images/mouseover.gif");
    },function () {
        $(this).find(".border img").attr("src","images/border.png");
    })

    // 切换视频
    $(".tab").on("click",function () {
        $(".border").show();
        $(".tab_active").hide();
        $(this).find(".border").hide();
        $(this).find(".tab_active").show();
        var num = $(this).attr("video-url");
        $(".play_video").hide();
        $(".video_"+num).fadeIn(2000);
        //$("#player_05").hide();
        //$("#player_05").empty();
        $("#player_05").html("");
        if(budweiser.liveStatus ==1){
            if(num=="01"){
                h5e.track.clickMonitor(5);//贴点:主会场-PC
            }else if(num=="02"){
                h5e.track.clickMonitor(6);//贴点:KOL1-PC
            }else{
                h5e.track.clickMonitor(7);//贴点:KOL2-PC
            }
            $("#player_05").show();
            var index = $(this).attr("index");
            playLiveVideo(index);
        }else{
            $("#player_05").hide();
        }
    })

    // 视频部分hover效果
    $(".play_video").hover(function () {
        $(this).find(".video_bg").addClass("bigger");
        $(this).find(".play_btn img").attr("src","images/play_active.gif");
    },function () {
        $(this).find(".video_bg").removeClass("bigger");
        $(this).find(".play_btn img").attr("src","images/play_btn.png");
    })
    //播放视频
    $(".play_video").on("click",function () {
        //var vid = $(this).attr("vid");
        $("#player_05").show();
        //playVideo(vid,"player_01");
        var index = $(this).attr("index");
        playLiveVideo(index);
    })

    // 箭头消失出现
    $(window).scroll(function () {
        var a = $(".copyright").offset().top;
        if (a >= $(window).scrollTop() && a < ($(window).scrollTop() + $(window).height())) {
            $(".down").fadeOut();
        }else {
            $(".down").fadeIn();
        }
    });

    // 小箭头点击事件
    $(".down").on("click",function () {
        var winHeight = $(window).height();
        var topNum = $(document).scrollTop();
        winHeight+=topNum;
        $(document).scrollTop(winHeight);
    })

    var beforeScrollTop = $(window).scrollTop();
    $(window).scroll(function(){
        var afterScrollTop = $(window).scrollTop();
        if (afterScrollTop-beforeScrollTop > 0){
            var topNum = $(window).scrollTop();
            var winTop = $(window).height();
            var number = topNum + winTop;
            var bannerTop = $(".banner").offset().top;
            var chartsTop = $(".charts").offset().top;
            var lookbackTop = $(".lookback").offset().top;
            var noticeTop = $(".notice").offset().top;
            if ( bannerTop <= number-20){
                scrollin(".banner");
            }
            if ( chartsTop <= number-20){
                scrollin(".charts");
            }
            if ( lookbackTop <= number-20){
                scrollin(".lookback");
            }
            if ( noticeTop <= number-20){
                scrollin(".notice");
            }
        }else if (afterScrollTop-beforeScrollTop === 0){
            return;
        }else if (afterScrollTop-beforeScrollTop < 0){
            scrollout(".banner");
            scrollout(".charts");
            scrollout(".lookback");
            scrollout(".notice");
        }
        beforeScrollTop=afterScrollTop;
    })
})
function scrollin(obj) {
    $(obj).addClass("move");
    $(obj).animate({opacity:"1", filter:"alpha(opacity=100)"},2000);
}
function scrollout(obj) {
    $(obj).removeClass("move");
}
window.onload=function(){
    //页面贴点
    h5e.track.clickMonitor(0);
    //获取最新评论
    getNewComments();
    //设置素材延后加载
    budweiser.setResource();
    
}