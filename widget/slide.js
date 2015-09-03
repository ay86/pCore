/**
 * Slide for pCore UI widget
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 12-8-30
 */

PCORE.ui.slide = PCORE.make(PCORE.ui, {
	isAutoPlay:false,
	type:'y',
	action:'click',
	time:5000,
	length:0,
	currentIndex:0,
	css:'focus',
	timer:null,
	target:null,
	itemer:null,
	Init:function () {
		var _this = this;
		if (!_this.target) {
			return false;
		}
		_this.uiDOM = _this.target.parentNode;
		//添加列表项
		var oUl = _this.itemer = document.createElement('ul');
		oUl.className = _this.css + '-item';
		var _main_li = _this.target.getElementsByTagName('li');
		_this.length = _main_li.length;
		var i;
		for (i = 0; i < _main_li.length; i++) {
			oUl.innerHTML += '<li></li>';
		}
		_this.uiDOM.appendChild(oUl);

		//对列表项绑定事件，触发事件类型由action指定
		var _item_li = oUl.getElementsByTagName('li');
		for (i = 0; i < _item_li.length; i++) {
			//TODO use jquery
			_item_li[i].setAttribute('itemIndex', i);
			$(_item_li[i]).bind(_this.action, function () {
				clearInterval(_this.timer);
				_this.currentIndex = $(this).attr('itemIndex');
				_this.select();
				_this.isAutoPlay && _this.autoPlay();
			});
		}
		_this.fire('INIT_OK', _this);
		//如果有自动播放则自动播放，须放在INIT_OK后面，因为有可能在播放前一些操作存在于INIT_OK的回调
		if (_this.isAutoPlay) {
			_this.autoPlay();
			//当鼠标停留时，停止自动播放，移出时重新自动播放
			$(_this.target).mouseenter(function () {
				clearInterval(_this.timer);
			});
			$(_this.target).mouseleave(function () {
				_this.autoPlay();
			});
			$(_this.itemer).mouseenter(function () {
				clearInterval(_this.timer);
			});
			$(_this.itemer).mouseleave(function () {
				_this.autoPlay();
			});
		}
	},
	//自动播放，时间有time指定
	autoPlay:function () {
		var _this = this;
		_this.timer && clearInterval(_this.timer);
		_this.timer = setInterval(function () {
			_this.currentIndex += 1;
			if (_this.currentIndex >= _this.length) {
				_this.currentIndex = 0;
			}
			_this.select();
		}, _this.time);
	},
	//选择某项，由currentIndex指定
	select:function () {
		var _this = this;
		var nCurrent = _this.currentIndex;
		switch (_this.type.toUpperCase()) {
			//向上滚动
			case 'Y':
				$(_this.target).animate({
					scrollTop:nCurrent * $(_this.target).height()
				});
				break;
			//向左滚动
			case 'X':
				$(_this.uiDOM).css('overflow', 'hidden');
				$(_this.target).animate({
					marginLeft:-nCurrent * $(_this.target).children('li').eq(0).width()
				});
				break;
			//淡入
			case 'FADE':
				var _main_li = $(_this.target).children('li');
				_main_li.hide();
				_main_li.eq(nCurrent).fadeIn();
				break;
		}
		//去除现有项的当前状态，并将选择项的状态更改为当前状态
		$(_this.itemer).find('.current').removeClass('current');
		$(_this.itemer).children('li').eq(nCurrent).addClass('current');
	}
});