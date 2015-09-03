/**
 * Tab for pCore UI widget
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 12-11-09
 */

PCORE.ui.tab = PCORE.make(PCORE.ui, {
	length:0,
	tabs:[],
	css:'ui-tab',
	Init:function () {
		var _this = this;
		//tab的长度，如果少于一个则不执行初始化
		_this.length = _this.tabs.length;
		if (_this.length == 0) {
			return false;
		}
		_this.items = [];
		_this.contents = [];
		//创建代码片断并添加tab的主体div
		var oFrag = document.createDocumentFragment();
		var oDiv = _this.uiDOM = document.createElement('div');
		oDiv.className = _this.css;
		oFrag.appendChild(oDiv);
		//创建tab的列表ul
		var oUL = _this.taber = document.createElement('ul');
		oUL.className = 'tab-item';
		oDiv.appendChild(oUL);
		for (var i = 0; i < _this.length; i++) {
			_this.addItem(_this.tabs[i], i);
		}
		document.body.appendChild(oFrag);
		_this.currentItem = 0;
		_this.items[0].className = 'on';
		_this.contents[0].style.display = 'block';
		_this.addEvent();
		_this.fire('INIT_OK', _this);
	},
	//添加tab的列表子项
	addItem:function (oTab, nID) {
		var oDiv = this.uiDOM;
		var oUL = this.taber;
		var _li = document.createElement('li');
		_li.innerHTML = '<span>' + oTab.title + '</span>';
		_li.setAttribute('tabFor', nID);
		oUL.appendChild(_li);
		this.items.push(_li);
		//创建子项的显示内容区
		var _div = document.createElement('div');
		_div.className = 'tab-cont';
		_div.setAttribute('tabIs', nID);
		oDiv.appendChild(_div);
		this.contents.push(_div);
		//添加子项内容区的内容，可以是HTML或直接DOM元素
		var _html;
		if (typeof oTab.html === 'string') {
			_html = document.createDocumentFragment();
			_html.innerHTML = oTab.html;
		}
		else {
			oTab.html.className += ' ui-show';
			_html = oTab.html;
		}
		_div.appendChild(_html);
	},
	//选中某个子项
	select:function (nItem) {
		var _this = this;
		var _tab = _this.items[nItem];
		$(_tab).parent().children('.on').removeClass();
		_tab.className = 'on';
		for (var i = 0; i < _this.contents.length; i++) {
			_this.contents[i].style.display = 'none';
			if (_this.contents[i].getAttribute('tabIs') === _tab.getAttribute('tabFor')) {
				_this.contents[i].style.display = 'block';
				if (_this.currentItem !== i) {
					_this.currentItem = i;
					_this.fire('ON_CHANGE_SHOW', _this.contents[i]);
				}
			}
		}
	},
	//绑定列表子项的交互动作，显示对应的内容区
	addEvent:function () {
		var _this = this;
		_this.taber.onclick = function (e) {
			var _ev = window.event || e;
			var oElement = _ev.target || _ev.srcElement;
			if (oElement.parentNode.tagName.toUpperCase() === 'LI') {
				oElement = oElement.parentNode;
				if (oElement.getAttribute('tabFor') || oElement.getAttribute('tabFor') === 0) {
					_this.select(oElement.getAttribute('tabFor'));
				}

			}
		};
	}
});