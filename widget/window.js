/**
 * Window for pCore UI widget
 * @Author: AngusYoung
 * @Version: 1.3
 * @Update: 13-01-03
 */

PCORE.widget.Window = PCORE.make(PCORE.ui, {
	title: 'Hello pCore!',
	top: 0,
	left: 0,
	width: 400,
	height: 260,
	css: 'ui-win',
	hasBorder: true,
	hasShadow: false,
	hasClose: true,
	isFade: false,
	isModal: false,
	target: null,
	titlebar: null,
	mainContent: null,
	Init: function () {
		var _this = this;
		//创建一个代码片段，并先将window的主体div放到里面
		var oFrag = document.createDocumentFragment();

		var oWin = _this.uiDOM = document.createElement('div');
		oWin.className = _this.css;
		oFrag.appendChild(oWin);

		var oWrap = _this.forms = document.createElement('div');
		oWrap.className = 'win-wrap';
		oWrap.style.cssText = 'width:' + _this.width + 'px;height:' + _this.height + 'px;';
		oWin.appendChild(oWrap);

		oWin.style.cssText = 'width:' + _this.width + 'px;height:' + _this.height + 'px;';

		//如果存在窗体效果则加入相应的CSS样式名
		if (_this.hasBorder || _this.hasShadow) {
			var oMask = _this.mask = document.createElement('div');
			oMask.className = 'win-style';
			if (_this.hasBorder) {
				oMask.className += ' win-style-border';
				oMask.style.cssText = 'width:' + (_this.width + 20) + 'px;height:' + (_this.height + 20) + 'px;';

				oWin.style.width = (_this.width + 20) + 'px';
				oWin.style.height = (_this.height + 20) + 'px';

				oWrap.style.left = '10px';
				oWrap.style.top = '10px';
			}
			if (_this.hasShadow) {
				oMask.className += ' win-style-shadow';
			}
			oWin.appendChild(oMask);
		}

		//判断是否要添加关闭按钮
		if (_this.hasClose) {
			var oClose = _this.closeBtn = document.createElement('a');
			oClose.className = 'win-close';
			oClose.setAttribute('href', '#');
			oClose.innerHTML = 'x';
			oWrap.appendChild(oClose);
			oClose.onclick = function () {
				_this.close();
				return false;
			};
		}

		//添加标题
		var oTitle = _this.titlebar = document.createElement('h1');
		oTitle.className = 'win-title';
		oWrap.appendChild(oTitle);

		//添加内容主体div
		var oMain = _this.mainContent = document.createElement('div');
		oMain.className = 'win-main';
		oWrap.appendChild(oMain);

		//判断弹出层是否模态形式
		if (_this.isModal) {
			var oModal = _this.modal = document.createElement('div');
			oModal.className = 'ui-modal';
			oModal.style.width = Math.max(document.documentElement.clientWidth, document.body.offsetWidth) + 'px';
			oModal.style.height = Math.max(document.documentElement.clientHeight, document.body.offsetHeight) + 'px';
			document.body.appendChild(oModal);
		}
		document.body.appendChild(oFrag);

		_this.updateTitle();
		//_this.updateContent();
		_this.rePosition();

		_this.fire('INIT_OK', _this);
	},
	//关闭窗体操作
	close: function (fCallBack) {
		var _this = this;
		//TODO
		$(this.uiDOM).fadeOut(function () {
			_this.fire('CLOSE', this);
			_this.uiDOM.parentNode.removeChild(_this.uiDOM);
			if (_this.modal) {
				_this.modal.parentNode.removeChild(_this.modal);
				delete  _this.modal;
			}
			delete _this.mainContent;
			delete _this.titlebar;
			delete _this.forms;
			delete _this.uiDOM;

			if (typeof fCallBack === 'function') {
				fCallBack();
			}
		});
	},
	//更新标题内容
	updateTitle: function (s) {
		this.titlebar.innerHTML = s || this.title;
		this.fire('UPDATE_TITLE', this);
	},
	//更新主体内容
	updateContent: function (x, bInsert) {
		this.mainContent.innerHTML = '';
		//判断是否为HTML或者直接的DOM对象
		if (typeof x == 'string' || x === void(0)) {
			this.mainContent.innerHTML = x || '';
		}
		else {
			x.className += ' ui-show';
			if (bInsert) {
				this.target = x.parentNode;
				this.target.appendChild(this.uiDOM);
			}
			this.mainContent.appendChild(x);
		}
		this.fire('UPDATE_CONTENT', this);
	},
	//重绘窗口位置于屏幕居中
	rePosition: function () {
		var _elem = this.uiDOM;
		var _dom = document.documentElement;
		var nScrollTop = Math.max(_dom.scrollTop, document.body.scrollTop);
		var nScrollLeft = Math.max(_dom.scrollLeft, document.body.scrollLeft);
		if (this.top > 0) {
			_elem.style.top = this.top + 'px';
		}
		else {
			_elem.style.top = nScrollTop + Math.max(_dom.clientHeight / 2 - _elem.offsetHeight / 2, 0) + 'px';
		}
		if (this.left > 0) {
			_elem.style.left = this.left + 'px';
		}
		else {
			_elem.style.left = nScrollLeft + _dom.clientWidth / 2 - _elem.offsetWidth / 2 + 'px';
		}
	},
	//更改窗体高度，数值为内容区高度
	updateHeight: function (n) {
		if (!isNaN(parseInt(n, 10))) {
			this.forms.style.height = n + 'px';
			this.mask.style.height = (n + 20) + 'px';
			this.uiDOM.style.height = (n + 20) + 'px';
			this.rePosition();
			this.fire('UPDATE_HEIGHT', this);
		}
	},
	//更改窗体宽度，数值为内容区宽度
	updateWidth: function (n) {
		if (!isNaN(parseInt(n, 10))) {
			this.forms.style.width = n + 'px';
			this.mask.style.width = (n + 20) + 'px';
			this.uiDOM.style.width = (n + 20) + 'px';
			this.rePosition();
			this.fire('UPDATE_WIDTH', this);
		}
	}
});