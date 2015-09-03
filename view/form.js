/**
 * 含有验证功能的表单
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 12-12-30
 */

PCORE.view.form = PCORE.make(PCORE.view, {
	Init:function () {
		var _this = this;
		var oForm = _this.form;
		var jExplain = {};
		var jValid;
		if (!oForm) {
			return;
		}
		//拆分rules
		for (var v in _this.rules) {
			for (var vv in _this.rules[v]) {
				if (vv === 'tips') {
					jExplain[v] = _this.rules[v].tips;
					delete _this.rules[v].tips;
					break;
				}
			}
		}
		jValid = _this.rules;
		$(oForm).removeClass('ui-form').addClass('ui-form');
		for (var i = 0; i < oForm.elements.length; i++) {
			var _element = oForm.elements[i];
			//IE add PlaceHolder
			if ((_element.tagName.toUpperCase() === 'INPUT' && _element.getAttribute('type').toUpperCase() === 'TEXT') || _element.tagName.toUpperCase() == 'TEXTAREA') {
				var _ph = _element.getAttribute('placeholder');
				if (document.all && _ph) {
					if (_element.value.length == 0) {
						_element.value = _ph;
					}
					$(_element).addClass('gray');
					$(_element).focus(function () {
						if ($(this).val() == $(this).attr('placeholder')) {
							$(this).val('');
						}
						$(this).removeClass('gray');
					});
					$(_element).blur(function () {
						if ($(this).val().length === 0) {
							$(this).val($(this).attr('placeholder'));
							$(this).addClass('gray');
						}
					});
				}
			}
			//add auto check
			if (_this.isAutoCheck) {
				if (_element.tagName.toUpperCase() === 'INPUT' || _element.tagName.toUpperCase() == 'TEXTAREA') {
					$(_element).bind((_this.checkEvent || 'blur'), function () {
						this.form.validator.check(this, true);
					});
				}
				else if (_element.tagName.toUpperCase() === 'SELECT') {
					$(_element).change(function () {
						this.form.validator.check(this, true);
					});
				}
			}
		}
		//显示表单项的说明提示
		if (jExplain) {
			PCORE.debug('show explain', jExplain);
			PCORE.use('ui;widget/explain').ready(function () {
				new PCORE.ui.explain({
					target:oForm,
					data:jExplain,
					css:'form-tips'
				});
			});
		}
		//如果不存在判断条件就不实例验证组件
		if (jValid) {
			//实例表单验证
			PCORE.debug('show valid', jValid);
			PCORE.use('ui;widget/validate').ready(function () {
				oForm.validator = new PCORE.ui.validate({
					target:oForm,
					rule:jValid,
					callback:_this.callback ? {pass:_this.callback.pass, fail:_this.callback.fail} : {}
				});
				oForm.validator.on('SHOW_ERROR', function () {
					!oForm.errorList && (oForm.errorList = []);
					oForm.errorList.push(this);
					if (_this.callback && _this.callback.error && typeof _this.callback.error === 'function') {
						_this.callback.error.call(this);
					}
				});
				oForm.validator.on('CLEAR_ERROR', function () {
					if (_this.callback && _this.callback.clear && typeof _this.callback.clear === 'function') {
						_this.callback.clear.call(this);
					}
				});
				oForm.validator.on('BEFORE_SUBMIT', function () {
					if (_this.callback && _this.callback.beforeSend && typeof _this.callback.beforeSend === 'function') {
						_this.callback.beforeSend.call(this.target);
					}
				});
				oForm.validator.on('END_SUBMIT',function(){
					if (_this.callback && _this.callback.finishSend && typeof _this.callback.finishSend === 'function') {
						_this.callback.finishSend.call(this);
					}
				});
				if (!_this.isErrNotFocus) {
					PCORE.debug('set error focus.');
					oForm.validator.on('FAIL', function () {
						oForm.errorList[0].focus();
						delete oForm.errorList;
					});
				}
			});
		}
	}
});