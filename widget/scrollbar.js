/**
 * scrollbar for pCore UI widget
 * @Author: AngusYoung
 * @Version: 1.6
 * @Update: 12-8-27
 */

PCORE.ui.scrollbar = PCORE.make(PCORE.ui, {
	css:'ui-scrollbar',
	target:null, //对其添加滚动条
	berth:false, //基于body位置停靠在原对象旁边
	direction:'Y', //滚动条的方向
	smooth:true, //点击主体触发滚动时滑动效果的开关
	Init:function () {
		var _this = this;
		_this.el = $('<div><div></div></div>');
		_this.uiDOM = _this.el[0];
		_this.el.addClass(_this.css + ' ' + _this.direction);
		_this.bar = _this.el.children('div');
		if (
				(_this.target.innerWidth() >= _this.target[0].scrollWidth && _this.direction == 'X')
						||
						(_this.target.innerHeight() >= _this.target[0].scrollHeight && _this.direction == 'Y')
				) {
			_this.clear();
			return;
		}
		_this.draw();
	},
	releaseEvent:function () {
		//释放事件
		this.el && this.el.unbind();
		this.target && this.target.unbind('DOMMouseScroll');
		this.bar && this.bar.unbind();
	},
	clear:function () {
		this.releaseEvent();
		this.bar && this.bar.stop(true);
		this.el && this.el.remove();
		for (var v in this) {
			if (v != 'events') {
				//console.log(v,' = ',this[v]);
				delete this[v];
			}
		}
	},
	draw:function () {
		var _this = this;
		var bar = _this.bar;
		_this.releaseEvent();
		if (_this.berth) {
			//使用挂靠的方式，scrollbar与target不属于同一个父级
			$(document.body).append(_this.el);
			_this.target.css({
				'overflow':'hidden',
				'width':_this.target.width(),
				'height':_this.target.height()
			});
			if (_this.direction == 'X') {
				_this.el.css({
					'left':_this.target[0].getBoundingClientRect().left,
					'top':_this.target[0].getBoundingClientRect().bottom,
					'right':'auto',
					'bottom':'auto',
					'width':_this.target.innerWidth()
				});
			}
			else {
				_this.el.css({
					'left':(_this.target[0].getBoundingClientRect().right - _this.el.outerWidth()),
					'top':_this.target[0].getBoundingClientRect().top,
					'right':'auto',
					'bottom':'auto',
					'height':_this.target.innerHeight()
				});
			}
		}
		else {
			//归属方式，scrollbar与target共属同一个父级
			_this.target.after(_this.el);
			_this.target.css({
				'overflow':'hidden',
				'width':_this.target.parent().width(),
				'height':_this.target.parent().height()
			});
		}
		_this.target.scrollTop(0);
		_this.target.scrollLeft(0);
		bar.css({'top':0, 'left':0});
		//根据轴向计算滚动条的长度位置
		var nPercent;
		if (_this.direction == 'X') {
			nPercent = _this.target.innerWidth() / _this.target[0].scrollWidth;
			var nWidth = Math.round(_this.el.width() * nPercent);
			bar.css('width', nWidth);
			//因为要设定nWidth为bar的实际占用宽度，但bar对象可能存在border等影响宽度的样式，所以下面做一个误差调整
			bar.css('width', bar.width() + (nWidth - bar.outerWidth()));
			!_this.berth && _this.target.css('height', _this.target.height() - _this.el.outerHeight());
		}
		else {
			nPercent = _this.target.innerHeight() / _this.target[0].scrollHeight;
			var nHeight = Math.round(_this.el.height() * nPercent);
			bar.css('height', nHeight);
			//因为要设定nHeight为bar的实际占用高度，但bar对象可能存在border等影响高度的样式，所以下面做一个误差调整
			bar.css('height', bar.height() + (nHeight - bar.outerHeight()));
			!_this.berth && _this.target.css('width', _this.target.width() - _this.el.outerWidth());
		}
		//添加点击主体滚动事件
		_this.el.click(function (event) {
			var X = event.clientX, Y = event.clientY;
			var x = bar[0].getBoundingClientRect().left;
			var y = bar[0].getBoundingClientRect().top;
			var nStep;
			var stopAni = function (d) {
				if (!_this.barScroll(d, (d == 'X' ? [0, null] : [null, 0]))) {
					bar.stop(true);
					//TODO 暂时只能用setTimeout做一个缓时，JQ的stop似乎不是实时停止
					setTimeout(function () {
						_this.barScroll(d, (d == 'X' ? [0, null] : [null, 0]));
					}, 1);
				}
			};
			if (this.direction == 'X') {
				nStep = 0 - (bar.outerWidth() * 0.8);    //每次滚动的距离，必须指定负数，正方向则取绝对值
				var toRight = !!(x + bar.outerWidth() < X);
				if (_this.smooth) {
					bar.animate({
						'left':bar.position().left + (toRight ? Math.abs(nStep) : nStep)
					}, {
						duration:'slow',
						step:stopAni
					});
				}
				else {
					_this.barScroll('X', [(toRight ? Math.abs(nStep) : nStep), null]);
				}
			}
			else {
				nStep = 0 - (bar.outerHeight() * 0.8);    //每次滚动的距离，必须指定负数，正方向则取绝对值
				var toDown = !!(y + bar.outerHeight() < Y);
				if (_this.smooth) {
					bar.animate({
						'top':bar.position().top + (toDown ? Math.abs(nStep) : nStep)
					}, {
						duration:'slow',
						step:stopAni
					});
				}
				else {
					_this.barScroll('Y', [null, (toDown ? Math.abs(nStep) : nStep)]);
				}
			}
			event.stopPropagation();
		});
		//添加鼠标竖向滚动事件
		function _fGoWheel(nDetail) {
			var nStep = -bar.outerHeight() * 0.08;    //每次滚动的距离，必须指定负数，正方向则取绝对值
			nDetail < 0 && (nStep = Math.abs(nStep));
			return _this.barScroll('Y', [null, nStep]);
		}

		function _addEvent(e, t, f, c) {
			if (e.attachEvent) {
				e.attachEvent('on' + t, function () {
					f.call(e, window.event);
				});
			}
			else if (e.addEventListener) {
				e.addEventListener(t, f, c);
			}
			else {
				e['on' + t] = f;
			}
		}

		//添加鼠标滚轮事件
		var sMouseWheel = 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		_addEvent(_this.target[0], sMouseWheel, function (event) {
			var nDetail = event.wheelDelta || (sMouseWheel === 'DOMMouseScroll' ? -event.detail : event.detail)
			if (_fGoWheel(nDetail)) {
				//如果存在可滚动动作，则阻止整个页面的滚动动作
				if (window.event) {
					event.returnValue = false;
				}
				else {
					event.preventDefault();
				}
			}
		});
		//添加拖动事件
		bar.bind('mousedown', function (event) {
			var X = event.clientX;
			var Y = event.clientY;
			var D = document.documentElement;
			D.onselectstart = function () {
				return false;
			};
			D.ondragstart = function () {
				return false;
			};
			//添加鼠标拖动全局事件
			$(D).bind('mousemove', function (event) {
				if (document.selection) {//IE ,Opera
					if (document.selection.empty)
						document.selection.empty();//IE
					else
						document.selection = null;//Opera
				}
				else if (window.getSelection) {
					window.getSelection().removeAllRanges();//FF
				}
				var x = event.clientX;
				var y = event.clientY;
				if (_this.barScroll(_this.direction, [x - X, y - Y])) {
					X = x;
					Y = y;
				}
			});
			//松开鼠标后释放拖动全局事件
			$(D).bind('mouseup', function () {
				$(this).unbind('mousemove mouseup');
				bar.removeClass('down');
			});
			bar.addClass('down');
		});
		bar.click(function (event) {
			event.stopPropagation();
		});
	},
	//根据步长进行滚动
	barScroll:function (d, vals) {
		var bar = this.el.children('div');
		var bReturn;
		var _n;
		var nEnd;
		if (d == 'X') {
			_n = bar.position().left + vals[0];
			if (_n < 0) {
				bar.css('left', 0);
			}
			else if (_n + bar.outerWidth() <= this.el.width()) {
				bar.css('left', _n);
				bReturn = true;
			}
			else {
				nEnd = this.el.width() - bar.outerWidth();
				bar.css('left', nEnd);
			}
		}
		else {
			_n = bar.position().top + vals[1];
			if (_n < 0) {
				bar.css('top', 0);
			}
			else if (_n + bar.outerHeight() <= this.el.height()) {
				bar.css('top', _n);
				bReturn = true;
			}
			else {
				nEnd = this.el.height() - bar.outerHeight();
				bar.css('top', nEnd);
			}
		}
		this.SyncContScroll();
		return bReturn;
	},
	//同步内容区块的滚动
	SyncContScroll:function () {
		var _bar = this.el.children('div');
		var _xPercent = _bar.position().left / this.el.width();
		var _yPercent = _bar.position().top / this.el.height();
		this.target.scrollLeft(parseInt(this.target[0].scrollWidth * _xPercent, 10));
		this.target.scrollTop(parseInt(this.target[0].scrollHeight * _yPercent, 10));
	}
});