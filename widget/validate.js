/**
 * Form Validator for pCore UI widget
 * @Author: AngusYoung
 * @Version: 1.4
 * @Update: 12-12-30
 */

PCORE.ui.validate = PCORE.make(PCORE.ui, {
	target:null,
	step:false,
	rule:{},
	removeCss:function (sCss) {
		var aCss = sCss.split(' ');
		var sOld = ' ' + this.className + ' ';
		PCORE.debug('old', this.className);
		PCORE.debug('remove these css', aCss);
		for (var i = 0; i < aCss.length; i++) {
			var _regexp = new RegExp(' ' + aCss[i] + ' ', 'g');
			PCORE.debug('remove regexp', _regexp, sOld, _regexp.test(sOld));
			sOld = sOld.replace(_regexp, ' ');
		}
		PCORE.debug('removed', sOld);
		this.className = sOld.slice(1, -1);
		PCORE.debug('class name', this.className);
		return this;
	},
	Init:function () {
		var _this = this;
		var oForm = _this.target;
		//如果有complete的callback则原有的onsubmit方法不会被执行，这是为了避免冲突
		var _old_function = oForm.onsubmit;
		_this.target.onsubmit = function () {
			_this.fire('BEFORE_SUBMIT', _this);
			var i;
			//清除预设值，或者与预设值一样的值
			for (i = 0; i < oForm.elements.length; i++) {
				var _element = oForm.elements[i];
				if (_element.tagName.toUpperCase() == 'INPUT' || _element.tagName.toUpperCase() == 'TEXTAREA') {
					if (_element.value === _element.getAttribute('placeholder')) {
						_element.value = '';
					}
				}
			}
			//全表单判断
			var bPass = true;
			for (var v in _this.rule) {
				var _aEl, _el;
				_aEl = document.getElementsByName(v);
				for (i = 0; i < _aEl.length; i++) {
					if (oForm.contains(_aEl[i])) {
						_el = _aEl[i];
						break;
					}
				}
				if (_el) {
					if (!_this.check(_el)) {
						bPass = false;
						if (_this.step) {
							break;
						}
					}
				}
			}
			if (!bPass) {
				if (typeof _this.callback.fail === 'function') {
					_this.callback.fail.call(oForm);
				}
				_this.fire('FAIL', _this);
				_this.fire('END_SUBMIT', _this.target);
				return false;
			}
			_this.fire('PASS', _this);
			if (typeof _this.callback.pass === 'function') {
				return _this.callback.pass.call(oForm);
			}
			typeof _old_function === 'function' && _old_function();
			return true;
		};
		this.fire('INIT_OK', this);
	},
	check:function (oObj, bAuto) {
		var jResult = this.validator(oObj);
		PCORE.debug('form validate result', jResult, 'and autoChecked is', bAuto);
		//检测通过，清除错误
		if (jResult.pass) {
			this.clearErr(oObj, jResult.group);
		}
		//检测不通过，显示错误
		else {
			//组出错提示
			if (jResult.group.length > 0) {
				this.writeErr(oObj, jResult.text, bAuto ? 'warn' : 'error', jResult.group);
			}
			//单项出错提示
			else {
				this.writeErr(oObj, jResult.text, bAuto ? 'warn' : 'error');
			}
		}
		return jResult.pass;
	},
	writeErr:function (oCurrentElement, sText, sClass, aGroup) {
		//结果对象
		var oResult;
		//绑定对象，如果为组项的话则是最后一个元素
		var oObj = (aGroup ? aGroup[aGroup.length - 1] : null) || oCurrentElement;
		PCORE.debug('show result element', oObj, 'and class is', sClass);
		//已存在结果对象
		if (oObj.resulter) {
			oResult = oObj.resulter;
			this.removeCss.call(oResult, 'form-warn form-error').className += ' form-' + sClass;
		}
		//不存在结果对象
		else {
			oResult = document.createElement('div');
			oResult.className = ' form-' + sClass;
			oObj.parentNode.insertBefore(oResult, oObj.nextSibling);
			oObj.resulter = oResult;
		}
		//将结果对象存入当前验证对象之中，因为如果为组验证，结果对象在上面只是保存的组最后一个成员上，当前的验证成员并没有
		oCurrentElement.resulter = oResult;
		//写入提示内容
		oResult.innerHTML = sText;
		//显示结果
		oResult.style.display = 'block';
		//计算欲设宽度
		var _width = oObj.offsetLeft + oObj.offsetWidth - oObj.parentNode.offsetLeft;
		//先附值，再以实际宽度减去与欲设宽度的差，借此清除padding border等造成的额外宽，我就是不用JQ
		oResult.style.width = _width + 'px';
		oResult.style.width = _width - (oResult.offsetWidth - _width) + 'px';
		//对当前判断元素进行状态标注
		this.removeCss.call(oCurrentElement, 'warn error').className += ' ' + sClass;
		if (!aGroup || aGroup.length == 0) {
			this.fire('SHOW_ERROR', oObj);
		}
	},
	clearErr:function (oObj, aGroup, bAll) {
		if (bAll) {
			var aElements = this.target.elements;
			for (var i = 0; i < aElements.length; i++) {
				if (aElements[i].resulter) {
					aElements[i].resulter.style.display = 'none';
					this.removeCss.call(aElements[i], 'warn error');
				}
			}
		}
		else {
			if (oObj.resulter) {
				//存在组集合，则不清除提示，因为可能存在别的单项错误提示
				if (aGroup.length === 0) {
					oObj.resulter.style.display = 'none';
				}
				this.removeCss.call(oObj, 'warn error');
			}
		}
		this.fire('CLEAR_ERROR', oObj);
	},
	validator:function (oObj, bNotGroup) {
		var _this = this;
		var _elName = oObj.getAttribute('name');
		var _elValue = oObj.value;
		var _rule = _this.rule[_elName];
		var sError, aGroup = [];
		var bPass = true;
		PCORE.debug('check', _elName);
		if (_rule) {
			PCORE.debug('show rule', _rule);
			for (var v in _rule) {
				switch (v) {
					case 'groupElement':
						//此处不用执行任何操作，有人说你干嘛不写一个bPass=true,于是我想了想，就决定了写上这一行注释
						break;
					case 'require':
						!_elValue && (bPass = false);
						break;
					case 'number':
						!!_elValue && !/[0-9]/.test(_elValue) && (bPass = false);
						break;
					case 'email':
						!/^(\w)+((\.\w+)||(\-\w+))*@(\w)+(((\.\w+)||(\-\w+))+)$/.test(_elValue) && (bPass = false);
						break;
					case 'minLength':
						var _min = parseInt(_rule[v].value, 10);
						_elValue.length < _min && (bPass = false);
						break;
					case 'maxLength':
						var _max = parseInt(_rule[v].value, 10);
						_elValue.length > _max && (bPass = false);
						break;
					case 'format':
						var _regexp = _rule[v].value;
						//使用正则匹配，如果为空则不进行检测
						!!_elValue && !_regexp.test(_elValue) && (bPass = false);
						break;
					default :
						PCORE.debug('show custom function', v, typeof _rule[v]);
						var _call = typeof _rule[v] === 'function' ? _rule[v].call(_this, oObj) : {pass:true};
						bPass = _call.pass;
						_call.error && (sError = _call.error);
				}
				if (!bPass) {
					sError = sError || _rule[v].error;
					break;
				}
			}
			//存在组项，取出每一个成员
			if (_rule['groupElement']) {
				var _aElementId = _rule['groupElement'].split(',');
				for (var i = 0; i < _aElementId.length; i++) {
					aGroup.push(document.getElementById(_aElementId[i]));
					if (_aElementId[i] === _elName) {
						_aElementId.splice(i, 1);
						i--
					}
				}
				PCORE.debug('show group element', aGroup);
				//如果单项通过并且是检测组的话
				if (bPass && !bNotGroup) {
					var _while = true;
					//循环检测组成员，直到有不通过的
					while (_while && _aElementId.length) {
						var _other_member = document.getElementById(_aElementId[0]);
						var _while_result = this.validator(_other_member, true);
						_while = _while_result.pass;
						//组成员不通过
						if (!_while) {
							PCORE.debug('member checked, fail.');
							//输出新的错误提示
							//TODO 知道这里会发生什么问题吗？我不告诉你
							this.writeErr(_other_member, _while_result.text, 'error', aGroup);
							break;
						}
						_aElementId.splice(0, 1);
					}
					//如果组项都通过则清除组集合
					_while && (aGroup = []);
				}
			}
		}
		return {
			pass:bPass,
			group:aGroup,
			text:sError
		};
	}
});