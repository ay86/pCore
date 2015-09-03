/**
 * Message for pCore UI widget
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 12-12-29
 */

PCORE.widget.Message = PCORE.make(PCORE.ui, {
	isFade:false,
	hasMask:false,
	hasBorder:true,
	cancelBtn:'.cancel-btn',
	width:0,
	text:'Hello World',
	buttonsHTML:'',
	Init:function () {
		var _this = this;
		var oFrag = document.createDocumentFragment();
		if (_this.hasMask) {
			var oMask = _this.mask = document.createElement('div');
			oMask.className = 'ui-mask';
			oMask.style.height = Math.max(document.body.offsetHeight, document.documentElement.clientHeight) + 'px';
			oFrag.appendChild(oMask);
		}
		var oDiv = _this.uiDOM = document.createElement('div');
		oFrag.appendChild(oDiv);
		oDiv.className = 'ui-msg';
		if (_this.hasBorder) {
			oDiv.className += ' has-border';
		}

		var oMain = document.createElement('div');
		oMain.className = 'msg-main';
		var oContent = document.createElement('div');
		oContent.className = 'msg-content';
		oContent.innerHTML = _this.text;
		if (_this.width) {
			oContent.style.width = _this.width + 'px';
		}
		oMain.appendChild(oContent);

		if (_this.buttonsHTML) {
			var oButton = _this.button = document.createElement('div');
			oButton.className = 'msg-button';
			oButton.innerHTML = _this.buttonsHTML;
			oMain.appendChild(oButton);
			var $CancelBtn = $(oButton).children(_this.cancelBtn);
			$CancelBtn.click(function () {
				_this.close();
			});
			$CancelBtn[0] && $CancelBtn[0].focus();
		}

		oDiv.appendChild(oMain);

		document.body.appendChild(oFrag);
		oDiv.style.left = document.documentElement.clientWidth / 2 - oDiv.offsetWidth / 2 + 'px';
		oDiv.style.top = document.documentElement.clientHeight / 2 - oDiv.offsetHeight / 2 + 'px';
		_this.isFade && $(oDiv).fadeIn();
		_this.fire('INIT_OK', _this);
	},
	close:function () {
		var _this = this;

		function __fClose() {
			_this.hasMask && _this.mask.parentNode.removeChild(_this.mask);
			_this.uiDOM.parentNode.removeChild(_this.uiDOM);
			_this.fire('CLOSE', _this);
		}

		if (_this.isFade) {
			$(_this.uiDOM).fadeOut(function () {
				__fClose();
			});
		}
		else {
			__fClose();
		}
	}
});