/**
 * Tips for pCore UI widget
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 13-01-01
 */

PCORE.ui.tips = PCORE.make(PCORE.ui, {
	css:'ui-tips',
	arrowIs:'X',
	hasClose:false,
	hasFade:true,
	isInversion:false,
	src:null,
	srcEvent:'mouseenter',
	target:null,
	getTarget:null,
	timer:null,
	delay:0,
	offsetX:0,
	offsetY:0,
	width:400,
	Init:function () {
		var _this = this;
		if ($(_this.src).length) {
			//创建代码片断，并添加tips主体div
			var oFrag = document.createDocumentFragment();
			var oTips = _this.uiDOM = document.createElement('div');
			oTips.className = _this.css;
			oFrag.appendChild(oTips);

			//添加tips主内容区
			var oMain = _this.main = document.createElement('div');
			oMain.className = 'tips-main';
			oMain.style.width = _this.width + 'px';
			oTips.appendChild(oMain);

			//添加箭头
			var oArrow = _this.arrow = document.createElement('div');
			oArrow.className = 'tips-arrow';
			oTips.appendChild(oArrow);

			//判断是否添加关闭按钮
			if (_this.hasClose) {
				var oClose = _this.closer = document.createElement('a');
				oClose.className = 'tips-close';
				oTips.appendChild(oClose);
				oClose.onclick = function () {
					_this.hide();
				};
			}

			document.body.appendChild(oFrag);
			//绑定触发事件
			_this.addEvent();
			//点击页面其它地方时，隐藏tips层
			$(document).click(function (event) {
				_this.hide();
			});
			_this.fire('INIT_OK', _this);
		}
	},
	//更新主体内容，可以是HTML或者直接DOM元素
	update:function (xArgument) {
		PCORE.debug('update content:', xArgument);
		$(this.main).empty().append(xArgument);
	},
	//绑定触发事件
	addEvent:function () {
		var _this = this;
		_this.removeEvent();
		$(_this.src).bind(_this.srcEvent, function () {
			_this.src = this;
			_this.show();
		});
		$(this.uiDOM).unbind();
		//如果为鼠标移进移出触发，此处进行特殊处理
		if (_this.srcEvent === 'mouseenter') {
			$(_this.src).unbind('mouseleave').bind('mouseleave', function () {
				_this.timer && clearTimeout(_this.timer);
				_this.timer = setTimeout(function () {
					_this.hide();
				}, 150);
			});
			//当移进tips区域时，停止src对象触发的隐藏tips动作
			$(_this.uiDOM).mouseenter(function () {
				_this.timer && clearTimeout(_this.timer);
			});
			//当从tips区域移出时，直接隐藏tips层
			$(_this.uiDOM).mouseleave(function () {
				_this.hide();
			});
		}
		//防止tips层的点击冒泡
		$(_this.uiDOM).click(function (event) {
			event.stopPropagation();
		});
	},
	//移除绑定的触发事件
	removeEvent:function () {
		$(this.src).unbind(this.srcEvent);
	},
	//显示
	show:function () {
		var _this = this;
		//如果tipsbox已经有内容，先将旧内容释放
		if (_this.showState) {
			_this.release();
		}
		$(_this.uiDOM).stop(true, true);
		if (typeof _this.target === 'string') {
			_this.content = $(_this.src).siblings(_this.target).eq(0);
		}
		else {
			_this.content = _this.target;
		}
		PCORE.debug('content is', _this.content);
		if (!_this.content.length) {
			if (typeof _this.getTarget === 'function') {
				_this.getTarget.apply(_this);
			}
		}
		else {
			_this.timer = setTimeout(function () {
				//强制target显示
				_this.content.addClass('ui-show');
				//记录target的原父级
				_this.targetParent = _this.content.parent();
				//将target加入tipsbox中
				_this.update(_this.content);
				_this.position();
				if (_this.hasFade) {
					$(_this.uiDOM).stop(false, true).fadeIn();
				}
				else {
					$(_this.uiDOM).show();
				}
				//标记tips显隐状态
				_this.showState = true;
				PCORE.debug('tips is show.');
				_this.fire('SHOW', _this);
			}, _this.delay);
		}
	},
	//隐藏
	hide:function () {
		var _this = this;
		if (_this.showState) {
			//_this.timer && clearTimeout(_this.timer);
			if (_this.hasFade) {
				$(_this.uiDOM).fadeOut(_this.delay, function () {
					_this.release();
				});
			}
			else {
				_this.release();
			}
			PCORE.debug('hide tips.');
			_this.fire('HIDE', this);
		}
	},
	//释放主体内容
	release:function () {
		var _this = this;
		$(_this.uiDOM).hide();
		if (_this.content) {
			//将主体内容恢复到其原父级对象里
			_this.content.removeClass('ui-show');
			_this.targetParent.append(_this.content);
		}
		else {
			_this.main.innerHTML = '';
		}
		//标记tips显隐状态
		delete _this.content;
		delete _this.targetParent;
		_this.showState = false;
		PCORE.debug('release content to back.');
		_this.fire('RELEASE', _this);
	},
	position:function () {
		var _this = this;
		var $Src = $(_this.src);
		var D = document.documentElement;
		var jPosition;
		if (_this.arrowIs.toLocaleUpperCase() === 'X') {
			jPosition = {
				top:$Src.offset().top + _this.offsetY,
				left:$Src.offset().left + $Src.width() + 15 + _this.offsetX,
				addCss:['arrow-left', 'arrow-right'],
				dispose:function () {
					//宽度超出屏幕范围时保持在最右对齐
					if (_this.uiDOM.offsetLeft + _this.uiDOM.offsetWidth > D.clientWidth) {
						_this.uiDOM.style.left = D.clientWidth - _this.uiDOM.offsetWidth - 5 + 'px';
					}
					//如果保持在最右对齐时最左位置小于src对象位置，则反转箭头，并将tips层显示在左边
					if (_this.uiDOM.offsetLeft < $Src.offset().left) {
						$(_this.arrow).removeClass('arrow-left arrow-right arrow-top arrow-bottom').addClass(jPosition.addCss[1]);
						_this.uiDOM.style.left = $Src.offset().left - _this.uiDOM.offsetWidth + 'px';
					}
					//高度超出页面范围时保持在底部对齐
					if (_this.uiDOM.offsetTop + _this.uiDOM.offsetHeight > document.body.offsetHeight) {
						_this.uiDOM.style.top = document.body.offsetHeight - _this.uiDOM.offsetHeight - 5 + 'px';
					}
					//定位箭头的位置
					$(_this.arrow).css('top', $Src.offset().top - _this.uiDOM.offsetTop + Math.max(0, _this.offsetY) + ($Src.outerHeight(true) > 40 ? 20 : 0));
				}
			}
		}
		else {
			jPosition = {
				top:$Src.offset().top + $Src.height() + 15 + _this.offsetY,
				left:$Src.offset().left + _this.offsetX,
				addCss:['arrow-top', 'arrow-bottom'],
				dispose:function () {
					//高度超出屏幕范围时保持在底部对齐
					if (_this.uiDOM.offsetTop + _this.uiDOM.offsetHeight > Math.max(D.scrollTop, document.body.scrollTop) + D.clientHeight) {
						_this.uiDOM.style.top = D.clientHeight - _this.uiDOM.offsetHeight - 5 + 'px';
					}
					//如果保持在底部对齐时最上位置小于src对象位置，则反转箭头，并将tips层显示在上边
					if (_this.uiDOM.offsetTop < $Src.offset().top) {
						$(_this.arrow).removeClass('arrow-left arrow-right arrow-top arrow-bottom').addClass(jPosition.addCss[1]);
						_this.uiDOM.style.top = $Src.offset().top - _this.uiDOM.offsetHeight + 'px';
					}
					//宽度超出页面范围时保持在最右对齐
					if (_this.uiDOM.offsetLeft + _this.uiDOM.offsetWidth > document.body.offsetWidth) {
						_this.uiDOM.style.left = document.body.offsetWidth - _this.uiDOM.offsetWidth - 5 + 'px';
					}
					//定位箭头的位置
					$(_this.arrow).css('left', $Src.offset().left - _this.uiDOM.offsetLeft + Math.max(0, _this.offsetX) + ($Src.outerWidth(true) > 40 ? 20 : 0));
				}
			}
		}
		//设置位置
		$(_this.uiDOM).css({
			top:jPosition.top,
			left:jPosition.left
		}).show();
		_this.isInversion && jPosition.addCss.reverse();
		//添加箭头样式
		$(_this.arrow).removeClass('arrow-left arrow-right arrow-top arrow-bottom').addClass(jPosition.addCss[0]);
		//处理
		jPosition.dispose();
		$(_this.uiDOM).hide();
	}
});