(function($){
	//动态加载animate
	var loadStyles = function(url) {
		var hasSameStyle = false;
		var links = $('link');
		for(var i = 0;i<links.length;i++){
			if(links.eq(i).attr('href') == url){
				hasSameStyle = true;
				return
			}
		}

		if(!hasSameStyle){
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = url;
			document.getElementsByTagName("head")[0].appendChild(link);
		}
    }

    loadStyles('http://www.daiwei.org/global/css/animate.css');

	//显示浮层
    var showMask = function(options) {
    	var _this = this;
    	var defaultvalue = {
    		ele: 					'document.body', 			//默认显示在body下面
    		stopPropagation: 		'', 						//关闭那些事件冒泡   数组
    		preventDefault: 		'', 						//关闭哪些默认事件   数组
    		background: 			'rgba(0,0,0,0.6)',			//背景色
    		zIndex: 				'1000',						//层级
    		animateStyle: 			'fadeIn',		//进入动画
    		clickClose: 			true, 						//是否可以点击关闭
    		duration: 				500, 						//动画的过渡时间
    		closeAnimate:function(){}, 							//关闭浮层 的回调   也可以写其他元素的关闭动画 
    	};

    	var showMaskEle = '';

    	var opt = $.extend(defaultvalue , options || {});


    	defaultvalue._init = function(){
    		//存在有mask则不会再调用mask
    		if ($('.cpt-dw-dialog-mask').length) {return}

    		showMaskEle = $('<div class="cpt-dw-dialog-mask animated '+opt.animateStyle+'"></div>').css({
    			background:opt.background,
    			'z-index':opt.zIndex,
    			'webkit-transition':'all '+opt.duration/1000+'s',
				'-moz-transition':'all '+opt.duration/1000+'s',
				transition:'all '+opt.duration/1000+'s',
				'-webkit-animation-duration':opt.duration/1000+'s',
    			'-moz-animation-duration':opt.duration/1000+'s',
    			'animation-duration':opt.duration/1000+'s',
    		}).appendTo(opt.ele);
    		defaultvalue._showScroll(false);
    		defaultvalue._event();
    	};

    	defaultvalue._showScroll = function(isShow){
    		var isshow = isshow || 'false';
    		if(isShow){
    			$('body,html').css({"min-height":0,overflow:'auto'});

    			$(document.body).css({
    				'border-right':'none',
    			})
    		}else{
    			var scrollWidth = defaultvalue._getScrollWidth();
    			$('body,html').css({"min-height":"100%",overflow:'hidden'});
    			$('body').css({
    				'border-right':scrollWidth+'px solid transparent',
    			})
    		}
    	};

    	defaultvalue._getScrollWidth = function(){
		    var noScroll, scroll, oDiv = document.createElement('div');
		    oDiv.style.cssText = 'position:absolute; top:-1000px;     width:100px; height:100px; overflow:hidden;';
		    noScroll = document.body.appendChild(oDiv).clientWidth;
		    oDiv.style.overflowY = 'scroll';
		    scroll = oDiv.clientWidth;
		    document.body.removeChild(oDiv);
		    return noScroll-scroll;   
    	}

    	defaultvalue._removeMask = function(){
            if(!isLowerIe9()){
                showMaskEle.addClass("fadeOut").on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
        			showMaskEle.remove();
        		});
            }else{
                showMaskEle.remove();
            }

            opt.closeAnimate();
    	};

    	defaultvalue._event = function(){
    		showMaskEle.on('click',function(){
    			//判断是否存在关闭mask的点击事件
                if(opt.clickClose && !(opt.preventDefault.indexOf('click') > -1)){
    				defaultvalue._showScroll(true);
                    defaultvalue._removeMask();
                }
    		});

    		showMaskEle.on(opt.stopPropagation,function(event){
    			event.stopPropagation();
    		});

    		showMaskEle.on(opt.preventDefault,function(event){
    			event.preventDefault();
    		});
    	};

    	defaultvalue._init();
    };

    var isIE = function(callBack) {
        var isIE = false;
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
           isIE = true;
        }
        else{
           isIE = false;
        }

        if(typeof(callBack) === 'function'){
            callBack(isIE);
        }else{
          return isIE;
        }
    };

    var isLowerIe9 = function(){
        return (!window.FormData);
    };

	$.fn.dailog = function(options,callBack){
	    var _this = this;
	    var $this = $(this);
	    var defaultDailog = {
	      width:              280,                    	  //宽度
	      height:             'auto',                     //高度
	      padding:            '10px 16px',                //padding
	      title:              '提示!',                    //提醒信息
	      discription:        '这是弹窗的描述!',          //描述
	      borderRadius:       '4px',                      //圆角
	      bottons:            ['确定','取消'],            //按钮信息
	      maskBg:             'rgba(0,0,0,0.6)',          //遮罩层背景色
	      dailogBg:           '#fff',                     //弹出框的背景色
	      type:               'defalut',                  //类型 defalut primary   success  danger  warning
	      zIndex:             10000011,                   //层级
	      hideScroll: 	  	  false, 					  //是否关闭滚动条
	      isBtnHasBgColor: 	  true, 					  //确定  取消按钮是否有背景色
	      showBoxShadow: 	  false, 					  //弹窗是否显示boxshadow
	      animateStyle: 	  'fadeInNoTransform',	   	  //进入的效果
	      animateIn: 		  'fadeIn', 				  //进入的效果
	      animateOut: 		  'fadeOut', 				  //离开的效果
	      isInput: 			  false, 					  //是否显示输入框
	      inputPlaceholder:   '填写相关内容', 			  //文本输入提示框
	      duration:    		  300,						  //动画持续的时间
	    };

	    var opt = $.extend(defaultDailog,options||{});

	    // 设置btn是否有颜色
	    var btn_className = opt.isBtnHasBgColor?'':'no_bg';

	    // 点击的索引
	    var btnIndex = '';

	    if($('.cpt-dw-dialog-mask').length){
	      return;
	    };

	    var _isScroll = function(){
	    	if(opt.hideScroll){
	    		$('body,html').css({
		    		overflow:'hidden',
		    	});
	    	}
	    }

	    var _colseScroll = function(){
	    	$('body,html').css({
	    		overflow:'auto',
	    	});
	    }

	    var _overflowBtn = function(){
	    	// bottons超过两个提示
		    if(opt.bottons.length>2){
		       $dw.showMessage('按钮的最多显示上限不超过2个',3000,false);
		    }
	    }

	    var _isBoxShadow = function(){
	    	// 是否显示boxshadow
		    if(!opt.showBoxShadow){
		    	_this.dailog_div.addClass('no_boxShadow');
		    };
	    }

	    var _btnIndex = function(name){
	    	//获取点击的索引
	      	var btnName = name || '';
	      		for(var i = 0;i<opt.bottons.length;i++){
	        		if(btnName === opt.bottons[i]){
	          		btnIndex = i;
	        	}
	      	}
	    }

	    //非ie浏览器的初始化
	    var _init = function(){

		    showMask({
		    	ele:$this,
		    	stopPropagation:'aaa',
		    	preventDefault:'click',
		    	background:opt.maskBg,
		    	duration:opt.duration,
                zIndex:opt.zIndex - 1, 
                closeAnimate: function(){
	    			_this.dailog_div.addClass(opt.animateOut).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
		    			_this.dailog_div.remove();
		    		});
	    		},
	    	});

	    	_isScroll();
		    // 判断按钮是否超出两个
		    _overflowBtn();

		     _this.dailog_div = $("<div class='div_dailog animated "+opt.type+" "+opt.animateIn+"'></div>").css({
		     	// 'visibility':'hidden',
				'width':opt.width,
				'height':opt.height,
				'background':opt.dailogBg,
				'-moz-border-radius':opt.borderRadius,
				'-webkit-border-radius':opt.borderRadius,
				'border-radius':opt.borderRadius,
				'padding':opt.padding,
				'z-index':opt.zIndex,
				'-webkit-animation-duration':opt.duration/1000+'s',
    			'-moz-animation-duration':opt.duration/1000+'s',
    			'animation-duration':opt.duration/1000+'s',
				'-webkit-transform':'translate(-50%,-50%)',
				'-moz-transform':'translate(-50%,-50%)',
				'transform':'translate(-50%,-50%)',
		    }).appendTo($this);

		    _this.title_dailog = $("<div class='title_dailog'></div>").html(opt.title).appendTo(_this.dailog_div);

		    if(!opt.isInput){
		    	_this.discription_dailog = $("<div class='discription_dailog'></div>").html(opt.discription).appendTo(_this.dailog_div);
		    }else{
		    	_this.discription_dailog = $("<div class='discription_dailog'></div>").css({
		    		'text-indent':0,
		    	}).appendTo(_this.dailog_div);
		    	_this.input_dailog = $("<input type='text' class='dailog_input' placeholder="+opt.inputPlaceholder+">").appendTo(_this.discription_dailog);
		    }
		    
		    _this.dailog_divOperation = $("<div class='dailog_divOperation'></div>").appendTo(_this.dailog_div);

		    if(!(opt.bottons.length === 2)){
		     	_this.firstBtn = $("<span class='btn_span "+btn_className+"'></span>").html(opt.bottons[0]).attr({'data-name':opt.bottons[0]}).appendTo(_this.dailog_divOperation);
		    }else{
		     	_this.firstBtn = $("<span class='btn_span "+btn_className+"'></span>").html(opt.bottons[0]).attr({'data-name':opt.bottons[0]}).appendTo(_this.dailog_divOperation);
		     	_this.secondBtn = $("<span class='btn_span "+btn_className+"'></span>").html(opt.bottons[1]).attr({'data-name':opt.bottons[1]}).appendTo(_this.dailog_divOperation);
		    }

		 //    setTimeout(function(){
			// 	_this.dailog_div.css({
			// 		'visibility':'visible'
			// 	}).addClass("animated "+opt.animateIn+"");
			// },100);

		    //是否显示boxshadow
		    _isBoxShadow();
	    }

	    //ie浏览器的初始化
	    var _initIE = function(){

		    showMask({
		    	ele:$this,
		    	stopPropagation:'aaa',
		    	preventDefault:'click',
		    	background:opt.maskBg,
                zIndex:opt.zIndex - 1, 
	    	});

	    	_isScroll();
		    // 判断按钮是否超出两个
		    _overflowBtn();

		     _this.dailog_div = $("<div class='div_dailog "+opt.type+" '></div>").css({
		     	'visibility':'hidden',
				'width':opt.width,
				'height':opt.height,
				'background':opt.dailogBg,
				'-moz-border-radius':opt.borderRadius,
				'-webkit-border-radius':opt.borderRadius,
				'border-radius':opt.borderRadius,
				'padding':opt.padding,
				'z-index':opt.zIndex,
				'-webkit-animation-duration':opt.duration/1000+'s',
    			'-moz-animation-duration':opt.duration/1000+'s',
    			'animation-duration':opt.duration/1000+'s',
				'-webkit-transform':'translate(-50%,-50%)',
				'-moz-transform':'translate(-50%,-50%)',
				'transform':'translate(-50%,-50%)',
		    }).appendTo($this);

		    _this.title_dailog = $("<div class='title_dailog'></div>").html(opt.title).appendTo(_this.dailog_div);

		    if(!opt.isInput){
		    	_this.discription_dailog = $("<div class='discription_dailog'></div>").html(opt.discription).appendTo(_this.dailog_div);
		    }else{
		    	_this.discription_dailog = $("<div class='discription_dailog'></div>").css({
		    		'text-indent':0,
		    	}).appendTo(_this.dailog_div);
		    	_this.input_dailog = $("<input type='text' class='dailog_input' placeholder="+opt.inputPlaceholder+">").appendTo(_this.discription_dailog);
		    }
		    
		    _this.dailog_divOperation = $("<div class='dailog_divOperation'></div>").appendTo(_this.dailog_div);

		    if(!(opt.bottons.length === 2)){
		     	_this.firstBtn = $("<span class='btn_span "+btn_className+"'></span>").html(opt.bottons[0]).attr({'data-name':opt.bottons[0]}).appendTo(_this.dailog_divOperation);
		    }else{
		     	_this.firstBtn = $("<span class='btn_span "+btn_className+"'></span>").html(opt.bottons[0]).attr({'data-name':opt.bottons[0]}).appendTo(_this.dailog_divOperation);
		     	_this.secondBtn = $("<span class='btn_span "+btn_className+"'></span>").html(opt.bottons[1]).attr({'data-name':opt.bottons[1]}).appendTo(_this.dailog_divOperation);
		    }

		    setTimeout(function(){
				_this.dailog_div.css({
					'visibility':'visible'
				}).addClass("animated "+opt.animateIn+"");
			},100);

		    //是否显示boxshadow
		    _isBoxShadow();
	    }

	    if(isIE()){
	    	_initIE();
	    }else{
	    	_init();
	    }

	    // 点击的回调
	    _this.dailog_divOperation.children().on('click',function(e){
	      	var name = $(this).attr('data-name');
			//获取点击的索引
			// _this.bottonIndex(name);
			_btnIndex(name);

			var inputstatus = _this.input_dailog? 1:0;
			var inputvalue = inputstatus? _this.input_dailog.val():'';

			// 设置返回值
			var ret = {
				index:btnIndex,
				input:{
					status:inputstatus,
					value:inputvalue,
				}
			};

			_colseScroll();

			//未写回调函数则不会有效果
			if(typeof(callBack) === 'function'){
				//执行回调函数
				callBack(ret);
			}


			if(!isLowerIe9()){
                _this.dailog_div.addClass(opt.animateOut).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
                    _this.dailog_div.remove();
                });

                $('.cpt-dw-dialog-mask').addClass("fadeOut").on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
                    $('.cpt-dw-dialog-mask').remove();

                    //可滚动
                    $('body,html').css({"min-height":0,overflow:'auto'});
                    $(document.body).css({
                        'border-right':'none',
                    })
                });
            }else{
                _this.dailog_div.remove();
                $('.cpt-dw-dialog-mask').remove();
                //可滚动
                $('body,html').css({"min-height":0,overflow:'auto'});
                $(document.body).css({
                    'border-right':'none',
                });isLowerIe9 
            }
	    });

	    return _this;
	};

})(jQuery);