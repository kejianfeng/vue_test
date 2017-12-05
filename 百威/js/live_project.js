/**
 * 百威Vibe Channel 3.0 PC端接口
 * @author sanmao 2017-8-7
 * @version v1.0
 */

var budweiser= {};
budweiser.liveStatus=0;//直播前
budweiser.commentSwitch=0;//开关关闭,禁止评论。
budweiser.liveStartTime="2017/08/15 14:00:00";//直播开始时间
budweiser.playingVideoIndex=0;//直播区正在播放的视频索引

function getGtk() {
    return h5e.util.getACSRFToken();
}

budweiser.netError = 
{
    "code": 101,
    "message": "网络繁忙,请稍后重试"
};

/**
 * 分享
 */
budweiser.initShare =function()
{
    var siteUrl = "http://budweiser.act.qq.com/pc/";
    if (0 === (window.location.host).indexOf('sh.act.qq.com')) {
        siteUrl = 'http://sh.act.qq.com/641012504/pc/';
    }

    var shareData = {
            title: '全球电音盛会2017Tomorrowland',
            desc: "全世界知名比利时电子音乐节，首次双周末直播",
            timeLineTitle:  "全球电音盛会2017Tomorrowland",
            img: "http://appmedia.qq.com/media/ABinBevLiveMusic/LiveMusic.jpg",
            url: siteUrl,
            onSuccess: function(res){},
            onCancel: function (res){}
    };
    
    h5e.share.init(shareData); 
};


//排序
function jsonSort(array, field, reverse) {
       //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
       if(array.length < 2 || !field || typeof array[0] !== "object") return array;
       //数字类和可以转换为整数的字符串排序
       if((typeof array[0][field] === "number")||array[0][field] == parseInt(array[0][field])) {
         array.sort(function(x, y) { return x[field] - y[field]});
       }
       //字符串类型排序
       else if(typeof array[0][field] === "string") {
         array.sort(function(x, y) { return x[field].localeCompare(y[field])});
       }
       //倒序
       if(reverse) {
         array.reverse();
       }
       return array;
     }

