/**
 * Form Explain for pCore UI widget
 * @Author: AngusYoung
 * @Version: 1.1
 * @Update: 12-11-26
 */

PCORE.ui.explain = PCORE.make(PCORE.ui, {
	target:null,
	data:{},
	css:'',
	Init:function () {
		var _this = this;
		var oForm = _this.target;
		this.frag = document.createDocumentFragment();
		for (var v in this.data) {
			var _aEl = document.getElementsByName(v);
			for (var i = 0; i < _aEl.length; i++) {
				if (oForm.contains(_aEl[i])) {
					var _el = _aEl[i];
					break;
				}
			}
			if (_el) {
				this.add(_el, this.data[v]);
				$(_el).focus(function () {
					_this.show(this);
				});
				$(_el).blur(function () {
					_this.hide(this);
				});
			}
		}
		document.body.appendChild(this.frag);
		this.fire('INIT_OK', this);
	},
	add:function (oObj, sText) {
		var _explain = document.createElement('div');
		_explain.className = this.css;
		_explain.style.display = 'none';
		_explain.innerHTML = sText;
		this.frag.appendChild(_explain);
		oObj.explainer = _explain;
	},
	show:function (oObj) {
		if (oObj.explainer) {
			oObj.explainer.style.display = 'block';
			//加样式
			$(oObj.explainer).css({
				'left':$(oObj).offset().left + $(oObj).innerWidth(),
				'top':$(oObj).offset().top
			});
		}
	},
	hide:function (oObj) {
		if (oObj.explainer) {
			oObj.explainer.style.display = 'none';
		}
	}
});