function sortObjectBy(obj,typeName,reverse){
  var newArr = new Array();
  for(var i in obj){
       var tempObj  = obj[i];
       tempObj['id'] = i;
       newArr.push(tempObj);
   }
  newArr = jsonSort(newArr,typeName,reverse);
   return newArr;
}


    /**
     * 视频管理后台默认素材WAP
     */
    liveArr = {
      //直播前视频
      liveBeforeVideo: {video_url:"f0506b1ljtv",max_url:"images/video_01_bg.png"},

      //直播中视频
      liveVideos:[{fw_title:"主会场",video_url:"100003601",max_url:"images/video_01_bg.png"},
                  {fw_title:"KOL1",video_url:"100003601",max_url:"images/video_02_bg.png",fw_other1:0},
                  {fw_title:"KOL2",video_url:"100003601",max_url:"images/video_03_bg.png",fw_other1:0}
          ],

    //直播结束后视频
    liveAfterVideo: {video_url:'y0019msx9a3',max_url:"images/video_01_bg.png"},

    //往期回顾
    lookback:[{fw_title:"TL-世界电音 恩恩爱爱  ",max_url:"images/lookback_pic_01.png",fw_url:"http://v.qq.com/x/cover/alaf28p8xvwmk63/c0022qfy08a.html"},
                  {fw_title:"TL-世界电音 恩恩爱爱  ",max_url:"images/lookback_pic_02.png",fw_url:"https://v.qq.com/x/cover/alaf28p8xvwmk63/v0022dwwsbj.html"},
                  {fw_title:"DVBBS释出最新单曲 ",max_url:"images/lookback_pic_03.png",fw_url:"https://v.qq.com/x/cover/jx8poe9w6wu5nbo/s0022n87hfm.html"},
                  {fw_title:"DVBBS释出最新单曲  ",max_url:"images/lookback_pic_04.png",fw_url:"https://v.qq.com/x/cover/sooo89hc9hfm8wf/i0021jkgnlu.html"}
                  ],
    //直播观看人数likeId
    likeClassId:57,
    
    //直播页面DJ排行榜投票策略
    voteClass:{fw_title:"DJ排行榜投票策略",fw_other1:"42",fw_other2:"172,173,174,175"},

    //直播页面DJ排行榜
    votes:{
        172:{voteWorkNums: "0", voteWorkName: "BLACK COFFEE", picurl: "images/charts_pic_01.png",id: "172"},
        173:{voteWorkNums: "0", voteWorkName: "JAMAL BOSS", picurl: "images/charts_pic_02.png",id: "173"},
        174:{voteWorkNums: "27", voteWorkName: "BLACK COFFEE2", picurl: "images/charts_pic_03.png",id: "174"},
        175:{voteWorkNums: "93", voteWorkName: "STEVE AOKI", picurl: "images/charts_pic_04.png",id: "175"}
    },

    //直播页面DJ排行榜
    voteRank:[{voteWorkNums: "93", voteWorkName: "STEVE AOKI", picurl: "images/charts_pic_04.png",id: "175"},
              {voteWorkNums: "27", voteWorkName: "BLACK COFFEE2", picurl: "images/charts_pic_03.png",id: "174"},
              {voteWorkNums: "0", voteWorkName: "JAMAL BOSS", picurl: "images/charts_pic_02.png",id: "173"},
              {voteWorkNums: "0", voteWorkName: "BLACK COFFEE", picurl: "images/charts_pic_01.png",id: "172"}
              ],

    //PC端直播页中部banner
    banner: {max_url:"images/banner_bg.png",fw_url:"http://v.qq.com/x/cover/alaf28p8xvwmk63/c0022qfy08a.html"},
    
    //头图
    header: {max_url:"images/header.png"}
    };

    //获取最新观看人数
    function getLike()
    {
        h5e.like.options.time=0;
        var likeClassId = liveArr.likeClassId; //在管理后台添加点赞对象的id
        h5e.like.init({
          actId: '641012504', //在直播管理后台添加活动的id
          classId: '14', //在管理后台添加点赞类别的id
          likeId: likeClassId,
          callback: function(data) {            
            if(data!="" && data[likeClassId] != undefined){
             $('.watch_count_text').html(data[likeClassId].nums);
             //$(".watch_count_lable").show();
             //$(".watch_count_text").show();
             $(".live").show();
            }
          },
          error: function(data) {
              //alert(budweiser.netError.message);
          }
        }); 
    }

    //观看人数加1
    function saveLike()
    {
        var likeClassId = liveArr.likeClassId;
        h5e.like.saveLike({
            actId: '641012504',
            classId: '14',
            likeId:  likeClassId,
            callback: function(res) {
              if(res.code == '0') {
                $(".watch_count_text").html(res.data.nums); 
                $(".watch_count_lable").show();
                $(".watch_count_text").show();
              } else {
                alert(res.message);
              }               
            },
            error: function(data) {
                alert(budweiser.netError.message);
            }
          });
    }

    //DJ最新投票数
    function getVotes()
    {
        h5e.vote.options.time=0;    
        var voteClassId = liveArr.voteClass.fw_other1; //ClassId
        var workId = liveArr.voteClass.fw_other2; //WorkId
        h5e.vote.init({
          actId: '641012504', //在直播管理后台添加活动的id
          classId: voteClassId, //在管理后台添加投票类别的id
          workId: workId,
          callback: function(data) {
            if(data!=""){
              liveArr.votes=data;
              setVotesView();
            }
          },
          error: function(data) {
              //alert(budweiser.netError.message);
          }
        }); 
    }

    //获取DJ最新投票数
    function saveVote(workId)
    {
        if(liveArr.votes[workId].otherurl.length>0){
            //给JD投票的贴点
            h5e.track.clickMonitor(liveArr.votes[workId].otherurl);
        }
        h5e.vote.options.time=0;    
        var voteClassId = liveArr.voteClass.fw_other1; //ClassId
        h5e.vote.saveVote({
          actId: '641012504', //在直播管理后台添加活动的id
          classId: voteClassId, //在管理后台添加投票类别的id
          workId: workId,
          callback: function(res) {
            if(res!="" && res.data && res.data.nums !=""){
                alert("投票成功！");
                //console.log("DJ的最新票数:"+res.data.nums);
               liveArr.votes[workId].voteWorkNums = res.data.nums;
               //更新DJ排行榜页面视图
               setVotesView(workId);
            }
          },
          error: function(data) {
              alert(budweiser.netError.message);
          }
        }); 
    }

    
    //设置DJ排行榜页面视图
    function setVotesView(workId)
    {
        var voteRankList = sortObjectBy(liveArr.votes,"voteWorkNums",true);
        liveArr.voteRank = voteRankList;
        //console.log(voteRankList);
        var voteRankSrc="";
        for(var i=0,max = voteRankList.length;i<max;i++)
        {
            if(voteRankList[i].id.length>0 && voteRankList[i].voteWorkName.length>0 && voteRankList[i].picurl.length>0)
            {
                if(workId && voteRankList[i].id == workId){
                    var oldSortIndex = $(".charts_con[id="+workId+"]").attr("data-slick-index");
                    if(oldSortIndex ==i){
                      //如果排行没变化则不重新加载页面
                        //console.log("排行不变");
                        $(".charts_con[id="+workId+"] span").html(voteRankList[i].voteWorkNums);
                        return false;
                    }
                }
                voteRankSrc = voteRankSrc
                +"<div class='charts_con' id='"+voteRankList[i].id+"'><div class='charts_bg'><div class='charts_border'><img src='images/charts_border.png'/></div>"
                +"<div class='charts_pic_wrap'><div class='charts_pic'><img src='"+voteRankList[i].picurl+"' alt=''/></div></div>"
                +"<div class='charts_shade'><img src='images/charts_shade.png' alt=''/>"
                +"<div class='name'>"+voteRankList[i].voteWorkName+"</div><div class='place'>"+(i+1)+"</div></div></div>"
                +"<span class='number'>"+voteRankList[i].voteWorkNums+"</span>"
                +"<p>支持数</p><div class='support_btn'><div class='support_bg'><img src='images/suport_bg.png' alt=''></div><div class='support_word'>支持TA</div></div></div>"
            }
        }

        slicker = $(".charts_carousel");
        if(slicker.hasClass('slick-initialized')) {
            slicker.slick('unslick');
          }

        $(".charts_carousel").html("");
        $(".charts_carousel").html(voteRankSrc);
        
        if(liveArr.voteRank.length>4){
            // 轮播图
            slicker = $(".charts_turns .charts_carousel").slick({
                dots: false,
                infinite: true,
                draggable: true,
                arrows: true,
                prevArrow:".charts_prev",
                nextArrow:  ".charts_next",
                slidesToShow: 4,
                slidesToScroll: 1
            });
        }else{
            $(".charts_prev").hide();
            $(".charts_next").hide();
        }


        if(workId){
            //显示点赞的那个DJ
            if(!$(".charts_con[id="+workId+"]").hasClass("slick-active")){
                slickIndex = $(".charts_con[id="+workId+"]").attr("data-slick-index");
                if(slickIndex>3){
                    slicker.slick('slickGoTo',slickIndex-3);
                }
            }
        }

        // DJ排行榜hover效果
        $(".charts_bg").hover(function () {
            $(this).find(".charts_pic").addClass("bigger");
            $(this).find(".charts_shade").stop().fadeOut(2000);
        },function () {
            $(this).find(".charts_pic").removeClass("bigger");
            $(this).find(".charts_shade").stop().fadeIn(1000);
        });

        // DJ排行榜点击效果
        $(".charts_con ").on("click",".charts_bg,.support_btn",function () {
            if(budweiser.liveStatus==2){
                alert("投票已结束");//直播结束后禁止投票
                return false;
            }
            var id = this.parentElement.getAttribute("id");
            //console.log("DJ的ID:"+id);
            saveVote(id);
        });

        $(".charts_con .support_btn").hover(function () {
            $(this).find(".support_bg img").attr("src","images/mouseover.gif");
        },function () {
            $(this).find(".support_bg img").attr("src","images/suport_bg.png");
        })
    }


    /**
     * 直播区域的视频播放器
     */
    function playLiveVideo(index){
        budweiser.playingVideoIndex=index;
        var vid=liveArr.liveBeforeVideo.video_url;
        var pic=liveArr.liveBeforeVideo.max_url;
        var type="2";
        if(budweiser.liveStatus==2){
            vid=liveArr.liveAfterVideo.video_url;
            pic=liveArr.liveAfterVideo.max_url;
        }else if(budweiser.liveStatus==1){
            type="1";
            vid=liveArr.liveVideos[index].video_url;
            pic=liveArr.liveVideos[index].max_url;
        }

        $("#player_05").html();

        liveVideoPlayer = h5e.video.init({
                modId: "player_05",
                vid: vid,
                width: "743",
                height: "418",
                autoplay: 1,
                //pic:pic,
                isHtml5ShowPosterOnEnd:true,
                isiPhoneShowPosterOnPause:true,
                flashWmode: 'opaque',
                //vodFlashSkin: "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf",
                vodFlashExtVars:{
                    clientbar: 0,
                    showend: 0,
                    searchbar: 0,
                    share : 0,
                    follow : 0,
                    bullet: 0
                },onplaying:function(){
                    //if(typeof reviewVideoPlayer != "undefined"){reviewVideoPlayer.callCBEvent("pause");};
                },onresume:function(){
                    //if(typeof reviewVideoPlayer != "undefined"){reviewVideoPlayer.callCBEvent("pause");};
                },
                adplay: 0,
                type: type
            });
    }



  //--直播前
    function liveStart(){
        $(".tab_01").hide();
        $(".tab_02").hide();
        $(".tab_03").hide();
        $(".tab_01").click();
        
        //显示倒计时
        h5e.countdown.options.time=10000; //轮询请求，等于0不轮询
        var classId = 16;//在管理后台添加倒计时类别的id
        h5e.countdown.init({
          actId: '641012504',//在直播管理后台添加活动的id
          classId: classId,
          callback: function(data) {
              if(budweiser.liveStatus ==0){
                  $(".live_before").show();
                  var liveStartTime = data[classId].time.replace(/\-/g,'/');
                  budweiser.liveStartTime = liveStartTime;
                  var liveStartTimeStr = new Date(liveStartTime).Format("M月d日h:mm");
                  $(".liveStartTime").html("距"+liveStartTimeStr+"直播开始还有");
                  // 倒计时
                  var countDownClock = setInterval(showTime, 500);
              }
          },
          error: function(data) {
            //错误处理
          }
        });

    }

    //--直播中
    function liveIng(){
        $("#player_01").html();
        $(".live_before").hide();
        $(".live").show();
        $(".tab_01").show();
        //观看人数加1
        saveLike();
        $(".video_bg_01 img").attr("src",liveArr.liveVideos[0].max_url);
        if(liveArr.liveVideos[1].fw_other1==1){
            $(".tab_02").show();
        }
        if(liveArr.liveVideos[2].fw_other1==1){
            $(".tab_03").show();
        }
        $(".tab_01").click();
        
        //每隔15S获取一次最新的评论
        //commentClock = setInterval("getNewComments()",15000);
        
        //每隔60S获取一次最新的观看人数
        likeClock = setInterval("getLike()",60000);

        //每隔60S获取一次最新的DJ排行榜
        voteClock = setInterval("getVotes()",60000);
        
        //停止倒计时
        if(typeof countDownClock != "undefined"){window.clearInterval(countDownClock);};
    }


    //--直播后
    function liveEnd(){
        $("#player_01").html();
        $(".live_before").hide();
        $(".tab_01").hide();
        $(".tab_02").hide();
        $(".tab_03").hide();
        $(".video_bg_01 img").attr("src",liveArr.liveAfterVideo.max_url);
        //获取观看人数
        getLike();
        $(".tab_01").click();

        //停止获取最新的评论
        //if(typeof commentClock != "undefined"){window.clearInterval(commentClock);};

        //停止获取最新的观看人数
        if(typeof likeClock != "undefined"){window.clearInterval(likeClock);};

        //停止获取最新的DJ排行榜
        if(typeof countDownClock != "undefined"){window.clearInterval(voteClock);};
    }

    /**
     * 获取小后台素材
     */
    budweiser.set =function(data,liveStatus)
    {
        budweiser.liveStatus = liveStatus;
        initComment();//初始化评论功能
        budweiser.data = data;
        if(data)
        {
            //头图
            if(data[7] && data[7][0] && data[7][0].max_url.length>0){
                liveArr.header = data[7][0].max_url;
                $(".header").css("background-image","url("+liveArr.header+")");
                $(".header").show();
            }
        	
        	
            //直播前视频
            if(data[0]&&data[0][0])
            {
                liveArr.liveBeforeVideo = data[0][0];
                var liveBeforeVideo = data[0][0];
                if(liveBeforeVideo.video_url.length>0 && liveBeforeVideo.max_url.length>0)
                {
                    if(liveStatus==0){
                        $(".video_bg_01 img").attr("src",liveBeforeVideo.max_url);
                    }
                }
            }
            //直播中视频
            if(data[1])
            {
                liveArr.liveVideos=data[1];
                var liveVideos = data[1];
                for(var i=0,max = liveVideos.length;i<max;i++)
                {
                    //主会场
                    if(i==0)
                    {
                        if(liveVideos[i].video_url.length>0 && liveVideos[i].max_url.length>0)
                        {
                            if(liveStatus==1){
                                $(".video_bg_01 img").attr("src",liveVideos[i].max_url);
                            }
                            $(".tab_01 p").html(liveVideos[i].fw_title);
                        }
                    }
                    //KOL1
                    if(i==1)
                    {
                        if(liveVideos[i].video_url.length>0 && liveVideos[i].max_url.length>0 && liveVideos[i].fw_other1==1)
                        {
                            $(".video_bg_02 img").attr("src",liveVideos[i].max_url);
                            $(".tab_02 p").html(liveVideos[i].fw_title);
                        }
                    }
                    //KOL2
                    if(i==2)
                    {
                        if(liveVideos[i].video_url.length>0 && liveVideos[i].max_url.length>0 && liveVideos[i].fw_other1==1)
                        {
                            $(".video_bg_03 img").attr("src",liveVideos[i].max_url);
                            $(".tab_03 p").html(liveVideos[i].fw_title);
                        }
                    }
                }
            }
            
            //直播后视频
            if(data[2]&&data[2][0])
            {
                liveArr.liveAfterVideo=data[2][0];
                var liveAfterVideo = data[2][0];
                if(liveAfterVideo.video_url.length>0&&liveAfterVideo.max_url.length>0)
                {
                    if(liveStatus==2){
                        $(".video_bg_01 img").attr("src",liveAfterVideo.max_url);
                    }
                }
            }
            
            //直播观看人数likeId  
            if(data[4] && data[4][0] && data[4][0].fw_other1.length>0){
                liveArr.likeClassId = data[4][0].fw_other1;
            }

            if(liveStatus == 0) {
                liveStart();//直播前
            } else if(liveStatus == 1) {
                liveIng();//直播中
            }else if(liveStatus == 2) {
                liveEnd();//直播后
            }
        };
    }
    
    //设置素材延后加载
    budweiser.setResource = function() {
    	if(budweiser.data){
    		var data = budweiser.data;
    		
            //直播页面DJ排行榜投票策略
            if(data[5] && data[5][0]){
                liveArr.voteClass = data[5][0];
                getVotes();
            }

            //往期回顾
            if(data[3])
            {
                var lookback = data[3];
                liveArr.lookback = lookback;
                
                var lookbackSrc="";
                var count = 0;
                for(var i=0,max = lookback.length;i<max;i++)
                {
                    if(lookback[i].fw_title.length>0 && lookback[i].max_url.length>0)
                    {
                        count++;
                        lookbackSrc = lookbackSrc
                        +"<a class='lookback_link' index="+i+" href='javascript:;'>"
                        +"<div class='lookback_pic'><img src='"+lookback[i].max_url+"' alt=''/></div>"
                        +"<div class='lookback_shade'><img src='images/report_shade.png' alt=''/></div>"
                        +"<p class='lookback_word'>"+lookback[i].fw_title+"</p>"
                        +"<div class='lookback_play'><img src='images/play_btn.png' alt=''/></div></a>";
 
                    }
                }
                $(".lookback_links").html("");
                $(".lookback_links").html(lookbackSrc);
                $(".lookback_link").on("click",function(){
                    var index = $(this).attr("index");
                    if(lookback[index].fw_other3.length>0){
                        //贴点:往期回顾-PC
                        h5e.track.clickMonitor(lookback[index].fw_other3);
                    };
                    if(lookback[index].fw_url.length>0){
                        //外链
                        window.open(lookback[index].fw_url);
                    };
                });

                if(count>4){
                    // 往期回顾轮播图
                    $(".lookback_content .lookback_links").slick({
                        dots: false,
                        infinite: true,
                        draggable: true,
                        arrows: true,
                        prevArrow:".lookback_prev",
                        nextArrow:  ".lookback_next",
                        slidesToShow: 4,
                        slidesToScroll: 1
                    });
                }else{
                    $(".lookback_prev").hide();
                    $(".lookback_next").hide();
                }

                // 往期回顾hover效果
                $(".lookback_link").hover(function () {
                    $(this).find(".lookback_pic").addClass("bigger");
                    $(this).find(".lookback_play img").attr("src","images/play_active.gif");
                },function () {
                    $(this).find(".lookback_pic").removeClass("bigger");
                    $(this).find(".lookback_play img").attr("src","images/play_btn.png");
                });
                
            }
            
            //PC端直播页中部banner
            if(data[6] && data[6][0] && data[6][0].max_url.length>0){
                liveArr.banner = data[6][0].max_url;
                $(".banner_bg img").attr("src",data[6][0].max_url);
                if(data[6][0].fw_url.length>0){
                    $(".banner_pic").attr("href",data[6][0].fw_url);
                    $(".banner_pic").attr("target","_blank");
                }else{
                    $(".banner_pic").css("cursor","default");
                }
            }
    	}
    };
    
    
    

    /**
     * 直播状态切换之后更新页面
     * @param liveStatus 直播状态
     */
    budweiser.update = function(liveStatus) {
      budweiser.liveStatus = liveStatus;
      initComment();//初始化评论功能
      if(liveStatus == 1) {
          liveIng();//直播中
      } else if(liveStatus == 2) {
          liveEnd();//直播后
      }
    };
    
    
    /**
     * 保存发表的评论到数据库
     * 
     * @param callback 回调函数
     */
    budweiser.saveComment = function(comment,callback)
    {
        if(typeof (callback) == 'function')
        {
            var url = '/budweiser/comment';
            if (0 === (window.location.host).indexOf('sh.act')) 
            {
                url = '/641012504' + url;
            }
            $.ajax({
                url:url,
                type:'POST',
                dataType:'json',
                data:{comment:comment,g_tk:getGtk()},
                cache:false,
                success:function(response)
                {
                    callback(response);
                },
                error:function(){
                    callback(budweiser.netError);
                }
            });
        }else{
            callback(budweiser.netError);
        }
    };
 


    /**
     *  获取最新30条评论
     * */
    budweiser.getTop = function(callback)
    {
        if(typeof (callback) == 'function')
        {
            var url = '/budweiser/getTop';
            if (0 === (window.location.host).indexOf('sh.act')) 
            {
                url = '/641012504' + url;
            }
            $.ajax({
                url:url,
                type:'POST',
                dataType:'json',
                data:{g_tk:getGtk()},
                cache:false,
                success:function(resp)
                {
                    callback(resp);
                },
                error:function(){
                    //callback(budweiser.netError);
                }
            });
        }else{
            callback(budweiser.netError);
        }
    }
    
    
 // 对Date的扩展，将 Date 转化为指定格式的String
 // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
 // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
 // 例子： 
 // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
 // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
 Date.prototype.Format = function (fmt) { //author: meizz 
     var o = {
         "M+": this.getMonth() + 1, //月份 
         "d+": this.getDate(), //日 
         "h+": this.getHours(), //小时 
         "m+": this.getMinutes(), //分 
         "s+": this.getSeconds(), //秒 
         "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
         "S": this.getMilliseconds() //毫秒 
     };
     if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
     for (var k in o)
     if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
     return fmt;
 }